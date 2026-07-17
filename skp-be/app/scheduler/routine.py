
from datetime import date, datetime
from sqlalchemy import select
from app.db import AsyncSessionLocal  # Import your real db session
from app.models import RoutineSetting, Routine  # Import your models
from app.utility.schedule_generator import generate_schedules  # The schedule generator we updated earlier
from app.models import RoutineSchedule
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlmodel import Session, select, and_  
import httpx
from app.db import engine # Your SQLModel/SQLAlchemy engine
from datetime import datetime, timezone, timedelta
scheduler = AsyncIOScheduler()

async def generate_weekly_schedules_job():
    """
    Runs automatically on the background thread.
    """
    async with AsyncSessionLocal() as db:
        # 1. Fetch all active routine settings
        stmt = (
            select(RoutineSetting)
            .join(RoutineSetting.routine)
            .where(Routine.deleted_at.is_(None))
        )
        result = await db.execute(stmt)
        active_settings = result.scalars().all()
        
        today_monday = date.today() 
        now = datetime.utcnow()
        
        for setting in active_settings:
            should_generate = (
                setting.repeat_type in ("ONCE", "DAILY") or 
                (setting.repeat_type == "WEEKLY" and setting.day_of_week)
            )
            
            if should_generate:
                generated = generate_schedules(
                    routine_id=setting.routine_id,
                    setting_id=setting.id,
                    start_time=setting.start_time,
                    end_time=setting.end_time,
                    interval=setting.interval,
                    repeat_type=setting.repeat_type,
                    day_of_week=setting.day_of_week,
                    anchor_date=today_monday  # Sets Monday as the anchor reference
                )
                
                if generated:
                    db.add_all(generated)
                    
        await db.commit()

def send_expo_push(token: str, title: str, body: str):
    """Sends the push notification payload to Expo's push service."""
    url = "https://exp.host(--/api/v2/push/send)"
    payload = {
        "to": token,
        "title": title,
        "body": body,
        "sound": "default"
    }
    try:
        response = httpx.post(url, json=payload, timeout=5.0)
        return response.status_code == 200
    except httpx.HTTPError:
        return False

async def check_and_send_routines():
    """Per-minute cron worker."""
    # 1. Truncate current time to the exact start of this minute
    now_truncated = datetime.now(timezone.utc).replace(
        second=0, 
        microsecond=0, 
        tzinfo=None
    )
    
    # 2. Add exactly 1 minute using timedelta to safely handle hour/day transitions
    next_minute = now_truncated + timedelta(minutes=1)
    
    async with AsyncSessionLocal() as session:
        # 3. Query all pending, non-deleted routines falling in this 60-second window
        statement = select(RoutineSchedule).where(
            and_(
                RoutineSchedule.status == "PENDING",
                RoutineSchedule.start_time >= now_truncated,
                RoutineSchedule.start_time < next_minute,
                RoutineSchedule.deleted_at.is_(None)
            )
        )
        result = await session.execute(statement)
        due_routines = result.scalars().all()
        
        if not due_routines:
            return

        for routine in due_routines:
            success = send_expo_push(routine.push_token, routine.title, routine.body)
            routine.status = "SENT" if success else "FAILED"
            session.add(routine)
        
        session.commit()

# def start_scheduler_push_notif_schedule():
#     scheduler = BackgroundScheduler()
#     # Runs exactly every minute at the 00th second mark
#     scheduler.add_job(check_and_send_routines, 'cron', minute='*')
#     scheduler.start()

# def run_weekly_schedules_job():
#     """
#     Synchronous wrapper for APScheduler to run the async job.
#     """
#     import asyncio
#     try:
#         # Create a clean event loop for the background thread to run the async DB task
#         loop = asyncio.new_event_loop()
#         asyncio.set_event_loop(loop)
#         loop.run_until_complete(generate_weekly_schedules_job())
#     finally:
#         loop.close()

# def start_scheduler_generate_schedule():
#     scheduler = BackgroundScheduler()
#     # Runs exactly every minute at the 00th second mark
#     scheduler.add_job(
#         run_weekly_schedules_job,
#         "cron",
#         day_of_week="mon",
#         hour=1,
#         minute=0,
#         id="weekly_schedule_generation",
#         replace_existing=True
#     )
#     scheduler.start() 

def start_all_schedulers():
    """Registers all cron jobs and boots the engine once."""
    
    # Job 1: Your per-minute push notification sender
    scheduler.add_job(
        check_and_send_routines, 
        'cron', 
        minute='*',
        id='push_notifications_job',
        replace_existing=True
    )
    
    # Job 2: Your weekly schedule generator (e.g., runs every Sunday at midnight)
    scheduler.add_job(
        generate_weekly_schedules_job, 
        'cron', 
        day_of_week='sun', 
        hour=0, 
        minute=0,
        id='weekly_generation_job',
        replace_existing=True
    )
    
    # Start the engine
    scheduler.start()
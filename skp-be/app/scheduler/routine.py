
from datetime import date, datetime
from sqlalchemy import select
from app.db import AsyncSessionLocal  # Import your real db session
from app.models import RoutineSetting, Routine  # Import your models
from app.utility.schedule_generator import generate_schedules  # The schedule generator we updated earlier

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
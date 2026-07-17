from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

from app.config import CORS_ORIGINS
from app.routers import auth
from app.routers import location
from app.routers import connect
from app.routers import routine
from app.routers import people

# 1. Import your session generator and schedule builder
from app.db import AsyncSessionLocal  # Adjust this import to match your DB session setup
from app.scheduler.routine import generate_weekly_schedules_job  # This wraps the schedule generation logic

# 2. Define the background wrapper function
def run_weekly_schedules_job():
    """
    Synchronous wrapper for APScheduler to run the async job.
    """
    import asyncio
    try:
        # Create a clean event loop for the background thread to run the async DB task
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(generate_weekly_schedules_job())
    finally:
        loop.close()

# 3. Integrate into your existing lifespan manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup the scheduler
    scheduler = BackgroundScheduler()
    
    # Configure the cron job to run every Monday at 1:00 AM
    # Dev mode
    scheduler.add_job(
        run_weekly_schedules_job,
        "cron",
        day_of_week="mon",
        hour=1,
        minute=0,
        id="weekly_schedule_generation",
        replace_existing=True
    )
    # Test mode
    # scheduler.add_job(
    #     run_weekly_schedules_job,
    #     "interval",
    #     seconds=10,
    #     id="weekly_schedule_generation",
    #     replace_existing=True
    # )
    
    # Start the scheduler
    scheduler.start()
    
    # Database schema is managed by Alembic migrations (see migrations/README).
    # Run `make migrate` to apply pending migrations.
    yield
    
    # Shutdown the scheduler cleanly when the app stops
    scheduler.shutdown()


app = FastAPI(title="SKP API", version="0.2.0", lifespan=lifespan)

if CORS_ORIGINS == ["*"]:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(auth.router)
app.include_router(location.router)
app.include_router(connect.router)
app.include_router(routine.router)
app.include_router(people.router)

@app.get("/")
def root():
    return {"name": "SKP API", "ok": True}
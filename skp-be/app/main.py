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

import httpx
from app.scheduler.routine import start_all_schedulers, scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Startup: Boot up all cron tasks inside the single manager
    start_all_schedulers()
    print("⏰ Background schedulers started successfully.")
    
    yield  
    
    scheduler.shutdown()
    print("🛑 Background schedulers shut down safely.")
    
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
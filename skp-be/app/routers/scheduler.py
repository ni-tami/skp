# app/routers/scheduler.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.database import get_session # Your DB session dependency
from app.models import RoutineSchedule
from app.schemas.scheduler import RoutineScheduleCreate, RoutineScheduleResponse

router = APIRouter(
    prefix="/api/scheduler",
    tags=["Notification Scheduler"]
)

@router.post("/", response_model=RoutineScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_routine(payload: RoutineScheduleCreate, session: Session = Depends(get_session)):
    new_routine = RoutineSchedule(
        user_id=payload.user_id,
        push_token=payload.push_token,
        title=payload.title,
        body=payload.body,
        start_time=payload.start_time,
        status="PENDING"
    )
    session.add(new_routine)
    session.commit()
    session.refresh(new_routine)
    return new_routine
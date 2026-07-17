# app/schemas/scheduler.py
from pydantic import BaseModel
from datetime import datetime

class RoutineScheduleCreate(BaseModel):
    user_id: int
    push_token: str
    title: str
    body: str
    start_time: datetime

class RoutineScheduleResponse(BaseModel):
    id: int
    user_id: int
    status: str
    start_time: datetime

    class Config:
        from_attributes = True
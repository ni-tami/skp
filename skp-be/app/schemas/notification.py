from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class NotificationOut(BaseModel):
    id: int
    user_id: int
    type: str
    payload: dict
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

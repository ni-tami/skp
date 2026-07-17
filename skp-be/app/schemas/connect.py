from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from app.schemas.auth import UserOut

class ConnectOut(BaseModel):
    id: int
    caregiver_id: int
    recipient_id: int
    accepted: bool
    code: str
    created_at: datetime
    caregiver: Optional[UserOut] = None
    recipient: Optional[UserOut] = None

    class Config:
        from_attributes = True


class GenerateCodeOut(BaseModel):
    code: str

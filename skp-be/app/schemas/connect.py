from datetime import datetime
from pydantic import BaseModel

class ConnectOut(BaseModel):
    id: int
    caregiver_id: int
    recipient_id: int
    accepted: bool
    code: str
    created_at: datetime

    class Config:
        from_attributes = True


class GenerateCodeOut(BaseModel):
    code: str

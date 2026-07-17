from datetime import datetime
from pydantic import BaseModel, EmailStr


class PeopleOut(BaseModel):
    connection_id: int
    created_at: datetime
    id: int
    email: EmailStr
    role: str
    display_name: str
    status: str

    class Config:
        from_attributes = True
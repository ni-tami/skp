from datetime import datetime, date
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field

# ---------- Auth ----------
class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    role: Literal["caregiver", "recipient"]
    display_name: str = ""


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    display_name: str
    status: str
    expo_push_token: Optional[str] = None
    home_lat: Optional[float] = None
    home_lng: Optional[float] = None
    home_radius_m: Optional[float] = None
    last_lat: Optional[float] = None
    last_lng: Optional[float] = None
    last_accuracy: Optional[float] = None
    last_seen_at: Optional[datetime] = None
    geofence_state: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

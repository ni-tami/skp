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

    class Config:
        from_attributes = True

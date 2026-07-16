from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Date, Float, ForeignKey, JSON, Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.config import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'caregiver' | 'recipient'
    display_name = Column(String, default="")
    expo_push_token = Column(String, default=None)
    status = Column(String, default="available")  # 'available' | 'busy'
    created_at: Mapped[datetime] = mapped_column(DateTime)
    updated_at: Mapped[datetime] = mapped_column(DateTime)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

from datetime import datetime, time
from typing import Optional, List

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Time,
    ForeignKey,
    Text,
    JSON,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config import Base


class RoutineCategory(Base):
    __tablename__ = "routine_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    color: Mapped[str] = mapped_column(String, nullable=False)  # e.g., "#FF6B6B"
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    routines: Mapped[List["Routine"]] = relationship("Routine", back_populates="category")

    def __repr__(self) -> str:
        return f"RoutineCategory(id={self.id!r}, name={self.name!r})"


class Routine(Base):
    __tablename__ = "routines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    care_recipient_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    caregiver_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("routine_categories.id"), nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    detail: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notifications_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    category: Mapped[RoutineCategory] = relationship("RoutineCategory", back_populates="routines")
    settings: Mapped[List["RoutineSetting"]] = relationship("RoutineSetting", back_populates="routine")
    schedules: Mapped[List["RoutineSchedule"]] = relationship("RoutineSchedule", back_populates="routine")

    def __repr__(self) -> str:
        return f"Routine(id={self.id!r}, title={self.title!r})"


class RoutineSetting(Base):
    __tablename__ = "routine_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    routine_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("routines.id"), nullable=False
    )
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    interval: Mapped[int] = mapped_column(Integer, nullable=False)  # in minutes
    repeat_type: Mapped[str] = mapped_column(String, nullable=False, default="ONCE")  # ONCE, DAILY, WEEKLY, MONTHLY, CUSTOM
    day_of_week: Mapped[Optional[List[int]]] = mapped_column(JSON, nullable=True)  # [1,2,3,...,7]
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    routine: Mapped[Routine] = relationship("Routine", back_populates="settings")
    schedules: Mapped[List["RoutineSchedule"]] = relationship("RoutineSchedule", back_populates="setting")

    def __repr__(self) -> str:
        return f"RoutineSetting(id={self.id!r}, routine_id={self.routine_id!r})"


class RoutineSchedule(Base):
    __tablename__ = "routine_schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    routine_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("routines.id"), nullable=False
    )
    setting_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("routine_settings.id"), nullable=False
    )
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="PENDING")  # PENDING, SKIPPED, COMPLETED, UNCONFIRMED
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    routine: Mapped[Routine] = relationship("Routine", back_populates="schedules")
    setting: Mapped[RoutineSetting] = relationship("RoutineSetting", back_populates="schedules")

    def __repr__(self) -> str:
        return f"RoutineSchedule(id={self.id!r}, routine_id={self.routine_id!r}, status={self.status!r})"

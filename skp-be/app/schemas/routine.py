from datetime import datetime, time
from typing import Optional, List, Literal
from pydantic import BaseModel


# ---------- RoutineCategory ----------
class RoutineCategoryCreate(BaseModel):
    name: str
    color: str


class RoutineCategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None


class RoutineCategory(BaseModel):
    id: int
    name: str
    color: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------- RoutineSetting ----------
class RoutineSettingCreate(BaseModel):
    routine_id: int
    start_time: time
    end_time: time
    interval: int
    repeat_type: Literal["ONCE", "DAILY", "WEEKLY", "MONTHLY", "CUSTOM"] = "ONCE"
    day_of_week: Optional[List[Literal[1, 2, 3, 4, 5, 6, 7]]] = None


class RoutineSettingUpdate(BaseModel):
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    interval: Optional[int] = None
    repeat_type: Optional[Literal["ONCE", "DAILY", "WEEKLY", "MONTHLY", "CUSTOM"]] = None
    day_of_week: Optional[List[Literal[1, 2, 3, 4, 5, 6, 7]]] = None


class RoutineSetting(BaseModel):
    id: int
    routine_id: int
    start_time: time
    end_time: time
    interval: int
    repeat_type: str
    day_of_week: Optional[List[int]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------- User Minimal ----------
class UserMinimal(BaseModel):
    id: int
    display_name: str

    class Config:
        from_attributes = True


# ---------- Routine ----------
class RoutineCreate(BaseModel):
    care_recipient_id: int
    caregiver_id: int
    category_id: int
    title: str
    detail: Optional[str] = None
    notifications_enabled: bool = True
    is_active: bool = True


class RoutineUpdate(BaseModel):
    title: Optional[str] = None
    detail: Optional[str] = None
    category_id: Optional[int] = None
    notifications_enabled: Optional[bool] = None
    is_active: Optional[bool] = None


class Routine(BaseModel):
    id: int
    care_recipient_id: int
    caregiver_id: int
    category_id: int
    title: str
    detail: Optional[str]
    notifications_enabled: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------- RoutineSchedule ----------
class RoutineScheduleCreate(BaseModel):
    routine_id: int
    setting_id: int
    start_time: datetime
    end_time: datetime
    status: Literal["PENDING", "SKIPPED", "COMPLETED", "UNCONFIRMED"] = "PENDING"


class RoutineScheduleUpdate(BaseModel):
    status: Optional[Literal["PENDING", "SKIPPED", "COMPLETED", "UNCONFIRMED"]] = None
    confirmed_at: Optional[datetime] = None


class RoutineSchedule(BaseModel):
    id: int
    routine_id: int
    setting_id: int
    start_time: datetime
    end_time: datetime
    status: str
    confirmed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------- Special Response Schemas ----------
class RoutineSettingWithCategory(BaseModel):
    id: int
    name: str
    color: str

    class Config:
        from_attributes = True


class RoutineWithSetting(BaseModel):
    routine_id: int
    care_recipient: UserMinimal
    category: RoutineSettingWithCategory
    title: str
    detail: Optional[str]
    notifications_enabled: bool
    is_active: bool
    setting: RoutineSetting

    class Config:
        from_attributes = True


class RoutineSettingsResponse(BaseModel):
    caregiver: UserMinimal
    routine_settings: List[RoutineWithSetting]

    class Config:
        from_attributes = True


class RoutineForSchedule(BaseModel):
    id: int
    title: str
    detail: Optional[str]
    category: RoutineSettingWithCategory

    class Config:
        from_attributes = True


class ScheduleDetail(BaseModel):
    id: int
    status: str
    confirmed_at: Optional[datetime]
    start_time: datetime
    end_time: datetime
    routine: RoutineForSchedule

    class Config:
        from_attributes = True


class RoutineSchedulesByDateResponse(BaseModel):
    date: str
    caregiver: dict  # {"id": 5}
    care_recipient: dict  # {"id": 12}
    schedules: List[ScheduleDetail]

    class Config:
        from_attributes = True


class ScheduleMinimal(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime
    confirmed_at: Optional[datetime]
    routine: RoutineForSchedule

    class Config:
        from_attributes = True


class RoutineSchedulesByStatusResponse(BaseModel):
    status: str
    total: int
    schedules: List[ScheduleMinimal]

    class Config:
        from_attributes = True

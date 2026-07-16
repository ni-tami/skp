from app.schemas.location import Location, LocationBase, LocationCreate, LocationUpdate
from app.schemas.connect import GenerateCodeOut, ConnectOut
from app.schemas.routine import (
    # Categories
    RoutineCategory,
    RoutineCategoryCreate,
    RoutineCategoryUpdate,
    # Settings
    RoutineSetting,
    RoutineSettingCreate,
    RoutineSettingUpdate,
    # Core Routines
    Routine,
    RoutineCreate,
    RoutineUpdate,
    # Schedules
    RoutineSchedule,
    RoutineScheduleCreate,
    RoutineScheduleUpdate,
    # Specialized Responses
    RoutineSettingWithCategory,
    RoutineWithSetting,
    RoutineSettingsResponse,
    RoutineForSchedule,
    ScheduleDetail,
    RoutineSchedulesByDateResponse,
    ScheduleMinimal,
    RoutineSchedulesByStatusResponse,
    UserMinimal,
)

__all__ = [
    # Location Schemas
    "Location",
    "LocationBase",
    "LocationCreate",
    "LocationUpdate",
    
    # Connection Schemas
    "ConnectOut",
    "GenerateCodeOut",
    
    # Routine Category Schemas
    "RoutineCategory",
    "RoutineCategoryCreate",
    "RoutineCategoryUpdate",
    
    # Routine Setting Schemas
    "RoutineSetting",
    "RoutineSettingCreate",
    "RoutineSettingUpdate",
    
    # Routine Core Schemas
    "Routine",
    "RoutineCreate",
    "RoutineUpdate",
    
    # Routine Schedule Schemas
    "RoutineSchedule",
    "RoutineScheduleCreate",
    "RoutineScheduleUpdate",
    
    # Specialized Response Schemas
    "UserMinimal",
    "RoutineSettingWithCategory",
    "RoutineWithSetting",
    "RoutineSettingsResponse",
    "RoutineForSchedule",
    "ScheduleDetail",
    "RoutineSchedulesByDateResponse",
    "ScheduleMinimal",
    "RoutineSchedulesByStatusResponse",
]
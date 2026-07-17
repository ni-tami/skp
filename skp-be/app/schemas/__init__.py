from app.schemas.connect import GenerateCodeOut, ConnectOut
from app.schemas.location import GeofenceIn, GeofenceOut, PointAck, PointIn
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
    RoutineSettingResponse
)
from app.schemas.people import PeopleOut

__all__ = [
    # Connection
    "ConnectOut",
    "GenerateCodeOut",
    "PeopleOut",

    # Geofencing
    "GeofenceIn",
    "GeofenceOut",
    "PointAck",
    "PointIn",
    
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
    "RoutineSettingResponse"
]

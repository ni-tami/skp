from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LocationBase(BaseModel):
    user_id: int
    latitude: float
    longitude: float | None = None


class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    user_id: int | None = None
    latitude: float | None = None
    longitude: float | None = None


class Location(LocationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# ---------- Location ----------
class GeofenceIn(BaseModel):
    recipient_id: int
    home_lat: float
    home_lng: float
    home_radius_in_m: float = Field(gt=0)


class GeofenceOut(BaseModel):
    recipient_id: int

    home_lat: Optional[float] = None
    home_lng: Optional[float] = None
    home_radius_in_m: Optional[float] = None
    last_lat: Optional[float] = None
    last_lng: Optional[float] = None
    last_accuracy: Optional[float] = None
    last_seen_at: Optional[datetime] = None
    geofence_state: Optional[str] = None



class PointIn(BaseModel):
    lat: float
    lng: float
    accuracy: Optional[float] = None


class PointAck(BaseModel):
    ok: bool = True
    state: Optional[str] = None
    alerted: bool = False

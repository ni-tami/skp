from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON
from datetime import datetime
from app.config import Base

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(
        String, nullable=False
    )  # 'nudge' | 'geofence_exit' | 'geofence_entry'
    payload = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)

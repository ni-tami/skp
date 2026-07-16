from datetime import datetime
from sqlalchemy import Integer, Column, ForeignKey, String, DateTime, Boolean
from app.config import Base

class Connection(Base):
    __tablename__ = "connections"
    id = Column(Integer, primary_key=True)
    caregiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    code = Column(String(8), unique=True, nullable=False, index=True)
    accepted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

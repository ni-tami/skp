from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session

from app.config import SessionLocal
from app.models import User
from app.security import decode_token


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    authorization: str = Header(default=""),
    db: Session = Depends(get_db),
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="missing bearer token")
    token = authorization.split(" ", 1)[1]
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="invalid token")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="user not found")
    return user


def require_role(role: str):
    def _dep(user: User = Depends(get_current_user)) -> User:
        if user.role != role:
            raise HTTPException(status_code=403, detail=f"role {role} required")
        return user
    return _dep
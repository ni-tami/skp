from fastapi import Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.connection import get_db
from app.models import User
from app.security import decode_token


async def get_current_user(
    authorization: str = Header(default=""),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="missing bearer token")
    token = authorization.split(" ", 1)[1]
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="invalid token")
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="user not found")
    return user


def require_role(role: str):
    async def _dep(user: User = Depends(get_current_user)) -> User:
        if user.role != role:
            raise HTTPException(status_code=403, detail=f"role {role} required")
        return user
    return _dep
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..deps import get_db
from ..models.user import User
from ..schemas.auth import SignupIn, LoginIn, TokenOut, UserOut
from ..security import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenOut)
async def signup(body: SignupIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="email already registered")
    user = User(
        email=body.email,
        password_hash=hash_password(body.password),
        role=body.role,
        display_name=body.display_name
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return TokenOut(access_token=create_token(user.id), user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenOut)
async def login(body: LoginIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid credentials")
    return TokenOut(access_token=create_token(user.id), user=UserOut.model_validate(user))
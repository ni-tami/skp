from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_db, get_current_user
from ..models import User, Connection
from ..schemas import PeopleOut

router = APIRouter(prefix="/people", tags=["people"])


@router.get("", response_model=list[PeopleOut])
async def list_people(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role == "caregiver":
        stmt = (
            select(Connection, User)
            .join(User, User.id == Connection.recipient_id)
            .where(Connection.caregiver_id == user.id, Connection.accepted == True)  # noqa: E712
        )
    elif user.role == "recipient":
        stmt = (
            select(Connection, User)
            .join(User, User.id == Connection.caregiver_id)
            .where(Connection.recipient_id == user.id, Connection.accepted == True)  # noqa: E712
        )
    else:
        raise HTTPException(status_code=403, detail="unknown role")

    result = await db.execute(stmt)
    rows = result.all()
    return [
        PeopleOut(
            connection_id=conn.id,
            created_at=conn.created_at,
            id=u.id,
            email=u.email,
            role=u.role,
            display_name=u.display_name,
            status=u.status,
        )
        for conn, u in rows
    ]
import secrets
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..deps import get_db, get_current_user, require_role
from ..models import User, Connection
from ..schemas import ConnectOut, GenerateCodeOut

router = APIRouter(prefix="/connect", tags=["connect"])


def _gen_code() -> str:
    return secrets.token_hex(3).upper()  # 6 hex chars


@router.post("/generate", response_model=GenerateCodeOut)
async def generate_code(
    db: Session = Depends(get_db),
    user: User = Depends(require_role("recipient")),
):
    code = _gen_code()
    connection = Connection(recipient_id=user.id, caregiver_id=user.id, code=code, accepted=False)
    db.add(connection)
    await db.commit()
    await db.refresh(connection)
    return GenerateCodeOut(code=connection.code)


@router.post("/{code}/accept", response_model=ConnectOut)
async def accept_code(
    code: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("caregiver")),
):
    result = await db.execute(select(Connection).filter_by(code=code, accepted=False))
    connection = result.scalar_one_or_none()
    if not connection:
        raise HTTPException(status_code=404, detail="invalid or already-used code")
    if connection.recipient_id == user.id:
        raise HTTPException(status_code=400, detail="cannot connection to yourself")
    connection.caregiver_id = user.id
    connection.accepted = True
    await db.commit()
    await db.refresh(connection)
    return connection


@router.get("", response_model=list[ConnectOut])
async def get_connection(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = await db.query(Connection).filter(Connection.accepted == True)  # noqa: E712
    if user.role == "caregiver":
        q = q.filter(Connection.caregiver_id == user.id)
    else:
        q = q.filter(Connection.recipient_id == user.id)
    return q.all()


@router.delete("/{connection_id}")
async def delete_connection(
    connection_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    connection = await db.get(Connection, connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="connection not found")
    if connection.caregiver_id != user.id and connection.recipient_id != user.id:
        raise HTTPException(status_code=403, detail="not your connection")
    await db.delete(connection)
    await db.commit()
    return {"ok": True}

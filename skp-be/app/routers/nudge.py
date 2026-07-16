from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..deps import get_db, get_current_user, require_role
from ..models import User, Connection, Notification
from ..repositories.push import send_push

router = APIRouter(prefix="/nudges", tags=["nudges"])


@router.post("/{routine_id}")
async def nudge(
    routine_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("caregiver")),
):
    """
    Nudge is sending notification from caregiver to recipient.
    Notification from recipient to caregiver is related to geofencing in location router
    """
    # TODO routine = db.get(Routine, routine_id)
    routine = None
    if not routine:
        raise HTTPException(status_code=404, detail="routine not found")
    # verify caregiver linked to this recipient
    result = (
        db.execute(select(Connection)
        .filter_by(
            caregiver_id=user.id, recipient_id=routine.recipient_id, accepted=True
        ))
    )
    nudge = result.first()
    if not nudge:
        raise HTTPException(status_code=403, detail="not linked to recipient")
    recipient = db.get(User, routine.recipient_id)
    if not recipient:
        raise HTTPException(status_code=404, detail="recipient missing")

    notif = Notification(
        user_id=recipient.id,
        type="nudge",
        payload={
            "routine_id": routine.id,
            "title": routine.title,
            "caregiver_id": user.id,
        },
    )
    db.add(notif)
    db.commit()
    # push
    await send_push(
        [recipient.expo_push_token] if recipient.expo_push_token else [],
        title="Reminder",
        body=f"{routine.title} — {routine.time}",
        data={"type": "nudge", "routine_id": routine.id},
        priority="default",
        sound="default",
    )
    return {"ok": True, "sent": bool(recipient.expo_push_token)}

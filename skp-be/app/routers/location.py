import math
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.utility.push import send_push

from ..deps import get_db, get_current_user, require_role
from ..models import User, Connection
from ..schemas import GeofenceIn, GeofenceOut, PointIn, PointAck

router = APIRouter(prefix="/location", tags=["location"])


def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


async def _check_already_accept_connect(db: Session, caregiver_id: int, recipient_id: int) -> None:
    result = (
        await db.execute(select(Connection)
        .filter_by(caregiver_id=caregiver_id, recipient_id=recipient_id, accepted=True))
    )
    ok = result.scalar_one_or_none()
    if not ok:
        raise HTTPException(status_code=403, detail="not linked to recipient")


def _fetch_caregiver_tokens(db: Session, recipient_id: int) -> list[str]:
    # NOTE used in sending push notification
    rows = (
        db.query(User)
        .join(Connection, Connection.caregiver_id == User.id)
        .filter(Connection.recipient_id == recipient_id, Connection.accepted == True)  # noqa: E712
        .all()
    )
    return [u.expo_push_token for u in rows if u.expo_push_token]


# --- Geofence management (caregiver) ---
@router.post("/geofence", response_model=GeofenceOut)
async def set_geofence(
    body: GeofenceIn,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("caregiver")),
):
    await _check_already_accept_connect(db, user.id, body.recipient_id)
    recipient = await db.get(User, body.recipient_id)
    if not recipient or recipient.role != "recipient":
        raise HTTPException(status_code=404, detail="recipient not found")
    recipient.home_lat = body.home_lat
    recipient.home_lng = body.home_lng
    recipient.home_radius_in_m = body.home_radius_in_m
    # reset state baseline; next point will re-establish inside/outside silently
    recipient.geofence_state = None
    await db.commit()
    await db.refresh(recipient)
    return GeofenceOut(
        recipient_id=recipient.id,
        home_lat=recipient.home_lat,
        home_lng=recipient.home_lng,
        home_radius_in_m=recipient.home_radius_in_m,
        last_lat=recipient.last_lat,
        last_lng=recipient.last_lng,
        last_accuracy=recipient.last_accuracy,
        last_seen_at=recipient.last_seen_at,
        geofence_state=recipient.geofence_state,
    )


@router.get("/geofence", response_model=GeofenceOut)
async def get_geofence(
    recipient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role == "recipient":
        if user.id != recipient_id:
            raise HTTPException(status_code=403, detail="not your geofence")
    else:
        await _check_already_accept_connect(db, user.id, recipient_id)
    r = db.get(User, recipient_id)
    if not r:
        raise HTTPException(status_code=404, detail="recipient not found")
    return GeofenceOut(
        recipient_id=r.id,
        home_lat=r.home_lat,
        home_lng=r.home_lng,
        home_radius_in_m=r.home_radius_in_m,
        last_lat=r.last_lat,
        last_lng=r.last_lng,
        last_accuracy=r.last_accuracy,
        last_seen_at=r.last_seen_at,
        geofence_state=r.geofence_state,
    )


@router.delete("/geofence")
async def clear_geofence(
    recipient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("caregiver")),
):
    await _check_already_accept_connect(db, user.id, recipient_id)
    r = db.get(User, recipient_id)
    if not r:
        raise HTTPException(status_code=404, detail="recipient not found")
    r.home_lat = None
    r.home_lng = None
    r.home_radius_in_m = None
    r.geofence_state = None
    await db.commit()
    return {"ok": True}


# --- Recipient ingests a point, calc distance ---
@router.post("/point", response_model=PointAck)
async def post_point(
    body: PointIn,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("recipient")),
):
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    user.last_lat = body.lat
    user.last_lng = body.lng
    user.last_accuracy = body.accuracy
    user.last_seen_at = now

    alerted = False
    state = user.geofence_state
    tokens = _fetch_caregiver_tokens(db, user.id)
    if user.home_lat is not None and user.home_lng is not None and user.home_radius_in_m:
        dist = _haversine_m(body.lat, body.lng, user.home_lat, user.home_lng)
        currently_outside = dist > user.home_radius_in_m

        prev = user.geofence_state
        if prev is None:
            # first point after geofence set/changed: establish baseline silently
            state = "outside" if currently_outside else "inside"
        else:
            if currently_outside and prev != "outside":
                # exit zone transition -> alert
                state = "outside"
                alerted = True
                await send_push(
                    tokens,
                    title="Left safe zone",
                    body="Your care recipient has left the safe zone.",
                    data={
                        "type": "geofence_exit",
                        "recipient_id": user.id,
                        "recipient_name": user.display_name,
                        "last_lat": user.last_lat,
                        "last_lng": user.last_lng,
                        "dist_in_m": dist,
                    },
                    priority="high",
                    sound="default",
                )
            elif (not currently_outside) and prev == "outside":
                # re-entry transition
                state = "inside"
                alerted = True
                await send_push(
                    tokens,
                    title="Back in safe zone",
                    body="Your care recipient is back inside the safe zone.",
                    data={
                        "type": "geofence_entry",
                        "recipient_id": user.id,
                        "recipient_name": user.display_name,
                        "last_lat": user.last_lat,
                        "last_lng": user.last_lng,
                        "dist_in_m": dist,
                    },
                    priority="default",
                    sound="default",
                )
            else:
                state = prev
                alerted = True

        user.geofence_state = state

    await db.commit()
    await db.refresh(user)
    return PointAck(ok=True, state=state, alerted=alerted)


# --- Last known position ---


@router.get("/last", response_model=GeofenceOut)
async def get_last(
    recipient_id: int | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role == "recipient":
        r = user
    else:
        if not recipient_id:
            raise HTTPException(
                status_code=400, detail="recipient_id required for caregiver"
            )

        await _check_already_accept_connect(db, user.id, recipient_id)
        r = await db.get(User, recipient_id)
        if not r:
            raise HTTPException(status_code=404, detail="recipient not found")
    return GeofenceOut(
        recipient_id=r.id,
        home_lat=r.home_lat,
        home_lng=r.home_lng,
        home_radius_in_m=r.home_radius_in_m,
        last_lat=r.last_lat,
        last_lng=r.last_lng,
        last_accuracy=r.last_accuracy,
        last_seen_at=r.last_seen_at,
        geofence_state=r.geofence_state,
    )

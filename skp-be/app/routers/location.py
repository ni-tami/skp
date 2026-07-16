from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.connection import get_db
from app.models.location import Location
from app.schemas.location import Location as LocationSchema
from app.schemas.location import LocationCreate, LocationUpdate

router = APIRouter(prefix="/locations", tags=["location"])


@router.get("/", response_model=list[LocationSchema])
async def list_locations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location).where(Location.deleted_at.is_(None)))
    return result.scalars().all()


@router.get("/{location_id}", response_model=LocationSchema)
async def get_location(location_id: int, db: AsyncSession = Depends(get_db)):
    location = await db.get(Location, location_id)
    if location is None or location.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )
    return location


@router.post(
    "/", response_model=LocationSchema, status_code=status.HTTP_201_CREATED
)
async def create_location(payload: LocationCreate, db: AsyncSession = Depends(get_db)):
    location = Location(
        user_id=payload.user_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        display_name=payload.display_name,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        deleted_at=None,
    )
    db.add(location)
    await db.commit()
    await db.refresh(location)
    return location


@router.patch("/{location_id}", response_model=LocationSchema)
async def update_location(
    location_id: int,
    payload: LocationUpdate,
    db: AsyncSession = Depends(get_db),
):
    location = await db.get(Location, location_id)
    if location is None or location.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    for field, value in update_data.items():
        setattr(location, field, value)

    await db.commit()
    await db.refresh(location)
    return location


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
async def clear_location(location_id: int, db: AsyncSession = Depends(get_db)):
    """Hard-delete a location by id."""
    location = await db.get(Location, location_id)
    if location is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )
    await db.delete(location)
    await db.commit()


@router.post("/{location_id}/clear", status_code=status.HTTP_204_NO_CONTENT)
async def soft_clear_location(location_id: int, db: AsyncSession = Depends(get_db)):
    """Soft-delete a location by id (sets deleted_at)."""
    location = await db.get(Location, location_id)
    if location is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )
    location.deleted_at = datetime.utcnow()
    await db.commit()

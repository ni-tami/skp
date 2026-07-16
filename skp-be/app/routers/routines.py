from datetime import datetime, date as date_type
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

# Import your models and schemas (Adjust imports paths to match your layout)
from app.config import Base  # Assuming User is accessible if needed
from app.models import Routine, RoutineCategory, RoutineSetting, RoutineSchedule
from app.schemas import (
    RoutineCreate,
    RoutineUpdate,
    Routine as RoutineSchema,
    RoutineSettingsResponse,
    RoutineWithSetting,
    RoutineSchedulesByDateResponse,
    ScheduleDetail,
    RoutineSchedulesByStatusResponse,
    ScheduleMinimal,
    UserMinimal,
    RoutineSettingWithCategory,
    RoutineForSchedule
)
# Placeholder dependency for your database session
from app.db.connection import get_db

router = APIRouter(prefix="/routines", tags=["Routines"])

@router.post("/", response_model=RoutineSchema, status_code=status.HTTP_201_CREATED)
async def create_routine(payload: RoutineCreate, db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    db_routine = Routine(
        **payload.model_dump(),
        created_at=now,
        updated_at=now
    )
    db.add(db_routine)
    await db.commit()
    await db.refresh(db_routine)
    return db_routine


@router.get("/", response_model=List[RoutineSchema])
async def read_routines(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Routine)
        .where(Routine.deleted_at.is_(None))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/{routine_id}", response_model=RoutineSchema)
async def read_routine(routine_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Routine).where(and_(Routine.id == routine_id, Routine.deleted_at.is_(None)))
    )
    db_routine = result.scalar_one_or_none()
    if not db_routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    return db_routine


@router.put("/{routine_id}", response_model=RoutineSchema)
async def update_routine(routine_id: int, payload: RoutineUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Routine).where(and_(Routine.id == routine_id, Routine.deleted_at.is_(None)))
    )
    db_routine = result.scalar_one_or_none()
    if not db_routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_routine, key, value)
        
    db_routine.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(db_routine)
    return db_routine


@router.delete("/{routine_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_routine(routine_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Routine).where(and_(Routine.id == routine_id, Routine.deleted_at.is_(None)))
    )
    db_routine = result.scalar_one_or_none()
    if not db_routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    
    # Soft delete execution
    db_routine.deleted_at = datetime.utcnow()
    await db.commit()
    return None


# =====================================================================
# SPECIALIZED ENDPOINTS
# =====================================================================

@router.get("/routine_setting/{caregiver_id}", response_model=RoutineSettingsResponse)
async def get_routine_settings_by_caregiver(caregiver_id: int, db: AsyncSession = Depends(get_db)):
    # 1. Fetch Caregiver data
    caregiver_result = await db.execute(select(User).where(User.id == caregiver_id))
    caregiver_user = caregiver_result.scalar_one_or_none()
    if not caregiver_user:
        raise HTTPException(status_code=404, detail="Caregiver not found")

    # 2. Fetch routines along with their categories, settings, and care recipient details
    # We load settings directly, filtering out soft-deleted items
    stmt = (
        select(Routine)
        .options(
            joinedload(Routine.category),
            joinedload(Routine.settings)
        )
        .where(
            and_(
                Routine.caregiver_id == caregiver_id,
                Routine.deleted_at.is_(None)
            )
        )
    )
    
    routines_result = await db.execute(stmt)
    routines = routines_result.scalars().unique().all()

    routine_settings_list = []
    for r in routines:
        # Fetch care recipient data explicitly for the schema mapping
        cr_result = await db.execute(select(User).where(User.id == r.care_recipient_id))
        care_recipient_user = cr_result.scalar_one_or_none()
        
        if not care_recipient_user:
            continue

        # Each routine has zero or more active settings blocks
        for setting in r.settings:
            if setting.deleted_at is not None:
                continue
                
            routine_settings_list.append(
                RoutineWithSetting(
                    routine_id=r.id,
                    care_recipient=UserMinimal.model_validate(care_recipient_user),
                    category=RoutineSettingWithCategory.model_validate(r.category),
                    title=r.title,
                    detail=r.detail,
                    notifications_enabled=r.notifications_enabled,
                    is_active=r.is_active,
                    setting=setting
                )
            )

    return RoutineSettingsResponse(
        caregiver=UserMinimal.model_validate(caregiver_user),
        routine_settings=routine_settings_list
    )


@router.get("/routine_schedule/{caregiver_id}/{carerecipient_id}/{routineschedule_date}", response_model=RoutineSchedulesByDateResponse)
async def get_routine_schedules_by_date(
    caregiver_id: int, 
    carerecipient_id: int, 
    routineschedule_date: date_type, 
    db: AsyncSession = Depends(get_db)
):
    # Query schedules that occur on the requested date matching structural constraints
    stmt = (
        select(RoutineSchedule)
        .join(RoutineSchedule.routine)
        .options(
            joinedload(RoutineSchedule.routine).joinedload(Routine.category)
        )
        .where(
            and_(
                Routine.caregiver_id == caregiver_id,
                Routine.care_recipient_id == carerecipient_id,
                func.date(RoutineSchedule.start_time) == routineschedule_date,
                RoutineSchedule.deleted_at.is_(None)
            )
        )
    )

    result = await db.execute(stmt)
    schedules = result.scalars().unique().all()

    schedule_details = []
    for s in schedules:
        schedule_details.append(
            ScheduleDetail(
                id=s.id,
                status=s.status,
                confirmed_at=s.confirmed_at,
                start_time=s.start_time,
                end_time=s.end_time,
                routine=RoutineForSchedule(
                    id=s.routine.id,
                    title=s.routine.title,
                    detail=s.routine.detail,
                    category=RoutineSettingWithCategory.model_validate(s.routine.category)
                )
            )
        )

    return RoutineSchedulesByDateResponse(
        date=routineschedule_date.isoformat(),
        caregiver={"id": caregiver_id},
        care_recipient={"id": carerecipient_id},
        schedules=schedule_details
    )


@router.get("/routine_schedule/{caregiver_id}/{carerecipient_id}/status/{routineschedule_status}", response_model=RoutineSchedulesByStatusResponse)
async def get_routine_schedules_by_status(
    caregiver_id: int, 
    carerecipient_id: int, 
    routineschedule_status: str, 
    db: AsyncSession = Depends(get_db)
):
    # Base configuration mapping the status explicitly
    stmt = (
        select(RoutineSchedule)
        .join(RoutineSchedule.routine)
        .options(
            joinedload(RoutineSchedule.routine).joinedload(Routine.category)
        )
        .where(
            and_(
                Routine.caregiver_id == caregiver_id,
                Routine.care_recipient_id == carerecipient_id,
                RoutineSchedule.status == routineschedule_status.upper(),
                RoutineSchedule.deleted_at.is_(None)
            )
        )
    )

    result = await db.execute(stmt)
    schedules = result.scalars().unique().all()

    schedule_minimals = []
    for s in schedules:
        schedule_minimals.append(
            ScheduleMinimal(
                id=s.id,
                start_time=s.start_time,
                end_time=s.end_time,
                confirmed_at=s.confirmed_at,
                routine=RoutineForSchedule(
                    id=s.routine.id,
                    title=s.routine.title,
                    detail=s.routine.detail,
                    category=RoutineSettingWithCategory.model_validate(s.routine.category)
                )
            )
        )

    return RoutineSchedulesByStatusResponse(
        status=routineschedule_status.upper(),
        total=len(schedule_minimals),
        schedules=schedule_minimals
    )
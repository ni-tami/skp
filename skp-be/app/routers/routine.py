from datetime import datetime, date as date_type
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

# Import your models and schemas (Adjust imports paths to match your layout)
from app.config import Base  # Assuming User is accessible if needed
from app.models import Routine, RoutineCategory, RoutineSetting, RoutineSchedule, User
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
    RoutineForSchedule,
    RoutineCategoryCreate,  # Assumed schema names matching your conventions
    RoutineCategoryUpdate,
    RoutineCategory as RoutineCategorySchema,
    RoutineSettingCreate,
    RoutineSettingUpdate,
    RoutineSetting as RoutineSettingSchema,
    RoutineScheduleCreate,
    RoutineScheduleUpdate,
    RoutineSchedule as RoutineScheduleSchema

)
from app.utility.schedule_generator import generate_schedules 
from typing_extensions import Literal

# Placeholder dependency for your database session
from app.db.connection import get_db

router = APIRouter(prefix="/routine", tags=["Routine"])

# =====================================================================
# ROUTINE CRUD
# =====================================================================

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


@router.get("/{routine_id:int}", response_model=RoutineSchema)
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
# ROUTINE CATEGORY CRUD
# =====================================================================

@router.post("/category", response_model=RoutineCategorySchema, status_code=status.HTTP_201_CREATED)
async def create_routine_category(payload: RoutineCategoryCreate, db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    db_category = RoutineCategory(
        **payload.model_dump(),
        created_at=now,
        updated_at=now
    )
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category


@router.get("/category", response_model=List[RoutineCategorySchema])
async def read_routine_categories(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineCategory)
        .where(RoutineCategory.deleted_at.is_(None))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/category/{category_id}", response_model=RoutineCategorySchema)
async def read_routine_category(category_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineCategory).where(and_(RoutineCategory.id == category_id, RoutineCategory.deleted_at.is_(None)))
    )
    db_category = result.scalar_one_or_none()
    if not db_category:
        raise HTTPException(status_code=404, detail="Routine category not found")
    return db_category


@router.put("/category/{category_id}", response_model=RoutineCategorySchema)
async def update_routine_category(category_id: int, payload: RoutineCategoryUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineCategory).where(and_(RoutineCategory.id == category_id, RoutineCategory.deleted_at.is_(None)))
    )
    db_category = result.scalar_one_or_none()
    if not db_category:
        raise HTTPException(status_code=404, detail="Routine category not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)
        
    db_category.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(db_category)
    return db_category


@router.delete("/category/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_routine_category(category_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineCategory).where(and_(RoutineCategory.id == category_id, RoutineCategory.deleted_at.is_(None)))
    )
    db_category = result.scalar_one_or_none()
    if not db_category:
        raise HTTPException(status_code=404, detail="Routine category not found")
    
    db_category.deleted_at = datetime.utcnow()
    await db.commit()
    return None

# =====================================================================
# ROUTINE SETTING CRUD
# =====================================================================

# @router.post("/setting", response_model=RoutineSettingSchema, status_code=status.HTTP_201_CREATED)
# async def create_routine_setting(payload: RoutineSettingCreate, db: AsyncSession = Depends(get_db)):
#     # Optional Validation: Check if the target parent routine actually exists
#     routine_check = await db.execute(
#         select(Routine).where(and_(Routine.id == payload.routine_id, Routine.deleted_at.is_(None)))
#     )
#     if not routine_check.scalar_one_or_none():
#         raise HTTPException(status_code=404, detail="Associated active routine not found")

#     now = datetime.utcnow()
#     db_setting = RoutineSetting(
#         **payload.model_dump(),
#         created_at=now,
#         updated_at=now
#     )
#     db.add(db_setting)
#     await db.commit()
#     await db.refresh(db_setting)
#     return db_setting


@router.get("/setting", response_model=List[RoutineSettingSchema])
async def read_routine_settings(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineSetting)
        .where(RoutineSetting.deleted_at.is_(None))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/setting/{setting_id}", response_model=RoutineSettingSchema)
async def read_routine_setting(setting_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineSetting).where(and_(RoutineSetting.id == setting_id, RoutineSetting.deleted_at.is_(None)))
    )
    db_setting = result.scalar_one_or_none()
    if not db_setting:
        raise HTTPException(status_code=404, detail="Routine setting not found")
    return db_setting


@router.put("/setting/{setting_id}", response_model=RoutineSettingSchema)
async def update_routine_setting(setting_id: int, payload: RoutineSettingUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineSetting).where(and_(RoutineSetting.id == setting_id, RoutineSetting.deleted_at.is_(None)))
    )
    db_setting = result.scalar_one_or_none()
    if not db_setting:
        raise HTTPException(status_code=404, detail="Routine setting not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_setting, key, value)
        
    db_setting.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(db_setting)
    return db_setting


@router.delete("/setting/{setting_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_routine_setting(setting_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineSetting).where(and_(RoutineSetting.id == setting_id, RoutineSetting.deleted_at.is_(None)))
    )
    db_setting = result.scalar_one_or_none()
    if not db_setting:
        raise HTTPException(status_code=404, detail="Routine setting not found")
    
    db_setting.deleted_at = datetime.utcnow()
    await db.commit()
    return None

@router.get("/setting/{caregiver_id}", response_model=RoutineSettingsResponse)
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

@router.post(
    "/setting", 
    response_model=RoutineSettingSchema, 
    status_code=status.HTTP_201_CREATED
)
async def create_routine_setting(
    payload: RoutineSettingCreate, 
    db: AsyncSession = Depends(get_db)
):
    # 1. Verify that the referenced routine exists
    routine_check = await db.execute(
        select(Routine).where(
            and_(
                Routine.id == payload.routine_id, 
                Routine.deleted_at.is_(None)
            )
        )
    )
    if not routine_check.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Associated active routine not found"
        )

    now = datetime.utcnow()
    db_setting = RoutineSetting(
        **payload.model_dump(),
        created_at=now,
        updated_at=now
    )
    db.add(db_setting)
    await db.flush()  # Flush to assign db_setting.id without committing yet

    # 2. Generate and add schedules matching target weekdays & intervals
    # Checks repeat_type logic to determine if we should execute schedule generation
    should_generate = (
        db_setting.repeat_type in ("ONCE", "DAILY") or 
        (db_setting.repeat_type == "WEEKLY" and db_setting.day_of_week)
    )

    if should_generate:
        generated_schedules = generate_schedules(
            routine_id=db_setting.routine_id,
            setting_id=db_setting.id,
            start_time=db_setting.start_time,
            end_time=db_setting.end_time,
            interval=db_setting.interval,
            repeat_type=db_setting.repeat_type,  # New parameter passed here
            day_of_week=db_setting.day_of_week,  # Safely passes None if ONCE or DAILY
            anchor_date=now.date()               # Anchors schedules in the current week
        )
        if generated_schedules:
            db.add_all(generated_schedules)

    await db.commit()
    await db.refresh(db_setting)
    return db_setting

# =====================================================================
# ROUTINE SCHEDULE CRUD
# =====================================================================

@router.post("/schedule", response_model=RoutineScheduleSchema, status_code=status.HTTP_201_CREATED)
async def create_routine_schedule(payload: RoutineScheduleCreate, db: AsyncSession = Depends(get_db)):
    # Normalize uppercase status logic as observed in your original endpoints
    data = payload.model_dump()
    if "status" in data and data["status"]:
        data["status"] = data["status"].upper()

    now = datetime.utcnow()
    db_schedule = RoutineSchedule(
        **data,
        created_at=now,
        updated_at=now
    )
    db.add(db_schedule)
    await db.commit()
    await db.refresh(db_schedule)
    return db_schedule


@router.get("/schedule", response_model=List[RoutineScheduleSchema])
async def read_routine_schedules(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineSchedule)
        .where(RoutineSchedule.deleted_at.is_(None))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/schedule/{schedule_id}", response_model=RoutineScheduleSchema)
async def read_routine_schedule(schedule_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineSchedule).where(and_(RoutineSchedule.id == schedule_id, RoutineSchedule.deleted_at.is_(None)))
    )
    db_schedule = result.scalar_one_or_none()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Routine schedule not found")
    return db_schedule


@router.put("/schedule/{schedule_id}", response_model=RoutineScheduleSchema)
async def update_routine_schedule(schedule_id: int, payload: RoutineScheduleUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineSchedule).where(and_(RoutineSchedule.id == schedule_id, RoutineSchedule.deleted_at.is_(None)))
    )
    db_schedule = result.scalar_one_or_none()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Routine schedule not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    
    # Handle optional logic for status rules & auto-populating confirmed_at
    if "status" in update_data and update_data["status"]:
        update_data["status"] = update_data["status"].upper()
        if update_data["status"] == "COMPLETED" and not db_schedule.confirmed_at:
            db_schedule.confirmed_at = datetime.utcnow()

    for key, value in update_data.items():
        setattr(db_schedule, key, value)
        
    db_schedule.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(db_schedule)
    return db_schedule


@router.delete("/schedule/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_routine_schedule(schedule_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RoutineSchedule).where(and_(RoutineSchedule.id == schedule_id, RoutineSchedule.deleted_at.is_(None)))
    )
    db_schedule = result.scalar_one_or_none()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Routine schedule not found")
    
    db_schedule.deleted_at = datetime.utcnow()
    await db.commit()
    return None

@router.get("/schedule/{type}/{caregiver_id}/{carerecipient_id}/{routineschedule_date}", response_model=RoutineSchedulesByDateResponse)
async def get_routine_schedules_by_date(
    type: Literal["caregiver", "recipient"],
    caregiver_id: int, 
    carerecipient_id: int, 
    routineschedule_date: date_type, 
    db: AsyncSession = Depends(get_db)
):
    base_conditions = [
        Routine.care_recipient_id == carerecipient_id,
        func.date(RoutineSchedule.start_time) == routineschedule_date,
        RoutineSchedule.deleted_at.is_(None)
    ]
    
    if type == "caregiver":
        try:
            int_caregiver_id = int(caregiver_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="caregiver_id must be an integer when type is 'caregiver'"
            )
        base_conditions.append(Routine.caregiver_id == int_caregiver_id)
        
    elif type == "carerecipient":
        pass
        
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid type parameter. Use 'caregiver' or 'carerecipient'."
        )

    stmt = (
        select(RoutineSchedule)
        .join(RoutineSchedule.routine)
        .options(
            joinedload(RoutineSchedule.routine).joinedload(Routine.category)
        )
        .where(and_(*base_conditions))
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


@router.get("/schedule/{caregiver_id}/{carerecipient_id}/status/{routineschedule_status}", response_model=RoutineSchedulesByStatusResponse)
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

from datetime import datetime, date, timedelta, time
from typing import List
from app.models import RoutineSchedule

def generate_schedules(
    routine_id: int,
    setting_id: int,
    start_time: time,
    end_time: time,
    interval: int,
    repeat_type: str, # ONCE, DAILY, WEEKLY
    day_of_week: List[int] = None,  # Used exclusively for WEEKLY (e.g., [1, 2, 3])
    anchor_date: date = None
) -> List[RoutineSchedule]:
    if anchor_date is None:
        anchor_date = date.today()
        
    schedules = []
    now = datetime.utcnow()
    target_dates = []

    # Find the bounds of the current calendar week (Monday to Sunday)
    monday_this_week = anchor_date - timedelta(days=anchor_date.isoweekday() - 1)
    sunday_this_week = monday_this_week + timedelta(days=6)

    if repeat_type == "ONCE":
        # Strictly today
        target_dates.append(anchor_date)

    elif repeat_type == "DAILY":
        # Generate for every day starting from today until the end of this calendar week (Sunday)
        current_day = anchor_date
        while current_day <= sunday_this_week:
            target_dates.append(current_day)
            current_day += timedelta(days=1)

    elif repeat_type == "WEEKLY":
        if not day_of_week:
            return []
        for target_day in day_of_week:
            t_date = monday_this_week + timedelta(days=target_day - 1)
            # Only include if the target day is today or in the future of this week
            if t_date >= anchor_date and t_date <= sunday_this_week:
                target_dates.append(t_date)

    for target_date in target_dates:
        current_dt = datetime.combine(target_date, start_time)
        end_dt = datetime.combine(target_date, end_time)
        
        # Guard clause: If the time slot for today has already passed, skip it
        if end_dt < now:
            continue

        if current_dt < now:
            current_dt = now
            
        while current_dt <= end_dt:
            step_end = current_dt + timedelta(minutes=interval)
            if step_end > end_dt:
                step_end = end_dt

            schedules.append(
                RoutineSchedule(
                    routine_id=routine_id,
                    setting_id=setting_id,
                    start_time=current_dt,
                    end_time=step_end,
                    status="PENDING",
                    created_at=now,
                    updated_at=now
                )
            )
            current_dt += timedelta(minutes=interval)
            
    return schedules
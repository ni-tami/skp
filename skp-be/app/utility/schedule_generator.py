from datetime import datetime, date, timedelta, time
from typing import List
from app.models import RoutineSchedule

def generate_schedules_for_week(
    routine_id: int,
    setting_id: int,
    start_time: time,       # e.g., time(8, 0)
    end_time: time,         # e.g., time(8, 15)
    interval: int,          # e.g., 5 (minutes)
    day_of_week: List[int], # e.g., [4, 5, 6]
    anchor_date: date = None  # Today's date to calculate the relative week
) -> List[RoutineSchedule]:
    if anchor_date is None:
        anchor_date = date.today()
        
    schedules = []
    now = datetime.utcnow()
    
    # 1. Find the Monday of the current week (ISO weekday = 1)
    # anchor_date.isoweekday() returns 1 (Mon) through 7 (Sun)
    monday_of_week = anchor_date - timedelta(days=anchor_date.isoweekday() - 1)
    print(day_of_week)
    # 2. Iterate through each target weekday specified in day_of_week
    for target_day in day_of_week:
        # Calculate the exact calendar date for the target weekday
        target_date = monday_of_week + timedelta(days=target_day - 1)
        
        # 3. Establish the loop range using target date combined with start/end times
        current_dt = datetime.combine(target_date, start_time)
        end_dt = datetime.combine(target_date, end_time)
        
        # 4. Generate the interval steps from start_time up to and including end_time
        while current_dt <= end_dt:
            # We assume a standard duration of the interval size, or match start/end boundary
            step_end = current_dt + timedelta(minutes=interval)
            # Ensure we don't accidentally schedule past the defined routine end time
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
            print(schedules)
    return schedules
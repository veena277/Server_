from fastapi import FastAPI, Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from datetime import datetime
import models
import schemas
from database import *
from typing import Optional
from pytz import timezone

router = APIRouter()

def calculate_parking_fees(entry_time: datetime, exit_time: Optional[datetime], vehicle_type: str) -> int:
    entry_time = entry_time.astimezone(timezone("UTC"))
    if exit_time:
        exit_time = exit_time.astimezone(timezone("UTC"))
        parking_duration = exit_time - entry_time
        parking_hours = parking_duration.total_seconds() // 3600 + (1 if parking_duration.total_seconds() % 3600 > 0 else 0)  # round up to the next full hour

        if vehicle_type.lower() == "2 wheeler":
            hourly_rate = 20
        elif vehicle_type.lower() == "4 wheeler":
            hourly_rate = 40
        else:
            raise HTTPException(status_code=400, detail="Invalid vehicle type")
        
        parking_fees = int(parking_hours) * hourly_rate
        return parking_fees
    else:
        return 0

@router.post("/vehicles/", response_model=schemas.CreateVehicle)
def create_vehicle(vehicle: schemas.CreateVehicle, db: Session = Depends(get_db_vehicle)):
    print("Received vehicle data:", vehicle)
    parking_fees = calculate_parking_fees(vehicle.entry_time, vehicle.exit_time, vehicle.vehicle_type)
    
    new_vehicle = models.Vehicle(
        vehicle_id=vehicle.vehicle_id,
        vehicle_type=vehicle.vehicle_type,
        entry_time=vehicle.entry_time,
        predicted_number_plate=vehicle.predicted_number_plate,
        actual_number_plate=vehicle.actual_number_plate,
        exit_time=vehicle.exit_time,
        parking_fees=parking_fees
    )
    db.add(new_vehicle)
    db.commit()
    print("Transaction committed successfully")
    db.refresh(new_vehicle)

    if vehicle.exit_time is None:
        parking_slot = db.query(models.ParkingSlots).filter_by(vehicle_id=None).first()
        if parking_slot:
            parking_slot.vehicle_id = new_vehicle.vehicle_id
            db.commit()

    return new_vehicle

@router.put("/vehicles/{vehicle_id}/exit", response_model=schemas.CreateVehicle)
def update_exit_time(vehicle_id: int, exit_time: datetime, db: Session = Depends(get_db_vehicle)):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.vehicle_id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    vehicle.exit_time = exit_time
    vehicle.parking_fees = calculate_parking_fees(vehicle.entry_time, vehicle.exit_time, vehicle.vehicle_type)
    db.commit()
    db.refresh(vehicle)

    parking_slot = db.query(models.ParkingSlots).filter_by(vehicle_id=vehicle_id).first()
    if parking_slot:
        parking_slot.vehicle_id = None
        db.commit()

    return vehicle

@router.post("/parking_slots/", response_model=schemas.CreateParkingSlots)
def create_parking_slot(slot: schemas.CreateParkingSlots, db: Session = Depends(get_db_vehicle)):
    new_slot = models.ParkingSlots(
        slot_id=slot.slot_id,
        vehicle_id=None, 
        slot_type=slot.slot_type
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.put("/parking_slots/{slot_id}/park_vehicle/{vehicle_id}")
def park_vehicle(slot_id: int, vehicle_id: int, db: Session = Depends(get_db_vehicle)):
    slot = db.query(models.ParkingSlots).filter(models.ParkingSlots.slot_id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Parking slot not found")
    
    slot.vehicle_id = vehicle_id
    db.commit()

    return {"message": f"Vehicle {vehicle_id} parked in slot {slot_id}"}

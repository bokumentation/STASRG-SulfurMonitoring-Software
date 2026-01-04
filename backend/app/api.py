from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter()

class SensorReading(BaseModel):
    so2: float
    h2s: float
    wind_speed: float
    wind_dir: int
    lat: float
    lng: float
    # Add INA219 specific fields
    bus_voltage: float  # Volts
    current_ma: float   # Milliamps
    power_mw: float     # Milliwatts
    battery_pct: int    # Calculated percentage

@router.get("/sensors")
async def get_sensors():
    # Example INA219 data (Li-ion battery ~3.7V - 4.2V)
    bus_v = 3.95 
    curr_ma = 120.5
    
    # Simple battery percentage calculation for a 1S Li-ion
    # (Voltage - Empty) / (Full - Empty)
    pct = int((bus_v - 3.4) / (4.2 - 3.4) * 100)
    pct = max(0, min(100, pct)) # Clamp between 0-100
    
    return {
        "so2": 27.2,
        "h2s": 0.008,
        "wind_speed": 1.5,
        "wind_dir": 5,
        "lat": -6.973235,
        "lng": 107.632604,
        "timestamp": time.time(),
        "bus_voltage": bus_v,
        "current_ma": curr_ma,
        "power_mw": bus_v * curr_ma,
        "battery_pct": pct,
        "temp": 26.5,     # Add this
        "humidity": 78    # Add this
    }

# In app/api.py
@router.get("/status")
async def get_status():
    return {"status": "ok"}
import asyncio
import threading
import json
import serial
import time
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

serial_instance = None
serial_lock = threading.Lock()


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass


manager = ConnectionManager()

# --- UBAH SERIAL PORT SESUSAI OS DAN MICROCONTROLLER ---
SERIAL_PORT = "/dev/ttyACM0"  # ESP32C3
# SERIAL_PORT = "/dev/ttyUSB0" # HELTEC ESP32S3
BAUD_RATE = 115200


def serial_to_websocket_task(loop):
    global serial_instance

    with serial_lock:
        if serial_instance is not None:
            print("Serial already running, skipping duplicate thread.")
            return

        try:
            serial_instance = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
            serial_instance.reset_input_buffer()
            print(f"--- SUCCESS: Serial Port Opened on {SERIAL_PORT} ---")
        except Exception as e:
            print(f"Failed to open Serial: {e}")
            return

    try:
        while True:
            if serial_instance.in_waiting > 0:
                line = (
                    serial_instance.readline().decode("utf-8", errors="ignore").strip()
                )
                parts = line.split(",")
                if len(parts) == 7:
                    data = {
                        "so2": float(parts[0]),
                        "h2s": float(parts[1]),
                        "temp": float(parts[2]),
                        "humidity": float(parts[3]),
                        "wind_speed": float(parts[4]),
                        "bus_voltage": float(parts[5]),
                        "current_ma": float(parts[6]),
                        "lat": -6.973235,
                        "lng": 107.632604,
                        "wind_dir": 0,
                        "timestamp": time.time(),
                    }
                    asyncio.run_coroutine_threadsafe(manager.broadcast(data), loop)
    except Exception as e:
        print(f"Serial Loop Error: {e}")
    finally:
        with serial_lock:
            if serial_instance:
                serial_instance.close()
                serial_instance = None


def start_serial_worker():
    import os

    if os.environ.get("RUN_MAIN") == "true" or not os.environ.get("RELOAD"):
        loop = asyncio.get_event_loop()
        thread = threading.Thread(
            target=serial_to_websocket_task, args=(loop,), daemon=True
        )
        thread.start()
    else:
        print("Skipping thread start in watcher process...")


@router.get("/status")
async def get_status():
    return {
        "status": "online",
        "device": SERIAL_PORT,
        "serial_connected": (
            serial_instance is not None if "serial_instance" in globals() else False
        ),
    }


@router.websocket("/ws/sensors")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import router as api_router, start_serial_worker

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("--- APP STARTUP ---")
    start_serial_worker()
    yield
    print("--- APP SHUTDOWN ---")

app = FastAPI(title="Sulfur Monitoring API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    # Use the string "main:app" to allow the reloader to work properly
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
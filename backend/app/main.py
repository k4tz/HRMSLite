from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.models import Employee, Attendance  # noqa: F401 - register models for create_all
from app.routers import health, api, employees, attendance


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield
    # shutdown cleanup if needed


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(api.router, prefix="/api")
app.include_router(employees.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "HRMS Lite API", "docs": "/api/docs"}

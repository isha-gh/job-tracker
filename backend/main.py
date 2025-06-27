from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from database import database, job_applications, StatusEnum
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("Validation error for request:", await request.body())
    print("Validation details:", exc.errors())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


# Input model: id NOT required here
class JobApplicationCreate(BaseModel):
    company: str
    position: str
    status: StatusEnum
    date_applied: Optional[date] = None
    notes: Optional[str] = None


# Output model: id REQUIRED here
class JobApplication(BaseModel):
    id: int
    company: str
    position: str
    status: StatusEnum
    date_applied: Optional[date] = None
    notes: Optional[str] = None


@app.post("/applications", response_model=JobApplication)
async def create_application(app_data: JobApplicationCreate, request: Request):
    body = await request.json()
    print("Received raw JSON body:", body)
    print("Parsed Pydantic model:", app_data)

    query = job_applications.insert().values(
        company=app_data.company,
        position=app_data.position,
        status=app_data.status,
        date_applied=app_data.date_applied,
        notes=app_data.notes,
    )
    last_record_id = await database.execute(query)

    print(f"Inserted new application with id: {last_record_id}")

    return JobApplication(
        id=last_record_id,
        company=app_data.company,
        position=app_data.position,
        status=app_data.status,
        date_applied=app_data.date_applied,
        notes=app_data.notes,
    )


@app.get("/applications", response_model=List[JobApplication])
async def list_applications():
    query = job_applications.select()
    results = await database.fetch_all(query)
    # Return list of JobApplication Pydantic models
    return [JobApplication(**app) for app in results]


@app.get("/applications/{app_id}", response_model=JobApplication)
async def get_application(app_id: int):
    query = job_applications.select().where(job_applications.c.id == app_id)
    app = await database.fetch_one(query)
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return JobApplication(**app)


@app.put("/applications/{app_id}", response_model=JobApplication)
async def update_application(app_id: int, app_data: JobApplicationCreate):
    query = (
        job_applications.update()
        .where(job_applications.c.id == app_id)
        .values(
            company=app_data.company,
            position=app_data.position,
            status=app_data.status,
            date_applied=app_data.date_applied,
            notes=app_data.notes,
        )
    )
    await database.execute(query)
    return JobApplication(
        id=app_id,
        company=app_data.company,
        position=app_data.position,
        status=app_data.status,
        date_applied=app_data.date_applied,
        notes=app_data.notes,
    )


@app.delete("/applications/{app_id}")
async def delete_application(app_id: int):
    query = job_applications.delete().where(job_applications.c.id == app_id)
    await database.execute(query)
    return {"message": "Application deleted"}

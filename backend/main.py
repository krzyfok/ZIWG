from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import engine, SessionLocal
from models import Base, Doctor, Specialization, DoctorSpecialization, Availability, User, Appointment

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class LoginRequest(BaseModel):
    username: str

class AppointmentCreate(BaseModel):
    user_id: int
    availability_id: int

@app.get("/")
def read_root():
    return {"status": "Backend działa!", "technologia": "FastAPI"}

@app.get("/doctors")
def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).all()

    return doctors


@app.get("/specializations")
def get_specializations(db: Session = Depends(get_db)):
    specializations = db.query(Specialization).all()

    return specializations


@app.get("/cities")
def get_cities(db: Session = Depends(get_db)):
    cities = db.query(Doctor.city).distinct().all()

    return [city[0] for city in cities]

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    username = data.username.strip()

    if not username:
        raise HTTPException(status_code=400, detail="Nazwa użytkownika nie może być pusta")

    user = db.query(User).filter(User.username == username).first()

    if not user:
        user = User(username=username)
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "id": user.id,
        "username": user.username
    }

@app.post("/appointments")
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == data.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Nie znaleziono użytkownika")

    availability = (
        db.query(Availability)
        .filter(Availability.id == data.availability_id)
        .first()
    )

    if not availability:
        raise HTTPException(status_code=404, detail="Nie znaleziono terminu")

    if not availability.is_available:
        raise HTTPException(status_code=400, detail="Ten termin jest już zajęty")

    appointment = Appointment(
        user_id=data.user_id,
        availability_id=data.availability_id
    )

    availability.is_available = False

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return {
        "message": "Wizyta została zarezerwowana",
        "appointment_id": appointment.id
    }

@app.get("/users/{user_id}/appointments")
def get_user_appointments(user_id: int, db: Session = Depends(get_db)):
    appointments = (
        db.query(Appointment)
        .filter(Appointment.user_id == user_id)
        .all()
    )

    result = []

    for appointment in appointments:
        availability = appointment.availability
        doctor = availability.doctor

        specializations = []

        for doctor_specialization in doctor.specializations:
            specializations.append(doctor_specialization.specialization.name)

        result.append({
            "appointment_id": appointment.id,
            "date": availability.date,
            "start_time": availability.start_time,
            "end_time": availability.end_time,
            "doctor": f"{doctor.first_name} {doctor.last_name}",
            "city": doctor.city,
            "address": doctor.address,
            "specializations": specializations
        })

    return result


@app.get("/doctors/search")
def search_doctors(
    first_name: str | None = None,
    last_name: str | None = None,
    city: str | None = None,
    specialization: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Doctor)

    if first_name:
        query = query.filter(Doctor.first_name.ilike(f"%{first_name}%"))

    if last_name:
        query = query.filter(Doctor.last_name.ilike(f"%{last_name}%"))

    if city:
        query = query.filter(Doctor.city.ilike(f"%{city}%"))

    if specialization:
        query = query.join(DoctorSpecialization).join(Specialization)
        query = query.filter(Specialization.name.ilike(f"%{specialization}%"))

    doctors = query.all()

    result = []

    for doctor in doctors:
        specializations = []

        for doctor_specialization in doctor.specializations:
            specializations.append(doctor_specialization.specialization.name)

        result.append({
            "id": doctor.id,
            "first_name": doctor.first_name,
            "last_name": doctor.last_name,
            "city": doctor.city,
            "address": doctor.address,
            "description": doctor.description,
            "specializations": specializations
        })

    return result
@app.get("/doctors/{doctor_id}")
def get_doctor_details(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Nie znaleziono lekarza")

    specializations = []

    for doctor_specialization in doctor.specializations:
        specializations.append(doctor_specialization.specialization.name)

    return {
        "id": doctor.id,
        "first_name": doctor.first_name,
        "last_name": doctor.last_name,
        "city": doctor.city,
        "address": doctor.address,
        "description": doctor.description,
        "phone": doctor.phone,
        "email": doctor.email,
        "specializations": specializations
    }

@app.get("/doctors/{doctor_id}/availability")
def get_doctor_availability(doctor_id: int, db: Session = Depends(get_db)):
    availability = (
        db.query(Availability)
        .filter(
            Availability.doctor_id == doctor_id,
            Availability.is_available == True
        )
        .all()
    )

    return availability
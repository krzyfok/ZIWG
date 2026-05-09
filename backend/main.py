from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import engine, SessionLocal
from models import (
    Base,
    Doctor,
    Specialization,
    DoctorSpecialization,
    Availability,
    User,
    UserCredential,
    Appointment,
)
from auth import hash_password, verify_password

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
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str


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
    password = data.password

    if not username:
        raise HTTPException(
            status_code=400, detail="Nazwa użytkownika nie może być pusta"
        )

    if not password:
        raise HTTPException(status_code=400, detail="Hasło nie może być puste")

    user = db.query(User).filter(User.username == username).first()
    user_credential = user.credential if user else None
    if not user_credential or not verify_password(
        password, user_credential.salt, user_credential.password_hash
    ):
        raise HTTPException(status_code=401, detail="Niepoprawne dane logowania")

    return {"id": user.id, "username": user.username}


@app.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    username = data.username.strip()
    password = data.password

    if not username or not password:
        raise HTTPException(
            status_code=400, detail="Nazwa użytkownika i hasło są wymagane"
        )

    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(
            status_code=400, detail="Użytkownik o takiej nazwie już istnieje"
        )

    user = User(username=username)
    db.add(user)
    db.commit()
    db.refresh(user)

    salt, password_hash = hash_password(password)
    credential = UserCredential(user_id=user.id, salt=salt, password_hash=password_hash)
    db.add(credential)
    db.commit()

    return {"id": user.id, "username": user.username}


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
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from datetime import date, time
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
    AppointmentStatus
)
from auth import hash_password, verify_password
from typing import Optional

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

def times_overlap(start1: time, end1: time, start2: time, end2: time) -> bool:
    return start1 < end2 and start2 < end1

class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    name: str
    surname: str
    phone: str
    address: str
    password: str

class DoctorRegisterRequest(BaseModel):
    username: str
    name: str
    surname: str
    phone: str
    address: str
    password: str

    city: str
    email: str | None = None
    description: str | None = None
    specialization_id: int | None = None
    specialization_name: str | None = None

class AppointmentCreate(BaseModel):
    user_id: int
    availability_id: int

class AppointmentReschedule(BaseModel):
    availability_id: int

class DoctorUpdate(BaseModel):
    first_name: str
    last_name: str
    city: str
    address: str
    description: str | None = None
    phone: str | None = None
    email: str | None = None

class AvailabilityCreate(BaseModel):
    date: date
    start_time: time
    end_time: time

class AppointmentUpdate(BaseModel):
    status: str
    medical_notes: Optional[str] = None

class RatingUpdate(BaseModel):
    rating: int = Field(ge=1, le=5, description="Ocena w skali od 1 do 5")

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

    return {"id": user.id, "username": user.username, "role": user.role}


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

    user = User(
        username=username,
        name=data.name,
        surname=data.surname,
        phone=data.phone,
        address=data.address
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    salt, password_hash = hash_password(password)
    credential = UserCredential(user_id=user.id, salt=salt, password_hash=password_hash)
    db.add(credential)
    db.commit()

    return {"id": user.id, "username": user.username, "role": user.role}

@app.post("/register/doctor")
def register_doctor(data: DoctorRegisterRequest, db: Session = Depends(get_db)):
    username = data.username.strip()
    password = data.password

    if not username or not password:
        raise HTTPException(
            status_code=400,
            detail="Nazwa użytkownika i hasło są wymagane"
        )

    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Imię jest wymagane")

    if not data.surname.strip():
        raise HTTPException(status_code=400, detail="Nazwisko jest wymagane")

    if not data.phone.strip():
        raise HTTPException(status_code=400, detail="Numer telefonu jest wymagany")

    if not data.address.strip():
        raise HTTPException(status_code=400, detail="Adres jest wymagany")

    if not data.city.strip():
        raise HTTPException(status_code=400, detail="Miasto jest wymagane")

    existing_user = db.query(User).filter(User.username == username).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Użytkownik o takiej nazwie już istnieje"
        )

    try:
        user = User(
            username=username,
            name=data.name,
            surname=data.surname,
            phone=data.phone,
            address=data.address,
            role="doctor"
        )

        db.add(user)
        db.flush()

        salt, password_hash = hash_password(password)

        credential = UserCredential(
            user_id=user.id,
            salt=salt,
            password_hash=password_hash
        )

        db.add(credential)

        doctor = Doctor(
            user_id=user.id,
            first_name=data.name,
            last_name=data.surname,
            city=data.city,
            address=data.address,
            description=data.description,
            phone=data.phone,
            email=data.email,
            is_active=True,
            average_rating=0.0,
            reviews_count=0
        )

        db.add(doctor)
        db.flush()

        if data.specialization_id:
            specialization = (
                db.query(Specialization)
                .filter(Specialization.id == data.specialization_id)
                .first()
            )

            if not specialization:
                raise HTTPException(
                    status_code=404,
                    detail="Nie znaleziono specjalizacji"
                )

            doctor_specialization = DoctorSpecialization(
                doctor_id=doctor.id,
                specialization_id=specialization.id
            )

            db.add(doctor_specialization)

        elif data.specialization_name and data.specialization_name.strip():
            specialization_name = data.specialization_name.strip()

            specialization = (
                db.query(Specialization)
                .filter(Specialization.name.ilike(specialization_name))
                .first()
            )

            if not specialization:
                specialization = Specialization(name=specialization_name)
                db.add(specialization)
                db.flush()

            doctor_specialization = DoctorSpecialization(
                doctor_id=doctor.id,
                specialization_id=specialization.id
            )

            db.add(doctor_specialization)

        db.commit()
        db.refresh(user)
        db.refresh(doctor)

        return {
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "doctor_id": doctor.id
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Nie udało się zarejestrować lekarza"
        )


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
        availability_id=data.availability_id,
        status=AppointmentStatus.SCHEDULED
    )

    availability.is_available = False

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return {
        "message": "Wizyta została zarezerwowana",
        "appointment_id": appointment.id
    }

@app.post("/appointments/{appointment_id}/rate")
def rate_appointment(
    appointment_id: int, 
    data: RatingUpdate, 
    db: Session = Depends(get_db)
):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Nie znaleziono wizyty.")
        
    if appointment.status != "completed":
        raise HTTPException(status_code=400, detail="Można oceniać tylko zakończone wizyty.")
        
    if appointment.rating is not None:
        raise HTTPException(status_code=400, detail="Ta wizyta została już oceniona.")

    doctor = appointment.availability.doctor
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Nie znaleziono lekarza dla tej wizyty.")

    appointment.rating = data.rating
    doctor.reviews_count += 1
    
    if doctor.reviews_count == 1:
        doctor.average_rating = float(data.rating)
    else:
        old_votes = doctor.reviews_count - 1
        total_stars = (doctor.average_rating * old_votes) + data.rating
        doctor.average_rating = round(total_stars / doctor.reviews_count, 2)

    db.commit()
    db.refresh(appointment)

    return {
        "message": "Dziękujemy! Twoja ocena została zapisana.",
        "new_average": doctor.average_rating,
        "total_reviews": doctor.reviews_count
    }


@app.patch("/appointments/{appointment_id}/reschedule")
def reschedule_appointment(appointment_id: int, data: AppointmentReschedule, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Nie znaleziono wizyty")

    old_availability = appointment.availability
    new_availability = db.query(Availability).filter(Availability.id == data.availability_id).first()

    if not new_availability:
        raise HTTPException(status_code=404, detail="Nie znaleziono nowego terminu")

    if not new_availability.is_available:
        raise HTTPException(status_code=400, detail="Nowy termin jest już zajęty")

    if new_availability.doctor_id != old_availability.doctor_id:
        raise HTTPException(status_code=400, detail="Nowy termin musi należeć do tego samego lekarza")

    old_availability.is_available = True
    new_availability.is_available = False
    appointment.availability_id = new_availability.id

    db.commit()
    db.refresh(appointment)

    return {
        "message": "Termin wizyty został zmieniony",
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
            "id": appointment.id,
            "date": availability.date,
            "start_time": availability.start_time,
            "end_time": availability.end_time,
            "doctor_id": doctor.id,
            "doctor": f"{doctor.first_name} {doctor.last_name}",
            "city": doctor.city,
            "address": doctor.address,
            "specializations": specializations,
            "status": appointment.status,
            "rating": appointment.rating,
            "medical_notes": appointment.medical_notes
            
        })

    return result


@app.patch("/appointments/{appointment_id}")
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Nie znaleziono wizyty")

    availability = appointment.availability
    availability.is_available = True

    appointment.status = AppointmentStatus.CANCELLED
    db.commit()
    db.refresh(appointment)

    return {"message": "Wizyta została anulowana"}


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
            "specializations": specializations,
            "average_rating": doctor.average_rating,
            "reviews_count": doctor.reviews_count
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

@app.get("/doctors/me/{user_id}/appointments")
def get_doctor_appointments(user_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Profil lekarza nie istnieje")

    appointments = (
        db.query(Appointment)
        .join(Availability)
        .filter(Availability.doctor_id == doctor.id)
        .order_by(Availability.date, Availability.start_time)
        .all()
    )

    result = []
    
    for appointment in appointments:
        availability = appointment.availability
        patient = appointment.user  
        
        result.append({
            "id": appointment.id,
            "status": appointment.status,
            "medical_notes": appointment.medical_notes,
            "date": availability.date,
            "start_time": availability.start_time,
            "end_time": availability.end_time,
            "patient_id": patient.id,
            "patient_name": f"{patient.name} {patient.surname}",
            "patient_phone": patient.phone, 
            "patient_address": patient.address,

        })

    return result

@app.get("/doctors/me/{user_id}/appointments/{appointment_id}")
def get_single_doctor_appointment(user_id: int, appointment_id: int, db: Session = Depends(get_db)):

    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Profil lekarza nie istnieje")

    appointment = (
        db.query(Appointment)
        .join(Availability)
        .filter(
            Appointment.id == appointment_id,
            Availability.doctor_id == doctor.id  # Zabezpieczenie przed podglądaniem cudzych wizyt
        )
        .first()
    )

    if not appointment:
        raise HTTPException(status_code=404, detail="Nie znaleziono wizyty")


    availability = appointment.availability
    patient = appointment.user  

    return {
        "id": appointment.id,
        "status": appointment.status,
        "medical_notes": appointment.medical_notes,
        "date": availability.date,
        "start_time": availability.start_time,
        "end_time": availability.end_time,
        "patient_id": patient.id,
        "patient_name": f"{patient.name} {patient.surname}",
        "patient_phone": patient.phone, 
        "patient_address": patient.address,
    }

@app.get("/doctors/me/{user_id}")
def get_my_doctor_profile(user_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Profil lekarza nie istnieje")
        
    return doctor

@app.put("/doctors/me/{user_id}")
def update_doctor_profile(user_id: int, data: DoctorUpdate, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Profil lekarza nie istnieje")
    
    doctor.first_name = data.first_name
    doctor.last_name = data.last_name
    doctor.city = data.city
    doctor.address = data.address
    doctor.description = data.description
    doctor.phone = data.phone
    doctor.email = data.email
    
    db.commit()

@app.get("/doctors/me/{user_id}/availability")
def get_my_availability(user_id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Profil lekarza nie istnieje")
    
    availabilities = (
        db.query(Availability)
        .filter(Availability.doctor_id == doctor.id)
        .order_by(Availability.date, Availability.start_time)
        .all()
    )
    return availabilities

@app.post("/doctors/me/{user_id}/availability")
def create_availability(user_id: int, data: AvailabilityCreate, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Profil lekarza nie istnieje")
    
    # Validate time range
    if data.start_time >= data.end_time:
        raise HTTPException(
            status_code=400,
            detail="Godzina rozpoczęcia musi być wcześniejsza niż godzina zakończenia"
        )
    
    # Check for overlapping slots on the same day
    existing_slots = (
        db.query(Availability)
        .filter(
            Availability.doctor_id == doctor.id,
            Availability.date == data.date
        )
        .all()
    )
    
    for slot in existing_slots:
        if times_overlap(data.start_time, data.end_time, slot.start_time, slot.end_time):
            raise HTTPException(
                status_code=400,
                detail=f"Termin koliduje z istniejącym ({slot.start_time.strftime('%H:%M')} - {slot.end_time.strftime('%H:%M')})"
            )
    
    new_slot = Availability(
        doctor_id=doctor.id,
        date=data.date,
        start_time=data.start_time,
        end_time=data.end_time,
        is_available=True
    )
    
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    
    return {"message": "Dodano nowy termin", "id": new_slot.id}

@app.delete("/doctors/me/availability/{availability_id}")
def delete_availability(availability_id: int, db: Session = Depends(get_db)):
    slot = db.query(Availability).filter(Availability.id == availability_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Nie znaleziono terminu")
    
    db.delete(slot)
    db.commit()
    
    return {"message": "Termin usunięty pomyślnie"}
    return {"message": "Profil został pomyślnie zaktualizowany!"}


@app.put("/doctors/me/{user_id}/appointments/{appointment_id}")
def update_doctor_appointment(
    user_id: int, 
    appointment_id: int, 
    data: AppointmentUpdate, 
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Profil lekarza nie istnieje")

    appointment = (
        db.query(Appointment)
        .join(Availability)
        .filter(
            Appointment.id == appointment_id,
            Availability.doctor_id == doctor.id
        )
        .first()
    )

    if not appointment:
        raise HTTPException(status_code=404, detail="Nie znaleziono wizyty")
    appointment.status = data.status
    
    if data.medical_notes is not None:
        appointment.medical_notes = data.medical_notes

    if data.status == "cancelled" and appointment.availability:
        appointment.availability.is_available = True
    
    db.commit()
    db.refresh(appointment)

    return {"message": "Podsumowanie wizyty zostało zapisane pomyślnie"}
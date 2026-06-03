import enum
from sqlalchemy import Column, Integer, String, Boolean, Date, Time, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship

from database import Base

class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"       
    COMPLETED = "completed"       
    CANCELLED = "cancelled"       
    NO_SHOW = "no_show"           

class Doctor(Base):
    __tablename__ = "doctors"

    

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    address = Column(String, nullable=False)
    description = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    user_account = relationship(
        "User",
        back_populates="doctor_profile"
    )

    specializations = relationship(
        "DoctorSpecialization",
        back_populates="doctor"
    )

    availability = relationship(
        "Availability",
        back_populates="doctor"
    )


class Specialization(Base):
    __tablename__ = "specializations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)

    doctors = relationship(
        "DoctorSpecialization",
        back_populates="specialization"
    )


class DoctorSpecialization(Base):
    __tablename__ = "doctor_specializations"

    doctor_id = Column(Integer, ForeignKey("doctors.id"), primary_key=True)
    specialization_id = Column(Integer, ForeignKey("specializations.id"), primary_key=True)

    doctor = relationship(
        "Doctor",
        back_populates="specializations"
    )

    specialization = relationship(
        "Specialization",
        back_populates="doctors"
    )


class Availability(Base):
    __tablename__ = "availability"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_available = Column(Boolean, default=True)

    doctor = relationship(
        "Doctor",
        back_populates="availability"
    )
    appointments = relationship(
        "Appointment",
        back_populates="availability"
    )

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    phone = Column(Integer, nullable=False)
    address = Column(String, nullable=False)

    role = Column(String, default="patient", nullable=False)

    appointments = relationship(
        "Appointment",
        back_populates="user"
    )

    credential = relationship(
        "UserCredential",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )


    doctor_profile = relationship(
        "Doctor",
        back_populates="user_account",
        uselist=False
    )


class UserCredential(Base):
    __tablename__ = "user_credentials"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    password_hash = Column(String, nullable=False)
    salt = Column(String, nullable=False)

    user = relationship("User", back_populates="credential")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    availability_id = Column(Integer, ForeignKey("availability.id"), nullable=False)

    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.SCHEDULED, nullable=False)
    
    medical_notes = Column(Text, nullable=True)

    user = relationship(
        "User",
        back_populates="appointments"
    )

    availability = relationship(
        "Availability",
        back_populates="appointments"
    )
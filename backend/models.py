from sqlalchemy import Column, Integer, String, Boolean, Date, Time, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    address = Column(String, nullable=False)
    description = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

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
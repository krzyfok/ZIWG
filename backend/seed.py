from datetime import date, time

from database import SessionLocal, engine
from models import Base, Doctor, Specialization, DoctorSpecialization, Availability


Base.metadata.create_all(bind=engine)


def seed_database():
    db = SessionLocal()

    try:
        existing_doctors = db.query(Doctor).first()

        if existing_doctors:
            print("Dane testowe już istnieją.")
            return

        cardiology = Specialization(name="Kardiolog")
        dermatology = Specialization(name="Dermatolog")
        orthopedics = Specialization(name="Ortopeda")
        pediatrics = Specialization(name="Pediatra")

        db.add_all([cardiology, dermatology, orthopedics, pediatrics])
        db.commit()

        doctor1 = Doctor(
            first_name="Anna",
            last_name="Kowalska",
            city="Gdańsk",
            address="ul. Długa 10",
            description="Kardiolog z 10-letnim doświadczeniem.",
            phone="123456789",
            email="anna.kowalska@example.com",
        )

        doctor2 = Doctor(
            first_name="Jan",
            last_name="Nowak",
            city="Wrocław",
            address="ul. Grunwaldzka 25",
            description="Dermatolog zajmujący się chorobami skóry.",
            phone="987654321",
            email="jan.nowak@example.com",
        )

        doctor3 = Doctor(
            first_name="Maria",
            last_name="Wiśniewska",
            city="Gdynia",
            address="ul. Morska 5",
            description="Ortopeda specjalizująca się w urazach sportowych.",
            phone="555333222",
            email="maria.wisniewska@example.com",
        )

        doctor4 = Doctor(
            first_name="Piotr",
            last_name="Zieliński",
            city="Wrocław",
            address="ul. Monte Cassino 15",
            description="Pediatra przyjmujący dzieci i młodzież.",
            phone="111222333",
            email="piotr.zielinski@example.com",
        )

        db.add_all([doctor1, doctor2, doctor3, doctor4])
        db.commit()

        db.refresh(doctor1)
        db.refresh(doctor2)
        db.refresh(doctor3)
        db.refresh(doctor4)

        db.add_all([
            DoctorSpecialization(doctor_id=doctor1.id, specialization_id=cardiology.id),
            DoctorSpecialization(doctor_id=doctor2.id, specialization_id=dermatology.id),
            DoctorSpecialization(doctor_id=doctor3.id, specialization_id=orthopedics.id),
            DoctorSpecialization(doctor_id=doctor4.id, specialization_id=pediatrics.id),
        ])

        db.add_all([
            Availability(
                doctor_id=doctor1.id,
                date=date(2027, 1, 10),
                start_time=time(10, 0),
                end_time=time(10, 30),
                is_available=True,
            ),
            Availability(
                doctor_id=doctor1.id,
                date=date(2027, 1, 10),
                start_time=time(10, 30),
                end_time=time(11, 0),
                is_available=True,
            ),
            Availability(
                doctor_id=doctor2.id,
                date=date(2027, 1, 11),
                start_time=time(12, 0),
                end_time=time(12, 30),
                is_available=True,
            ),
            Availability(
                doctor_id=doctor3.id,
                date=date(2027, 1, 12),
                start_time=time(9, 0),
                end_time=time(9, 30),
                is_available=True,
            ),
            Availability(
                doctor_id=doctor4.id,
                date=date(2027, 1, 13),
                start_time=time(14, 0),
                end_time=time(14, 30),
                is_available=True,
            ),
        ])

        db.commit()
        print("Dodano dane testowe.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
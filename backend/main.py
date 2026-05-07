from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, SessionLocal
from models import Base, Doctor, Specialization

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
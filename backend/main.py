from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

@app.get("/")
def read_root():
    return {"status": "Backend działa!", "technologia": "FastAPI"}

@app.get("/api/data")
def get_data():
    return {
        "id": 1,
        "name": "Przykładowy produkt",
        "description": "To dane przesłane z FastAPI do Reacta"
    }
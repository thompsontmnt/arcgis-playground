from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.geometry import router as geometry_router
from app.core.db import Base, engine  # <-- ADD THIS

app = FastAPI(title="ArcGIS Demo API")

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <-- lock down later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-create SQLite tables on startup (Render-safe)
@app.on_event("startup")
def init_db():
    Base.metadata.create_all(bind=engine)

app.include_router(geometry_router, prefix="/geometry", tags=["geometry"])

@app.get("/")
def root():
    return {"status": "ok", "message": "ArcGIS demo backend running"}

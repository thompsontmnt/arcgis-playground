from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.geometry import router as geometry_router
from app.routers.census import router as census_router

from app.core.db import Base, engine

app = FastAPI(title="ArcGIS Demo API")

# Allow frontend (OK for now; lock down later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-create SQLite tables on startup (optional, but safe)
@app.on_event("startup")
def init_db():
    Base.metadata.create_all(bind=engine)

# Register routers AFTER app is created
app.include_router(census_router, prefix="/api", tags=["census"])
app.include_router(geometry_router, prefix="/geometry", tags=["geometry"])

@app.get("/")
def root():
    return {"status": "ok", "message": "ArcGIS demo backend running"}

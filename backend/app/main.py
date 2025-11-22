from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.geometry import router as geometry_router

app = FastAPI(title="ArcGIS Demo API")

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <-- lock down later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(geometry_router, prefix="/geometry", tags=["geometry"])

@app.get("/")
def root():
    return {"status": "ok", "message": "ArcGIS demo backend running"}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.models.geometry import Geometry
from app.schemas.geometry import GeometryCreate, GeometryRead, GeometryUpdate

router = APIRouter()

@router.post("/", response_model=GeometryRead)
def create_geometry(payload: GeometryCreate, db: Session = Depends(get_db)):
    obj = Geometry(label=payload.label, wkt=payload.wkt)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/", response_model=List[GeometryRead])
def list_geometries(db: Session = Depends(get_db)):
    return db.query(Geometry).all()

@router.get("/{geom_id}", response_model=GeometryRead)
def get_geometry(geom_id: int, db: Session = Depends(get_db)):
    return db.query(Geometry).filter(Geometry.id == geom_id).first()

@router.delete("/{geom_id}")
def delete_geometry(geom_id: int, db: Session = Depends(get_db)):
    db.query(Geometry).filter(Geometry.id == geom_id).delete()
    db.commit()
    return {"deleted": geom_id}

@router.put("/{geom_id}", response_model=GeometryRead)
def update_geometry(
    geom_id: int,
    geometry_update: GeometryUpdate,
    db: Session = Depends(get_db)
):
    # Fetch existing
    db_geom = db.query(Geometry).filter(Geometry.id == geom_id).first()

    if not db_geom:
        raise HTTPException(status_code=404, detail="Geometry not found")

    # Update fields
    if geometry_update.label is not None:
        db_geom.label = geometry_update.label
    if geometry_update.wkt is not None:
        db_geom.wkt = geometry_update.wkt

    db.commit()
    db.refresh(db_geom)

    return db_geom

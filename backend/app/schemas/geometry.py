# app/schemas/geometry.py
from typing import Optional
from pydantic import BaseModel

class GeometryBase(BaseModel):
    label: Optional[str] = None
    wkt: str

class GeometryCreate(GeometryBase):
    pass

class GeometryUpdate(BaseModel):
    label: Optional[str] = None
    wkt: Optional[str] = None 

class GeometryRead(GeometryBase):
    id: int

    class Config:
        from_attributes = True

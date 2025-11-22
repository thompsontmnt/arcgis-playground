# app/schemas/geometry.py
from pydantic import BaseModel

class GeometryBase(BaseModel):
    label: str | None = None
    wkt: str

class GeometryCreate(GeometryBase):
    pass

class GeometryUpdate(BaseModel):
    label: str | None = None
    wkt: str | None = None 

class GeometryRead(GeometryBase):
    id: int

    class Config:
        from_attributes = True

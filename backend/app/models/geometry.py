from sqlalchemy import Column, Integer, String
from app.core.db import Base

class Geometry(Base):
    __tablename__ = "geometries"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, index=True)
    wkt = Column(String, nullable=False)

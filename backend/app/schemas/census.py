from pydantic import BaseModel
from typing import List, Optional

class CensusGeometry(BaseModel):
    rings: List[List[List[float]]]
    spatialReference: Optional[dict] = None

class CensusBlockResponse(BaseModel):
    geoid: str
    state: str
    county: str
    tract: str
    block: str
    bbox: Optional[List[float]]
    geometry: CensusGeometry

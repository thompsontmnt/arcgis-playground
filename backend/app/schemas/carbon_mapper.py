from pydantic import BaseModel
from typing import Optional, List, Any


class CarbonMapperPlume(BaseModel):
    id: str
    plume_id: Optional[str] = None
    gas: Optional[str] = None
    geometry_json: Optional[Any] = None
    plume_bounds: Optional[List[float]] = None
    plume_png: Optional[str] = None
    emission_auto: Optional[float] = None
    platform: Optional[str] = None
    instrument: Optional[str] = None
    scene_timestamp: Optional[str] = None


class CarbonMapperResponse(BaseModel):
    items: List[CarbonMapperPlume]
    total_count: Optional[int] = None
    bbox_count: Optional[int] = None
    limit: Optional[int] = None
    offset: Optional[int] = None

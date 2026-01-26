import os
import httpx
from pathlib import Path
from fastapi import APIRouter, HTTPException
from typing import Optional
from dotenv import load_dotenv
from app.schemas.carbon_mapper import CarbonMapperResponse

# Load environment variables from .env.local in project root
env_path = Path(__file__).parent.parent.parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

router = APIRouter()

CARBON_MAPPER_API = "https://api.carbonmapper.org"
CARBON_MAPPER_TOKEN = os.getenv("CARBON_MAPPER_TOKEN")


@router.get("/v1/carbon-mapper/plumes", response_model=CarbonMapperResponse)
async def get_carbon_mapper_plumes(
    instrument: Optional[str] = None,
    country: Optional[str] = None,
    plume_id: Optional[str] = None,
    collection_date_start: Optional[str] = None,
    collection_date_end: Optional[str] = None,
) -> CarbonMapperResponse:
    """
    Proxy endpoint to Carbon Mapper API.
    Uses CARBON_MAPPER_TOKEN from environment variables for secure authentication.
    """
    if not CARBON_MAPPER_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="Carbon Mapper API token not configured"
        )

    # Build query parameters
    params = {}
    if instrument:
        params["instrument"] = instrument
    if country:
        params["country"] = country
    if plume_id:
        params["plume_id"] = plume_id
    if collection_date_start:
        params["collection_date_start"] = collection_date_start
    if collection_date_end:
        params["collection_date_end"] = collection_date_end

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{CARBON_MAPPER_API}/api/v1/catalog/plumes/annotated",
                params=params,
                headers={
                    "Authorization": f"Bearer {CARBON_MAPPER_TOKEN}",
                    "Content-Type": "application/json",
                },
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Carbon Mapper API error: {str(e)}"
        )

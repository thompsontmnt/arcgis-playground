from fastapi import APIRouter, HTTPException
import httpx

from app.schemas.census import CensusBlockResponse

router = APIRouter()

FCC_URL = "https://geo.fcc.gov/api/census/block/find"
TIGER_URL = (
    "https://tigerweb.geo.census.gov/arcgis/rest/services/"
    "TIGERweb/Tracts_Blocks/MapServer/identify"
)


@router.get("/census/block", response_model=CensusBlockResponse)
async def get_census_block(lat: float, lng: float):

    async with httpx.AsyncClient(timeout=15.0) as client:

        # --------------------------------------------------
        # 1. FCC LOOKUP (stable)
        # --------------------------------------------------
        fcc_res = await client.get(
            FCC_URL,
            params={"latitude": lat, "longitude": lng, "format": "json"},
        )

        if fcc_res.status_code != 200:
            raise HTTPException(500, "FCC lookup failed")

        fcc_json = fcc_res.json()
        block = fcc_json.get("Block")

        if not block:
            raise HTTPException(404, "No Census block found")

        geoid = block["FIPS"]  # full GEOID (15 digits)

        # --------------------------------------------------
        # 2. TIGERWEB LOOKUP (improved stability)
        # --------------------------------------------------
        # Smaller extent + nonzero tolerance = FAR fewer misses
        extent = f"{lng-0.005},{lat-0.005},{lng+0.005},{lat+0.005}"

        tiger_res = await client.get(
            TIGER_URL,
            params={
                "geometry": f"{lng},{lat}",
                "geometryType": "esriGeometryPoint",
                "sr": 4326,
                "layers": "all:2",
                "tolerance": 5,            # 🔥 FIX: no more intermittent fails
                "mapExtent": extent,
                "imageDisplay": "800,800,96",
                "returnGeometry": "true",
                "f": "json",
            },
        )

        tiger_json = tiger_res.json()
        results = tiger_json.get("results", [])

        # --------------------------------------------------
        # 2b. Graceful fallback
        # --------------------------------------------------
        if not results:
            # TIGER is unreliable on edges — return FCC data anyway
            return CensusBlockResponse(
                geoid=geoid,
                state=fcc_json["State"]["code"],
                county=fcc_json["County"]["FIPS"],
                tract=geoid[5:11],
                block=geoid[11:15],
                bbox=block.get("bbox"),
                geometry=None,  # no polygon available
            )

        geometry = results[0].get("geometry")

        # --------------------------------------------------
        # 3. FINAL RESPONSE
        # --------------------------------------------------
        return CensusBlockResponse(
            geoid=geoid,
            state=fcc_json["State"]["code"],
            county=fcc_json["County"]["FIPS"],
            tract=geoid[5:11],
            block=geoid[11:15],
            bbox=block.get("bbox"),
            geometry=geometry,
        )

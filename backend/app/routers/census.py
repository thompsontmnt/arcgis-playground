from fastapi import APIRouter, HTTPException
import httpx

from app.schemas.census import CensusBlockResponse

router = APIRouter()

TIGER_IDENTIFY = (
    "https://tigerweb.geo.census.gov/arcgis/rest/services/"
    "TIGERweb/Tracts_Blocks/MapServer/identify"
)

TIGER_QUERY = (
    "https://tigerweb.geo.census.gov/arcgis/rest/services/"
    "TIGERweb/Tracts_Blocks/MapServer/2/query"
)

FCC_URL = "https://geo.fcc.gov/api/census/block/find"


@router.get("/census/block", response_model=CensusBlockResponse)
async def get_census_block(lat: float, lng: float):

    async with httpx.AsyncClient(timeout=20.0) as client:

        # =======================================================
        # 1. TIGER IDENTIFY (best: polygon + attributes)
        # =======================================================

        # Wider search extent and moderate tolerance
        pad = 0.02
        extent = f"{lng-pad},{lat-pad},{lng+pad},{lat+pad}"

        identify_params = {
            "geometry": f"{lng},{lat}",
            "geometryType": "esriGeometryPoint",
            "sr": 4326,
            "layers": "all:2",
            "tolerance": 10,                  # bumped up
            "mapExtent": extent,              # expanded search window
            "imageDisplay": "800,800,96",
            "returnGeometry": "true",
            "f": "json",
        }

        id_res = await client.get(TIGER_IDENTIFY, params=identify_params)
        id_json = id_res.json()
        id_results = id_json.get("results") or []

        if id_results:
            attrs = id_results[0]["attributes"]
            geom = id_results[0]["geometry"]
            geoid = attrs["GEOID"]

            return CensusBlockResponse(
                geoid=geoid,
                state=attrs["STATE"],
                county=attrs["COUNTY"],
                tract=attrs["TRACT"],
                block=attrs["BLOCK"],
                bbox=None,
                geometry=geom,
            )

        # =======================================================
        # 2. TIGER QUERY (fallback: attributes only)
        # =======================================================
        query_params = {
            "geometry": f"{lng},{lat}",
            "geometryType": "esriGeometryPoint",
            "inSR": 4326,
            "spatialRel": "esriSpatialRelIntersects",
            "outFields": "*",
            "returnGeometry": "false",
            "f": "json",
        }

        q_res = await client.get(TIGER_QUERY, params=query_params)
        q_json = q_res.json()
        q_features = q_json.get("features") or []

        if q_features:
            attrs = q_features[0]["attributes"]
            geoid = attrs.get("GEOID")

            if geoid:
                return CensusBlockResponse(
                    geoid=geoid,
                    state=attrs.get("STATE"),
                    county=attrs.get("COUNTY"),
                    tract=attrs.get("TRACT"),
                    block=attrs.get("BLOCK"),
                    bbox=None,
                    geometry=None,   # query never returns geometry
                )

        # =======================================================
        # 3. FCC LOOKUP (last resort, unstable in cloud)
        # =======================================================
        fcc_res = await client.get(
            FCC_URL,
            params={"latitude": lat, "longitude": lng, "format": "json"},
            headers={"User-Agent": "geo-portfolio/1.0"},
        )

        if fcc_res.status_code != 200:
            raise HTTPException(500, "Could not determine Census block")

        fcc = fcc_res.json()
        block = fcc.get("Block")

        if not block:
            raise HTTPException(500, "FCC returned no block data")

        geoid = block["FIPS"]

        return CensusBlockResponse(
            geoid=geoid,
            state=fcc["State"]["code"],
            county=fcc["County"]["FIPS"],
            tract=geoid[5:11],
            block=geoid[11:15],
            bbox=block.get("bbox"),
            geometry=None,
        )

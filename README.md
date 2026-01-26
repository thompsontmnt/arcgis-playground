# ArcGIS in React Playground

An educational demo showcasing advanced geospatial workflows in React using the ArcGIS JavaScript API, TypeScript, Jotai, TanStack Query, and FastAPI.

The app demonstrates both user-generated geometry workflows (draw, edit, persist) and external geospatial data ingestion, including methane and carbon dioxide plume imagery and metrics from [Carbon Mapper](https://carbonmapper.org/).

This project is not affiliated with any employer and is intended strictly for learning and experimentation.

---

## Repository Structure

The repo is split into two main concerns:

### 1. Frontend (React + ArcGIS JS API)

A map-driven interface for interacting with vector and raster geospatial data:

- Map views supporting both 2D and 3D views
- Draw and edit polygons (reshape / vertex editing)
- Persist geometries via API
- Bidirectional selection (map ↔ list)
- Measurement display (area, perimeter)
- Render external raster overlays (plume imagery)

Complex/global state is managed with Jotai, and all async data is handled via TanStack Query.

---

### 2. Backend (FastAPI)

A lightweight API responsible for geometry persistence and third-party data access:

- Geometry CRUD endpoints  
  (`GET /geometry`, `POST /geometry`, `PUT /geometry/{id}`, `DELETE /geometry/{id}`)
  
- Proxied access to the Carbon Mapper public API
  (`GET /api/v1/carbon-mapper/plumes`)
  
- WKT-based storage for simplicity and portability
- JSON schema generation via FastAPI / Pydantic

The frontend consumes backend endpoints using generated OpenAPI clients via [hey-api](https://github.com/hey-api/openapi-ts).

---

App Overview

Map View

<img width="1501" height="799" alt="Screenshot 2025-11-25 at 8 03 10 PM" src="https://github.com/user-attachments/assets/4b0249e9-24ab-4042-9291-1ee3e6f3f4e1" />

Carbon Mapper Plumes

<img width="1485" height="776" alt="image" src="https://github.com/user-attachments/assets/bbd355f9-dc73-46ed-82c7-e84f66abcd86" />


Graphic selection

<img width="1499" height="800" alt="Screenshot 2025-11-25 at 8 04 15 PM" src="https://github.com/user-attachments/assets/0451d359-565b-4576-9db3-4cc4a1ea8569" />

Draw Polygon and persist graphic via API

![ScreenRecording2025-11-25at8 19 35PM-ezgif com-speed](https://github.com/user-attachments/assets/e83a4161-cd9f-40fd-b391-9c2481194093)

---

# Architecture Overview
**Key principles:**

- Jotai atoms provide simple, explicit global state.
- Tools use a clean `activate()` / `deactivate()` lifecycle.
- A single graphics layer is used for all map geometry.
- Components reactively update based on selection state.

---

## WKT Conversion


WKT strings are converted using:

1. [Terraformer](https://github.com/terraformer-js/terraformer) (WKT → GeoJSON)
2. ArcGIS JSON utilities (GeoJSON → ArcGIS geometry)

---


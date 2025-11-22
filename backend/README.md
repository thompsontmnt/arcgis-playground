start up:

python3.11 -m venv .venv     # only if .venv doesn’t exist
source .venv/bin/activate
uvicorn app.main:app --reload

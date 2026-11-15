Sukoaa FastAPI starter — Python 3.10+.
Create a virtual environment: python -m venv .venv
Activate on Windows PowerShell: .venv\Scripts\Activate.ps1
On macOS/Linux: source .venv/bin/activate
Install: python -m pip install -r requirements.txt
Test: python -m unittest -v
Start: python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
Open http://127.0.0.1:8000/docs for interactive API documentation.
Routes: /health, /products, /products/1; POST /products simulates creation.
This is a local Python server, not the browser Python snippet compiler.
No real records, authentication or production persistence are included.

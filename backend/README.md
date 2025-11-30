# Physical AI & Humanoid Robotics - Backend

This is the FastAPI backend for the AI-Native Book Project.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
Docs: `http://localhost:8000/docs`

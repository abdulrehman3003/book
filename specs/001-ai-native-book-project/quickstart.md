# Quickstart: AI-Native Book Project

This document provides instructions on how to set up and run the AI-Native Book Project.

## Prerequisites

- Node.js and npm
- Python 3.11
- Git

## 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

## 2. Install dependencies

### Frontend (Docusaurus)

```bash
cd frontend
npm install
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
```

## 3. Set up environment variables

Create a `.env` file in the `backend` directory and add the following environment variables:

```
QDRANT_URL=...
QDRANT_API_KEY=...
NEON_DATABASE_URL=...
```

## 4. Run the development servers

### Frontend (Docusaurus)

```bash
cd frontend
npm start
```

The Docusaurus site will be available at http://localhost:3000.

### Backend (FastAPI)

```bash
cd backend
uvicorn main:app --reload
```

The FastAPI server will be available at http://localhost:8000.

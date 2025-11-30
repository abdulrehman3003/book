import os
import glob
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import PointStruct
from typing import List, Dict, Any
import uuid
import logging

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
except KeyError:
    raise RuntimeError("GEMINI_API_KEY not found in environment variables. Please set it in your .env file.")

# Configure Qdrant client
try:
    qdrant_client = QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ.get("QDRANT_API_KEY"),
        timeout=10
    )
except KeyError:
    # For local development, use in-memory storage
    qdrant_client = QdrantClient(":memory:")
    logging.info("Using in-memory Qdrant for local development")

app = FastAPI(
    title="Physical AI & Humanoid Robotics API",
    description="Backend for the AI-Native Book Project",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Qdrant collection for book content
def create_collection_if_not_exists(collection_name: str = "book_content"):
    """Create Qdrant collection if it doesn't exist."""
    try:
        qdrant_client.get_collection(collection_name)
    except:
        # Define the vector configuration - using the dimensions returned by Gemini embedding model
        qdrant_client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(
                size=768,  # Size of embeddings from 'models/embedding-001'
                distance=models.Distance.COSINE
            ),
        )

def load_markdown_documents(path):
    """Loads all markdown documents from a given path."""
    files = glob.glob(os.path.join(path, "**/*.md"), recursive=True)
    documents = [UnstructuredMarkdownLoader(file).load()[0] for file in files]
    return documents

def split_documents(documents):
    """Splits documents into smaller chunks."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)
    return docs

@app.get("/")
async def root():
    return {"message": "Welcome to the Physical AI & Humanoid Robotics API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/ingest")
async def ingest_documents():
    """
    Loads, processes, and generates embeddings for the book's content.
    """
    try:
        # Create collection if it doesn't exist
        create_collection_if_not_exists()
        
        # 1. Load documents from the frontend directory
        documents_path = "../frontend/docs" 
        documents = load_markdown_documents(documents_path)
        
        # 2. Split documents into chunks
        docs = split_documents(documents)
        
        # 3. Generate embeddings for each chunk and store in Qdrant
        points = []
        for i, doc in enumerate(docs):
            # Generate embedding
            embedding_result = genai.embed_content(
                model="models/embedding-001",
                content=doc.page_content,
                task_type="retrieval_document"
            )
            embedding = embedding_result["embedding"]
            
            # Create a Qdrant point
            point = PointStruct(
                id=str(uuid.uuid4()),  # Generate unique ID
                vector=embedding,
                payload={
                    "content": doc.page_content,
                    "source": doc.metadata.get("source", "unknown"),
                    "chunk_id": i
                }
            )
            points.append(point)

        # Batch insert all points into Qdrant
        qdrant_client.upsert(
            collection_name="book_content",
            points=points
        )

        return {
            "status": "success",
            "message": f"Processed {len(documents)} documents and created {len(docs)} chunks with embeddings stored in Qdrant."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def query_documents(query: str):
    """
    Query the vector database to find relevant content from the book based on the user's question.
    """
    try:
        # Generate embedding for the query
        query_embedding = genai.embed_content(
            model="models/embedding-001",
            content=query,
            task_type="retrieval_query"
        )["embedding"]
        
        # Search in Qdrant for similar content
        search_results = qdrant_client.search(
            collection_name="book_content",
            query_vector=query_embedding,
            limit=5  # Return top 5 most relevant results
        )
        
        # Extract content from search results
        results = []
        for result in search_results:
            results.append({
                "content": result.payload["content"],
                "source": result.payload["source"],
                "score": result.score
            })
            
        return {
            "query": query,
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

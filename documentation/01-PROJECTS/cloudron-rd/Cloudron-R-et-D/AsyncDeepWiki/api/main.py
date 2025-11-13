from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="DeepWiki API",
    description="AI-Powered Wiki Generator API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RepositoryRequest(BaseModel):
    url: str
    token: str = None

class ChatRequest(BaseModel):
    message: str
    repository_id: str = None

@app.get("/")
async def root():
    return {"message": "DeepWiki API Server", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/generate-wiki")
async def generate_wiki(request: RepositoryRequest):
    """
    Generate wiki for a repository
    """
    try:
        # TODO: Implement repository cloning and wiki generation
        return {
            "success": True,
            "message": "Wiki generation started",
            "repository_url": request.url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Chat with repository using RAG
    """
    try:
        # TODO: Implement RAG chat functionality
        return {
            "response": "This is a placeholder response. AI integration coming soon!",
            "message": request.message
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/repositories")
async def list_repositories():
    """
    List processed repositories
    """
    # TODO: Implement repository listing
    return {"repositories": []}

if __name__ == "__main__":
    port = int(os.getenv("API_PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from gpt_service.llm import generate_reply

SYSTEM_PROMPT = (
    "Jestes pomocnym asystentem sklepu internetowego. "
    "Odpowiadaj po polsku, krotko i rzeczowo."
)

app = FastAPI(title="GPT Service")


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        reply = await generate_reply(SYSTEM_PROMPT, request.message.strip())
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return ChatResponse(reply=reply)

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from gpt_service.llm import generate_reply
from gpt_service.phrases import (
    CLOSINGS,
    OPENINGS,
    is_farewell,
    is_greeting,
    pick_closing,
    pick_opening,
)

SYSTEM_PROMPT = (
    "Jestes pomocnym asystentem sklepu internetowego. "
    "Odpowiadaj po polsku, krotko i rzeczowo."
)

app = FastAPI(title="GPT Service")


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    reply: str
    kind: str = "answer"


class PhrasesResponse(BaseModel):
    openings: list[str]
    closings: list[str]


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/phrases", response_model=PhrasesResponse)
async def phrases():
    return PhrasesResponse(openings=OPENINGS, closings=CLOSINGS)


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    message = request.message.strip()

    if is_greeting(message):
        return ChatResponse(reply=pick_opening(), kind="opening")

    if is_farewell(message):
        return ChatResponse(reply=pick_closing(), kind="closing")

    try:
        reply = await generate_reply(SYSTEM_PROMPT, message)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return ChatResponse(reply=reply, kind="answer")

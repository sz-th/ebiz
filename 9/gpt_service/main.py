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
from gpt_service.sentiment import NEGATIVE_REPLY, analyze_sentiment, is_allowed_sentiment
from gpt_service.topic_filter import OFF_TOPIC_REPLY, is_shop_related

SYSTEM_PROMPT = (
    "Jestes asystentem sklepu internetowego z odzieza. "
    "Odpowiadaj wylacznie na pytania o sklep, ubrania, produkty, rozmiary, "
    "zamowienia, dostawe i zwroty. Odmawiaj tematow spoza sklepu. "
    "Odpowiadaj po polsku, krotko i rzeczowo."
)

app = FastAPI(title="GPT Service")


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    reply: str
    kind: str = "answer"
    sentiment: str = "neutral"


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
        return ChatResponse(reply=pick_opening(), kind="opening", sentiment="positive")

    if is_farewell(message):
        return ChatResponse(reply=pick_closing(), kind="closing", sentiment="positive")

    if not is_shop_related(message):
        return ChatResponse(reply=OFF_TOPIC_REPLY, kind="filtered", sentiment="neutral")

    try:
        reply = await generate_reply(SYSTEM_PROMPT, message)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    sentiment = analyze_sentiment(reply)
    if not is_allowed_sentiment(reply):
        return ChatResponse(reply=NEGATIVE_REPLY, kind="sentiment_filtered", sentiment=sentiment)

    return ChatResponse(reply=reply, kind="answer", sentiment=sentiment)

import re

NEGATIVE_WORDS = {
    "zly",
    "zla",
    "zle",
    "nienawidze",
    "nienawisc",
    "okropn",
    "fataln",
    "bezuzyteczn",
    "glupi",
    "glupia",
    "wsciek",
    "wkurz",
    "nie lubie",
    "nie lubie",
    "odra",
    "paskud",
    "beznadziej",
    "skandal",
    "oszust",
    "scam",
    "huj",
    "chuj",
    "debil",
}

POSITIVE_WORDS = {
    "super",
    "swietn",
    "dziekuje",
    "dziekuje",
    "polecam",
    "mil",
    "mila",
    "mile",
    "doskon",
    "wspanial",
    "idealn",
    "dziekuje",
    "dziekuje bardzo",
    "dziekuje",
    "fajnie",
    "ladn",
    "przyjemn",
    "pomocn",
    "profesjonal",
}

NEGATIVE_REPLY = (
    "Przepraszamy, nie mozemy przekazac tej odpowiedzi. "
    "Sformuluj pytanie inaczej lub skontaktuj sie z obsluga sklepu."
)


def _normalize(text: str) -> str:
    lowered = text.lower()
    return (
        lowered.replace("ą", "a")
        .replace("ć", "c")
        .replace("ę", "e")
        .replace("ł", "l")
        .replace("ń", "n")
        .replace("ó", "o")
        .replace("ś", "s")
        .replace("ź", "z")
        .replace("ż", "z")
    )


def analyze_sentiment(text: str) -> str:
    normalized = _normalize(text)
    negative_hits = sum(1 for word in NEGATIVE_WORDS if word in normalized)
    positive_hits = sum(1 for word in POSITIVE_WORDS if word in normalized)

    if re.search(r"\b(nie|bez)\s+\w+", normalized):
        negative_hits += 1

    if negative_hits > positive_hits and negative_hits > 0:
        return "negative"
    if positive_hits > negative_hits and positive_hits > 0:
        return "positive"
    return "neutral"


def is_allowed_sentiment(text: str) -> bool:
    return analyze_sentiment(text) != "negative"

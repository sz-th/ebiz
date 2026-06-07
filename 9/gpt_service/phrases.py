import random
import re

OPENINGS = [
    "Witaj w naszym sklepie! W czym moge pomoc?",
    "Czesc! Jestem asystentem sklepu - zapytaj o ubrania, rozmiary lub zamowienia.",
    "Dzien dobry! Chcesz poznac nasza oferte odziezy?",
    "Hej! Pomoge Ci dobrac produkty ze sklepu.",
    "Miloo Cie widziec! Napisz, czego szukasz w sklepie.",
]

CLOSINGS = [
    "Dziekuje za rozmowe! Zapraszamy ponownie do sklepu.",
    "Do widzenia! Milego dnia i udanych zakupow.",
    "Pa pa! Jesli cos jeszcze bedzie potrzebne, jestesmy dostepni.",
    "Koniec rozmowy - dziekujemy za kontakt ze sklepem.",
    "Do zobaczenia! Wracaj po kolejne ubrania.",
]

GREETING_PATTERN = re.compile(
    r"^\s*(cze[sś][cć]|hej|witam|dzie[nń]\s+dobry|hello|hi|start|startuj)\b",
    re.IGNORECASE,
)

FAREWELL_PATTERN = re.compile(
    r"\b(do\s+widzenia|pa(\s+pa)?|koniec|bye|do\s+zobaczenia|dziekuje|dzi[eę]kuj[eę])\b",
    re.IGNORECASE,
)


def pick_opening() -> str:
    return random.choice(OPENINGS)


def pick_closing() -> str:
    return random.choice(CLOSINGS)


def is_greeting(message: str) -> bool:
    return bool(GREETING_PATTERN.search(message.strip()))


def is_farewell(message: str) -> bool:
    return bool(FAREWELL_PATTERN.search(message.strip()))

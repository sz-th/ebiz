import re

SHOP_KEYWORDS = [
    "sklep",
    "sklepu",
    "sklepie",
    "ubran",
    "odzie",
    "koszul",
    "spodni",
    "sukien",
    "kurt",
    "bluz",
    "but",
    "rozmiar",
    "rozmiarze",
    "zamowien",
    "zamowic",
    "zamowie",
    "dostaw",
    "zwrot",
    "wymian",
    "cena",
    "ceny",
    "promoc",
    "rabat",
    "kategoria",
    "produkt",
    "asortyment",
    "moda",
    "fason",
    "kolor",
    "material",
    "tkanin",
]

OFF_TOPIC_REPLY = (
    "Obslugujemy wylacznie pytania o sklep i odziez. "
    "Zapytaj np. o produkty, rozmiary, dostawe lub zwroty."
)

SHOP_PATTERN = re.compile(
    r"\b(" + "|".join(re.escape(word) for word in SHOP_KEYWORDS) + r")\w*\b",
    re.IGNORECASE,
)


def is_shop_related(message: str) -> bool:
    text = message.strip().lower()
    if not text:
        return False
    if SHOP_PATTERN.search(text):
        return True
    if is_greeting_like(text) or is_farewell_like(text):
        return True
    return False


def is_greeting_like(text: str) -> bool:
    return bool(re.search(r"^\s*(cze[sś][cć]|hej|witam|dzie[nń]\s+dobry|hello|hi)\b", text))


def is_farewell_like(text: str) -> bool:
    return bool(re.search(r"\b(do\s+widzenia|pa(\s+pa)?|koniec|bye|dziekuje|dzi[eę]kuj[eę])\b", text))

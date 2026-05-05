# Zadanie 6 — Testy

Testy dla projektu z katalogu `5/` (frontend React + Vite, backend Go + Echo).

Zawartość:

| Katalog | Opis | Próg |
| --- | --- | --- |
| `e2e/` | Cypress, 20 testów funkcjonalnych UI | 3.0 / 3.5 / 5.0 |
| `unit/` | Testy jednostkowe Go (testify) dla logiki płatności i produktów | 4.0 |
| `api/` | Testy API (axios + Vitest), pokrycie `GET /products` i `POST /payments` z negatywnymi scenariuszami | 4.5 |

## Wymagane przed odpaleniem

W osobnym terminalu uruchom aplikację z katalogu `5/`:

```bash
cd ../5
docker-compose up --build
```

Frontend będzie dostępny na `http://localhost:5173`, backend na `http://localhost:8080`.

## Szybki start

```bash
# E2E (Cypress, headless)
cd e2e
npm install
npm test

# E2E na BrowserStack (po ustawieniu BROWSERSTACK_USERNAME / BROWSERSTACK_ACCESS_KEY)
npm run test:bs

# Testy API
cd ../api
npm install
npm test

# Testy jednostkowe Go
cd ../unit
go test -v ./...
```

## BrowserStack

1. Załóż konto na https://www.browserstack.com (np. przez GitHub Student Pack).
2. Wygeneruj `BROWSERSTACK_USERNAME` i `BROWSERSTACK_ACCESS_KEY`.
3. Eksportuj do środowiska:

```bash
# PowerShell
$env:BROWSERSTACK_USERNAME = "twoj_user"
$env:BROWSERSTACK_ACCESS_KEY = "twoj_key"

# bash
export BROWSERSTACK_USERNAME=twoj_user
export BROWSERSTACK_ACCESS_KEY=twoj_key
```

4. Aplikacja serwowana lokalnie wymaga BrowserStack Local — paczka `browserstack-cypress-cli` ustawia tunel automatycznie (`local: true` w `e2e/browserstack.json`).

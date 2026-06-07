# Discord Bot & Scala API Project

This project consists of two main components:
1. Scala API : A Scalatra-based REST API providing Product and Category management.
2. Kotlin Discord Bot: A Ktor-based client that interacts with Discord and fetches data from the Scala API.

## GPT bridge (zadanie 9)

Bot uruchamia serwer HTTP na porcie `8090` (zmienna `GPT_BRIDGE_PORT`), ktory przekazuje pytania do serwisu Python (`GPT_SERVICE_URL`, domyslnie `http://127.0.0.1:8000`).

- Discord: `!chat <pytanie>`
- Frontend: `9/frontend/index.html` -> `POST http://127.0.0.1:8090/api/chat`

## How to Run

1. Ensure you have a `.env` file in the `3/` directory with:
   ```env
   DISCORD_BOT_TOKEN=your_token_here
   SLACK_BOT_TOKEN=your_slack_token_here (optional)
   GPT_SERVICE_URL=http://127.0.0.1:8000
   GPT_BRIDGE_PORT=8090
   ```
2. Run the entire stack using Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Bot Commands
- `!help` - Show available commands.
- `!categories` - List all categories.
- `!products` - List all products.
- `!products <category>` - List products filtered by category.
- `!chat <pytanie>` - Ask the shop assistant.

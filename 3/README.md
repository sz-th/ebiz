# Discord Bot & Scala API Project

This project consists of two main components:
1. **Scala API (Zadanie 2)**: A Scalatra-based REST API providing Product and Category management.
2. **Kotlin Discord Bot (Zadanie 3)**: A Ktor-based client that interacts with Discord and fetches data from the Scala API.

## Requirements Met

### Zadanie 2 (Scala)
- [x] Product Controller with CRUD.
- [x] Category and Cart Controllers with CRUD.
- [x] Dockerized application.
- [x] CORS configuration for multiple hosts.

### Zadanie 3 (Kotlin)
- [x] Ktor client sending messages to Discord.
- [x] Bot receiving and responding to Discord messages.
- [x] `!categories` command to list categories from Scala API.
- [x] `!products <category>` command to list filtered products.
- [x] Slack support (SlackClient for sending messages).
- [x] Dockerized application with `docker-compose`.

## How to Run

1. Ensure you have a `.env` file in the `3/` directory with:
   ```env
   DISCORD_BOT_TOKEN=your_token_here
   SLACK_BOT_TOKEN=your_slack_token_here (optional)
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

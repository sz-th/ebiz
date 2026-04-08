# Discord Bot & Scala API Project

This project consists of two main components:
1. Scala API : A Scalatra-based REST API providing Product and Category management.
2. Kotlin Discord Bot: A Ktor-based client that interacts with Discord and fetches data from the Scala API.

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

package bot

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.websocket.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.websocket.*
import kotlinx.coroutines.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.*

@Serializable
data class DiscordMessage(val content: String)

@Serializable
data class SlackMessage(val channel: String, val text: String)

@Serializable
data class Category(val id: Int, val name: String)

@Serializable
data class Product(val id: Int, val name: String, val price: Double, val category: String)

class SlackClient(private val token: String) {
    private val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
        engine {
            requestTimeout = 60000L
        }
    }

    suspend fun sendMessage(channelId: String, content: String) {
        val response = client.post("https://slack.com/api/chat.postMessage") {
            header(HttpHeaders.Authorization, "Bearer $token")
            contentType(ContentType.Application.Json)
            setBody(SlackMessage(channelId, content))
        }
        println("Slack Message sent. Status: ${response.status}")
    }

    fun close() {
        client.close()
    }
}

class DiscordClient(private val token: String) {
    private val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
        install(WebSockets) {
            contentConverter = KotlinxWebsocketSerializationConverter(Json { ignoreUnknownKeys = true })
        }
        engine {
            requestTimeout = 60000L
        }
    }

    suspend fun sendMessage(channelId: String, content: String) {
        val truncatedContent = if (content.length > 2000) content.take(1997) + "..." else content
        val response = client.post("https://discord.com/api/v10/channels/$channelId/messages") {
            header(HttpHeaders.Authorization, "Bot $token")
            contentType(ContentType.Application.Json)
            setBody(DiscordMessage(truncatedContent))
        }
        println("Message sent. Status: ${response.status}")
    }

    suspend fun startGateway() {
        val gatewayUrl = "wss://gateway.discord.gg/?v=10&encoding=json"
        
        client.webSocket(gatewayUrl) {
            var heartbeatInterval = 41250L
            var seqNum: Int? = null

            // Start reading messages
            for (frame in incoming) {
                if (frame !is Frame.Text) continue
                val text = frame.readText()
                val json = Json.parseToJsonElement(text).jsonObject
                
                val op = json["op"]?.jsonPrimitive?.intOrNull
                val t = json["t"]?.jsonPrimitive?.contentOrNull
                if (json["s"]?.jsonPrimitive?.intOrNull != null) {
                    seqNum = json["s"]?.jsonPrimitive?.intOrNull
                }

                when (op) {
                    10 -> { // Hello
                        heartbeatInterval = json["d"]?.jsonObject?.get("heartbeat_interval")?.jsonPrimitive?.longOrNull ?: 41250L
                        // Launch heartbeat coroutine
                        launch {
                            while (isActive) {
                                delay(heartbeatInterval)
                                val heartbeatPayload = buildJsonObject {
                                    put("op", 1)
                                    put("d", seqNum?.let { JsonPrimitive(it) } ?: JsonNull)
                                }
                                send(Frame.Text(heartbeatPayload.toString()))
                            }
                        }
                        
                        // Send Identify
                        val identifyPayload = buildJsonObject {
                            put("op", 2)
                            put("d", buildJsonObject {
                                put("token", token)
                                put("intents", 33280) // GUILD_MESSAGES (512) | MESSAGE_CONTENT (32768)
                                put("properties", buildJsonObject {
                                    put("os", "windows")
                                    put("browser", "ktor")
                                    put("device", "ktor")
                                })
                            })
                        }
                        send(Frame.Text(identifyPayload.toString()))
                        println("Sent Identify to Gateway")
                    }
                    0 -> { // Dispatch
                        if (t == "MESSAGE_CREATE") {
                            val data = json["d"]?.jsonObject
                            val author = data?.get("author")?.jsonObject
                            val isBot = author?.get("bot")?.jsonPrimitive?.booleanOrNull == true
                            if (!isBot) {
                                val content = data?.get("content")?.jsonPrimitive?.content ?: ""
                                val channelId = data?.get("channel_id")?.jsonPrimitive?.content
                                println("Received message from channel $channelId: $content")
                                
                                if (content == "!help" && channelId != null) {
                                    val helpMessage = """
                                        **Available Commands:**
                                        `!help` - Show this help message
                                        `!categories` - List all available categories
                                        `!products` - List all products
                                        `!products <category>` - List products in a specific category
                                    """.trimIndent()
                                    launch { sendMessage(channelId, helpMessage) }
                                } else if (content == "!categories" && channelId != null) {
                                    launch {
                                        try {
                                            val baseUrl = System.getenv("SCALA_APP_URL") ?: "http://127.0.0.1:8080"
                                            val response = client.get("$baseUrl/categories")
                                            val categories = response.body<List<Category>>()
                                            val formatted = categories.joinToString("\n") { "- ${it.name} (ID: ${it.id})" }
                                            sendMessage(channelId, "**Categories:**\n$formatted")
                                        } catch (e: Exception) {
                                            sendMessage(channelId, "Failed to fetch categories: ${e.message}")
                                        }
                                    }
                                } else if (content.startsWith("!products") && channelId != null) {
                                    val categoryName = content.removePrefix("!products").trim()
                                    launch {
                                        try {
                                            val baseUrl = System.getenv("SCALA_APP_URL") ?: "http://127.0.0.1:8080"
                                            val response = if (categoryName.isNotEmpty()) {
                                                client.get("$baseUrl/products") {
                                                    parameter("category", categoryName)
                                                }
                                            } else {
                                                client.get("$baseUrl/products")
                                            }
                                            val products = response.body<List<Product>>()
                                            val formatted = if (products.isEmpty()) "No products found." 
                                                           else products.joinToString("\n") { "- ${it.name}: ${it.price} PLN [${it.category}]" }
                                            
                                            val title = if (categoryName.isNotEmpty()) "**Products for $categoryName:**" else "**All products:**"
                                            sendMessage(channelId, "$title\n$formatted")
                                        } catch (e: Exception) {
                                            sendMessage(channelId, "Failed to fetch products: ${e.message}")
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fun close() {
        client.close()
    }
}

fun main() {
    runBlocking {
        val envFile = java.io.File(".env")
        val env = if (envFile.exists()) {
            envFile.readLines().filter { it.contains("=") }.associate {
                val parts = it.split("=", limit = 2)
                if (parts.size == 2) parts[0].trim() to parts[1].trim() else "" to ""
            }
        } else emptyMap()

        val token = env["DISCORD_BOT_TOKEN"] ?: System.getenv("DISCORD_BOT_TOKEN") ?: error("DISCORD_BOT_TOKEN not set")
        val slackToken = env["SLACK_BOT_TOKEN"] ?: System.getenv("SLACK_BOT_TOKEN")
        
        val discordClient = DiscordClient(token)
        println("Discord Client initialized.")

        var slackClient: SlackClient? = null
        if (slackToken != null) {
            slackClient = SlackClient(slackToken)
            println("Slack Client initialized.")
        }
        
        // Launch gateway to listen for messages
        launch {
            try {
                discordClient.startGateway()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        
        // Keep alive
        delay(Long.MAX_VALUE)
        discordClient.close()
        slackClient?.close()
    }
}

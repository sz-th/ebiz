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
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.websocket.*
import kotlinx.coroutines.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.*

private const val DEFAULT_SCALA_APP_URL = "http://127.0.0.1:8080"
private const val DEFAULT_GPT_SERVICE_URL = "http://127.0.0.1:8000"
private const val DEFAULT_BRIDGE_PORT = 8090

private fun scalaAppUrl(): String =
    System.getenv("SCALA_APP_URL")?.takeIf { it.isNotBlank() } ?: DEFAULT_SCALA_APP_URL

private fun gptServiceUrl(): String =
    System.getenv("GPT_SERVICE_URL")?.takeIf { it.isNotBlank() } ?: DEFAULT_GPT_SERVICE_URL

private fun bridgePort(): Int =
    System.getenv("GPT_BRIDGE_PORT")?.toIntOrNull() ?: DEFAULT_BRIDGE_PORT

@Serializable
data class DiscordMessage(val content: String)

@Serializable
data class SlackMessage(val channel: String, val text: String)

@Serializable
data class Category(val id: Int, val name: String)

@Serializable
data class Product(val id: Int, val name: String, val price: Double, val category: String)

@Serializable
data class ChatRequest(val message: String)

@Serializable
data class ChatResponse(val reply: String)

class GptBridge(private val client: HttpClient) {
    suspend fun ask(message: String): String {
        val response = client.post("${gptServiceUrl()}/chat") {
            contentType(ContentType.Application.Json)
            setBody(ChatRequest(message))
        }
        if (!response.status.isSuccess()) {
            val body = response.bodyAsText()
            throw IllegalStateException("GPT service error (${response.status}): $body")
        }
        return response.body<ChatResponse>().reply
    }
}

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

class DiscordClient(
    private val token: String,
    private val gptBridge: GptBridge,
) {
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

    private suspend fun sendCategories(channelId: String) {
        val response = client.get("${scalaAppUrl()}/categories")
        val categories = response.body<List<Category>>()
        val formatted = categories.joinToString("\n") { "- ${it.name} (ID: ${it.id})" }
        sendMessage(channelId, "**Categories:**\n$formatted")
    }

    private suspend fun sendProducts(channelId: String, categoryName: String) {
        val response = if (categoryName.isNotEmpty()) {
            client.get("${scalaAppUrl()}/products") {
                parameter("category", categoryName)
            }
        } else {
            client.get("${scalaAppUrl()}/products")
        }
        val products = response.body<List<Product>>()
        val formatted = if (products.isEmpty()) {
            "No products found."
        } else {
            products.joinToString("\n") { "- ${it.name}: ${it.price} PLN [${it.category}]" }
        }
        val title = if (categoryName.isNotEmpty()) {
            "**Products for $categoryName:**"
        } else {
            "**All products:**"
        }
        sendMessage(channelId, "$title\n$formatted")
    }

    private suspend fun sendChatReply(channelId: String, question: String) {
        try {
            val reply = gptBridge.ask(question)
            sendMessage(channelId, reply)
        } catch (e: Exception) {
            sendMessage(channelId, "Nie udalo sie uzyskac odpowiedzi: ${e.message}")
        }
    }

    private suspend fun routeUserMessage(channelId: String, content: String) {
        when {
            content == "!help" -> {
                val helpMessage = """
                    **Available Commands:**
                    `!help` - Show this help message
                    `!categories` - List all available categories
                    `!products` - List all products
                    `!products <category>` - List products in a specific category
                    `!chat <pytanie>` - Zapytaj asystenta sklepu
                """.trimIndent()
                sendMessage(channelId, helpMessage)
            }
            content == "!categories" -> {
                try {
                    sendCategories(channelId)
                } catch (e: Exception) {
                    sendMessage(channelId, "Failed to fetch categories: ${e.message}")
                }
            }
            content.startsWith("!products") -> {
                val categoryName = content.removePrefix("!products").trim()
                try {
                    sendProducts(channelId, categoryName)
                } catch (e: Exception) {
                    sendMessage(channelId, "Failed to fetch products: ${e.message}")
                }
            }
            content.startsWith("!chat") -> {
                val question = content.removePrefix("!chat").trim()
                if (question.isEmpty()) {
                    sendMessage(channelId, "Uzycie: `!chat <pytanie>`")
                } else {
                    sendChatReply(channelId, question)
                }
            }
        }
    }

    suspend fun startGateway() {
        val gatewayUrl = "wss://gateway.discord.gg/?v=10&encoding=json"

        client.webSocket(gatewayUrl) {
            var heartbeatInterval = 41250L
            var seqNum: Int? = null

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
                    10 -> {
                        heartbeatInterval = json["d"]?.jsonObject?.get("heartbeat_interval")?.jsonPrimitive?.longOrNull ?: 41250L
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
                        val identifyPayload = buildJsonObject {
                            put("op", 2)
                            put("d", buildJsonObject {
                                put("token", token)
                                put("intents", 33280)
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
                    0 -> {
                        if (t == "MESSAGE_CREATE") {
                            val data = json["d"]?.jsonObject
                            val author = data?.get("author")?.jsonObject
                            val isBot = author?.get("bot")?.jsonPrimitive?.booleanOrNull == true
                            if (!isBot) {
                                val content = data?.get("content")?.jsonPrimitive?.content ?: ""
                                val channelId = data?.get("channel_id")?.jsonPrimitive?.content
                                if (channelId != null) {
                                    launch { routeUserMessage(channelId, content) }
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

fun Application.configureBridge(gptBridge: GptBridge) {
    install(ContentNegotiation) {
        json(Json { ignoreUnknownKeys = true })
    }
    install(CORS) {
        anyHost()
        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Post)
    }
    routing {
        get("/health") {
            call.respond(mapOf("status" to "ok"))
        }
        post("/api/chat") {
            val request = call.receive<ChatRequest>()
            if (request.message.isBlank()) {
                call.respond(HttpStatusCode.BadRequest, mapOf("detail" to "Message is required"))
                return@post
            }
            try {
                val reply = gptBridge.ask(request.message.trim())
                call.respond(ChatResponse(reply))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadGateway, mapOf("detail" to (e.message ?: "GPT error")))
            }
        }
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

        val httpClient = HttpClient(CIO) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
            engine {
                requestTimeout = 120000L
            }
        }
        val gptBridge = GptBridge(httpClient)

        val server = embeddedServer(Netty, port = bridgePort()) {
            configureBridge(gptBridge)
        }.start(wait = false)
        println("GPT bridge listening on http://127.0.0.1:${bridgePort()}")

        val discordClient = DiscordClient(token, gptBridge)
        println("Discord Client initialized.")

        var slackClient: SlackClient? = null
        if (slackToken != null) {
            slackClient = SlackClient(slackToken)
            println("Slack Client initialized.")
        }

        launch {
            try {
                discordClient.startGateway()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        delay(Long.MAX_VALUE)
        server.stop(1000, 2000)
        discordClient.close()
        slackClient?.close()
        httpClient.close()
    }
}

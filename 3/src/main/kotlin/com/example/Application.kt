package com.example

import dev.kord.common.entity.Snowflake
import dev.kord.core.Kord
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.coroutines.runBlocking

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
    }.start(wait = false)

    runBlocking {
        val token = System.getenv("DISCORD_TOKEN") ?: "TWÓJ_TOKEN_BOTA"
        
        if (token != "TWÓJ_TOKEN_BOTA") {
            val kord = Kord(token)

            val testChannelId = Snowflake("TWÓJ_ID_KANALU") 
            try {
                kord.rest.channel.createMessage(testChannelId) {
                    content = "Cześć! Aplikacja Ktor połączyła się z Discordem."
                }
            } catch (e: Exception) {
                println("Brak dostępu do kanału lub błędne ID.")
            }

            kord.login()
        } else {
            println("Podaj poprawny DISCORD_TOKEN aby uruchomić bota.")
        }
    }
}
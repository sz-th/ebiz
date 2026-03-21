import java.sql.DriverManager

fun main() {
    println("Hello World z Kotlina, uruchomione w Dockerze!")
    
    // Przykładowe użycie SQLite z załączonej paczki
    val connection = DriverManager.getConnection("jdbc:sqlite:sample.db")
    println("Pomyślnie połączono z bazą SQLite: \${connection.metaData.databaseProductName}")
    connection.close()
}
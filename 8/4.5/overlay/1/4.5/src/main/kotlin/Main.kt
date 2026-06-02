import java.sql.DriverManager

fun main() {
    println("Hello World z Kotlina, uruchomione w Dockerze!")

    val connection = DriverManager.getConnection("jdbc:sqlite:sample.db")
    val dbName = connection.metaData.databaseProductName
    println("Pomyślnie połączono z bazą SQLite: $dbName")
    connection.close()
}

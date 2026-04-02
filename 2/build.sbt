scalaVersion := "2.13.12"
name := "Zadanie2Scala"
version := "1.0"
libraryDependencies ++= Seq(
  "org.scalatra" %% "scalatra" % "2.8.4",
  "org.scalatra" %% "scalatra-json" % "2.8.4",
  "org.json4s"   %% "json4s-jackson" % "4.0.6",
  "ch.qos.logback" % "logback-classic" % "1.2.12" % "runtime",
  "org.eclipse.jetty" % "jetty-webapp" % "9.4.53.v20231009" % "container;compile",
  "javax.servlet" % "javax.servlet-api" % "3.1.0" % "provided"
)
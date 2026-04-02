FROM sbtscala/scala-sbt:eclipse-temurin-jammy-17.0.10_1.9.9_3.3.3
WORKDIR /app
COPY . /app
RUN sbt compile
EXPOSE 8080
CMD ["sbt", "run"]
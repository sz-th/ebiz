FROM gradle:8.6-jdk21 AS build
WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . /home/gradle/src
RUN gradle :app:shadowJar --no-daemon

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /home/gradle/src/app/build/libs/*-all.jar app.jar
COPY .env .env
ENTRYPOINT ["java", "-jar", "app.jar"]

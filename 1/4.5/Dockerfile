FROM ubuntu:24.04

RUN apt-get update && apt-get install -y openjdk-8-jdk kotlin wget unzip
RUN wget -q https://services.gradle.org/distributions/gradle-8.7-bin.zip \
    && unzip gradle-8.7-bin.zip -d /opt \
    && ln -s /opt/gradle-8.7/bin/gradle /usr/bin/gradle \
    && rm gradle-8.7-bin.zip

WORKDIR /app
COPY . /app/

# Kompilacja projektu
RUN gradle build

# Uruchomienie aplikacji za pomocą gradle (zgodnie z zadaniem)
CMD ["gradle", "run"]
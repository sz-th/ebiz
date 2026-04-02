docker build -t zadanie2-scala .

docker run -d -p 8080:8080 --name scala-app zadanie2-scala

ngrok http 8080
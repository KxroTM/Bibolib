# activity_logs/Dockerfile
FROM golang:1.23-alpine

WORKDIR /app

# Copie le contenu du dossier activity_logs
COPY . .

# Télécharge les dépendances
RUN go mod tidy

# Compile ton binaire Go
RUN go build -o main .

EXPOSE 8080
CMD ["./main"]

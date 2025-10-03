package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client
var logCollection *mongo.Collection

func initMongo() {
	// Charger le .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Erreur lors du chargement du fichier .env")
	}

	// Récupérer les variables
	uri := os.Getenv("MONGO_URI")
	dbName := os.Getenv("MONGO_DB")
	collectionName := os.Getenv("MONGO_COLLECTION")

	// Contexte avec timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connexion à MongoDB Atlas
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	// Vérifier la connexion
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Impossible de se connecter à MongoDB : ", err)
	}

	mongoClient = client
	logCollection = client.Database(dbName).Collection(collectionName)

	fmt.Println("✅ Connexion MongoDB réussie")
}

func main() {
	// Init connexion DB
	initMongo()

	// Init Gin
	r := gin.Default()

	// Exemple : endpoint qui log une action
	r.POST("/log", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		logDoc := map[string]interface{}{
			"user_id":   1,
			"action":    "LOGIN",
			"target":    "system",
			"timestamp": time.Now(),
			"ip":        c.ClientIP(),
			"status":    "success",
		}

		_, err := logCollection.InsertOne(ctx, logDoc)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}

		c.JSON(200, gin.H{"message": "Log inséré avec succès"})
	})

	// Lancer le serveur
	r.Run(":8080")
}

package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var logCollection *mongo.Collection

// Modèle de log
type ActivityLog struct {
	UserID    int       `json:"user_id" bson:"user_id"`
	Action    string    `json:"action" bson:"action"`
	Target    string    `json:"target" bson:"target"`
	Timestamp time.Time `json:"timestamp" bson:"timestamp"`
	IP        string    `json:"ip" bson:"ip"`
	Status    string    `json:"status" bson:"status"`
}

// Connexion Mongo
func InitMongo() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		panic(err)
	}
	logCollection = client.Database("mydb").Collection("activity_logs")
}

// Handler POST : insérer un log
func createLog(c *gin.Context) {
	var log ActivityLog
	if err := c.ShouldBindJSON(&log); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Timestamp = time.Now()
	_, err := logCollection.InsertOne(context.TODO(), log)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur insertion log"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Log ajouté avec succès"})
}

// Handler GET : récupérer tous les logs
func getLogs(c *gin.Context) {
	cursor, err := logCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur récupération logs"})
		return
	}
	var logs []ActivityLog
	if err := cursor.All(context.TODO(), &logs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur décodage logs"})
		return
	}

	c.JSON(http.StatusOK, logs)
}

func main() {
	InitMongo()

	r := gin.Default()

	r.POST("/logs", createLog)
	r.GET("/logs", getLogs)

	fmt.Println("🚀 Serveur démarré sur http://localhost:8080")
	r.Run(":8080")
}

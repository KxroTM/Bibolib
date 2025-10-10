package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client
var logCollection *mongo.Collection

// -------------------------
// Initialisation MongoDB
// -------------------------
func initMongo() {

	_ = godotenv.Load(".env")
	if os.Getenv("MONGO_URI") == "" {
		_ = godotenv.Load("../.env")
	}

	uri := os.Getenv("MONGO_URI")
	dbName := os.Getenv("MONGO_DB")
	collectionName := os.Getenv("MONGO_COLLECTION")

	if uri == "" || dbName == "" || collectionName == "" {
		log.Fatal("Variables d'environnement manquantes (MONGO_URI / MONGO_DB / MONGO_COLLECTION). Vérifie ton fichier .env et le chemin de lancement.")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Impossible de se connecter à MongoDB : ", err)
	}

	mongoClient = client
	logCollection = client.Database(dbName).Collection(collectionName)

	fmt.Println("✅ Connexion MongoDB réussie")
}

// -------------------------
// Fonction générique pour insérer un log
// -------------------------
func InsertLog(ctx context.Context, userID int, username, module, action, status, ip string) error {
	logDoc := bson.M{
		"user_id":   userID,
		"username":  username,
		"module":    module,
		"action":    action,
		"ip":        ip,
		"timestamp": time.Now(),
		"status":    status,
	}

	_, err := logCollection.InsertOne(ctx, logDoc)
	return err
}

// -------------------------
// MAIN
// -------------------------
func main() {
	// Init MongoDB
	initMongo()

	// Init Gin
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/auth/create-account", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		user := struct {
			UserID   int    `json:"user_id"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := CreateAccount(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Create account log inséré"})
	})
	r.POST("/auth/delete-account", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := UserDeleteAccount(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Delete account log inséré"})
	})

	r.POST("/auth/user-update", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := UserUpdate(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "User update log inséré"})
	})

	r.POST("/auth/user-roles-change", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int      `json:"user_id"`
			Username string   `json:"username"`
			IP       string   `json:"ip"`
			NewRoles []string `json:"newroles"`
			OldRoles []string `json:"oldroles"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := UserRolesChange(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "User roles change log inséré"})
	})

	r.POST("/auth/password-change", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := passwordChange(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Password change log inséré"})
	})

	r.POST("/auth/user-delete-admin", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		admin := struct {
			AdminID   int    `json:"admin_id"`
			AdminName string `json:"admin_name"`
			IP        string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&admin); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := userdelete(ctx, admin.AdminID, admin.AdminName, admin.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "User delete by admin log inséré"})
	})

	r.POST("/books/add-book", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			Username string `json:"username"`
			BookID   int    `json:"book_id"`
			Title    string `json:"title"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := AddBook(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Add book log inséré"})
	})

	r.POST("/books/update-book", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := UpdateBook(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Update book log inséré"})
	})

	r.POST("/books/delete-book", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			BookID   int    `json:"book_id"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := DeleteBook(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Delete book log inséré"})
	})

	r.POST("/books/book-status-change", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := BookStatusChange(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Book status change log inséré"})
	})

	r.POST("/books/book-reserved", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			BookID   int    `json:"book_id"`
			Title    string `json:"title"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := BOOK_RESERVED(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Book reserved log inséré"})
	})

	r.POST("/books/book-reserved-cancel", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := Book_Reserved_cancel(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Book reserved cancel log inséré"})
	})

	r.POST("/books/book-returned", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		user := struct {
			UserID   int    `json:"user_id"`
			BookID   int    `json:"book_id"`
			Username string `json:"username"`
			IP       string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := Book_returned(ctx, user.UserID, user.Username, user.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Book returned log inséré"})
	})

	r.POST("/auth/role-create", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		admin := struct {
			AdminID   int    `json:"admin_id"`
			AdminName string `json:"admin_name"`
			IP        string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&admin); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := role_create(ctx, admin.AdminID, admin.AdminName, admin.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Role create log inséré"})
	})

	r.POST("/auth/role-update", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		admin := struct {
			AdminID   int    `json:"admin_id"`
			AdminName string `json:"admin_name"`
			IP        string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&admin); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := role_update(ctx, admin.AdminID, admin.AdminName, admin.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Role update log inséré"})
	})

	r.POST("/auth/role-delete", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		admin := struct {
			AdminID   int    `json:"admin_id"`
			AdminName string `json:"admin_name"`
			IP        string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&admin); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := role_delete(ctx, admin.AdminID, admin.AdminName, admin.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Role delete log inséré"})
	})

	r.POST("/auth/role-assigned", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		admin := struct {
			AdminID   int    `json:"admin_id"`
			AdminName string `json:"admin_name"`
			IP        string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&admin); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := role_assigned(ctx, admin.AdminID, admin.AdminName, admin.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Role assigned log inséré"})
	})

	r.POST("/auth/role-removed", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		admin := struct {
			AdminID   int    `json:"admin_id"`
			AdminName string `json:"admin_name"`
			IP        string `json:"ip"`
		}{}
		if err := c.ShouldBindJSON(&admin); err != nil {
			c.JSON(400, gin.H{"error": "Données invalides"})
			return
		}
		err := Role_removed(ctx, admin.AdminID, admin.AdminName, admin.IP)
		if err != nil {
			c.JSON(500, gin.H{"error": "Impossible d'insérer le log"})
			return
		}
		c.JSON(200, gin.H{"message": "Role removed log inséré"})
	})

	// -------------------------
	// Endpoints GET pour dashboard admin
	// -------------------------

	// Récupérer tous les logs avec pagination et filtres
	r.GET("/logs", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Paramètres de pagination
		page := c.DefaultQuery("page", "1")
		limit := c.DefaultQuery("limit", "50")

		pageInt, err := strconv.Atoi(page)
		if err != nil || pageInt < 1 {
			pageInt = 1
		}

		limitInt, err := strconv.Atoi(limit)
		if err != nil || limitInt < 1 || limitInt > 100 {
			limitInt = 50
		}

		skip := (pageInt - 1) * limitInt

		// Build filter from optional query params
		filter := bson.M{}

		// module filter
		if module := c.Query("module"); module != "" {
			filter["module"] = module
		}

		// action filter (supporte liste comma-separated)
		if action := c.Query("action"); action != "" {
			if strings.Contains(action, ",") {
				parts := strings.Split(action, ",")
				// trim spaces
				for i := range parts {
					parts[i] = strings.TrimSpace(parts[i])
				}
				filter["action"] = bson.M{"$in": parts}
			} else {
				filter["action"] = action
			}
		}

		// status filter
		if status := c.Query("status"); status != "" {
			filter["status"] = status
		}

		// username (partial match)
		if username := c.Query("username"); username != "" {
			filter["username"] = bson.M{"$regex": username, "$options": "i"}
		}

		// ip (exact or partial)
		if ip := c.Query("ip"); ip != "" {
			if strings.Contains(ip, "*") || strings.Contains(ip, "%") {
				// translate wildcard * to regex
				re := strings.ReplaceAll(ip, "*", ".*")
				filter["ip"] = bson.M{"$regex": re, "$options": "i"}
			} else {
				filter["ip"] = ip
			}
		}

		// user_id
		if userIDStr := c.Query("user_id"); userIDStr != "" {
			if uid, err := strconv.Atoi(userIDStr); err == nil {
				filter["user_id"] = uid
			}
		}

		// date range
		startDateStr := c.Query("start_date")
		endDateStr := c.Query("end_date")
		if startDateStr != "" || endDateStr != "" {
			var dateFilter bson.M = bson.M{}
			if startDateStr != "" {
				if sd, err := time.Parse("2006-01-02", startDateStr); err == nil {
					dateFilter["$gte"] = sd
				}
			}
			if endDateStr != "" {
				if ed, err := time.Parse("2006-01-02", endDateStr); err == nil {
					// include entire day
					ed = ed.Add(24*time.Hour - time.Nanosecond)
					dateFilter["$lte"] = ed
				}
			}
			if len(dateFilter) > 0 {
				filter["timestamp"] = dateFilter
			}
		}

		// Options de tri par timestamp décroissant
		findOptions := options.Find()
		findOptions.SetSort(bson.M{"timestamp": -1})
		findOptions.SetLimit(int64(limitInt))
		findOptions.SetSkip(int64(skip))

		cursor, err := logCollection.Find(ctx, filter, findOptions)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors de la récupération des logs"})
			return
		}
		defer cursor.Close(ctx)

		var logs []bson.M
		if err = cursor.All(ctx, &logs); err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du parsing des logs"})
			return
		}

		// Compter le nombre total de logs correspondant au filtre
		total, err := logCollection.CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du comptage des logs"})
			return
		}

		c.JSON(200, gin.H{
			"logs":        logs,
			"filter":      filter,
			"total":       total,
			"page":        pageInt,
			"limit":       limitInt,
			"total_pages": (total + int64(limitInt) - 1) / int64(limitInt),
		})
	})

	// Récupérer les logs par module
	r.GET("/logs/module/:module", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		module := c.Param("module")
		page := c.DefaultQuery("page", "1")
		limit := c.DefaultQuery("limit", "50")

		pageInt, err := strconv.Atoi(page)
		if err != nil || pageInt < 1 {
			pageInt = 1
		}

		limitInt, err := strconv.Atoi(limit)
		if err != nil || limitInt < 1 || limitInt > 100 {
			limitInt = 50
		}

		skip := (pageInt - 1) * limitInt

		filter := bson.M{"module": module}
		findOptions := options.Find()
		findOptions.SetSort(bson.M{"timestamp": -1})
		findOptions.SetLimit(int64(limitInt))
		findOptions.SetSkip(int64(skip))

		cursor, err := logCollection.Find(ctx, filter, findOptions)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors de la récupération des logs"})
			return
		}
		defer cursor.Close(ctx)

		var logs []bson.M
		if err = cursor.All(ctx, &logs); err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du parsing des logs"})
			return
		}

		total, err := logCollection.CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du comptage des logs"})
			return
		}

		c.JSON(200, gin.H{
			"logs":        logs,
			"module":      module,
			"total":       total,
			"page":        pageInt,
			"limit":       limitInt,
			"total_pages": (total + int64(limitInt) - 1) / int64(limitInt),
		})
	})

	// Récupérer les logs par action
	r.GET("/logs/action/:action", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		action := c.Param("action")
		page := c.DefaultQuery("page", "1")
		limit := c.DefaultQuery("limit", "50")

		pageInt, err := strconv.Atoi(page)
		if err != nil || pageInt < 1 {
			pageInt = 1
		}

		limitInt, err := strconv.Atoi(limit)
		if err != nil || limitInt < 1 || limitInt > 100 {
			limitInt = 50
		}

		skip := (pageInt - 1) * limitInt

		filter := bson.M{"action": action}
		findOptions := options.Find()
		findOptions.SetSort(bson.M{"timestamp": -1})
		findOptions.SetLimit(int64(limitInt))
		findOptions.SetSkip(int64(skip))

		cursor, err := logCollection.Find(ctx, filter, findOptions)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors de la récupération des logs"})
			return
		}
		defer cursor.Close(ctx)

		var logs []bson.M
		if err = cursor.All(ctx, &logs); err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du parsing des logs"})
			return
		}

		total, err := logCollection.CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du comptage des logs"})
			return
		}

		c.JSON(200, gin.H{
			"logs":        logs,
			"action":      action,
			"total":       total,
			"page":        pageInt,
			"limit":       limitInt,
			"total_pages": (total + int64(limitInt) - 1) / int64(limitInt),
		})
	})

	// Récupérer les logs par utilisateur
	r.GET("/logs/user/:user_id", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		userIDStr := c.Param("user_id")
		userID, err := strconv.Atoi(userIDStr)
		if err != nil {
			c.JSON(400, gin.H{"error": "ID utilisateur invalide"})
			return
		}

		page := c.DefaultQuery("page", "1")
		limit := c.DefaultQuery("limit", "50")

		pageInt, err := strconv.Atoi(page)
		if err != nil || pageInt < 1 {
			pageInt = 1
		}

		limitInt, err := strconv.Atoi(limit)
		if err != nil || limitInt < 1 || limitInt > 100 {
			limitInt = 50
		}

		skip := (pageInt - 1) * limitInt

		filter := bson.M{"user_id": userID}
		findOptions := options.Find()
		findOptions.SetSort(bson.M{"timestamp": -1})
		findOptions.SetLimit(int64(limitInt))
		findOptions.SetSkip(int64(skip))

		cursor, err := logCollection.Find(ctx, filter, findOptions)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors de la récupération des logs"})
			return
		}
		defer cursor.Close(ctx)

		var logs []bson.M
		if err = cursor.All(ctx, &logs); err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du parsing des logs"})
			return
		}

		total, err := logCollection.CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du comptage des logs"})
			return
		}

		c.JSON(200, gin.H{
			"logs":        logs,
			"user_id":     userID,
			"total":       total,
			"page":        pageInt,
			"limit":       limitInt,
			"total_pages": (total + int64(limitInt) - 1) / int64(limitInt),
		})
	})

	// Récupérer les statistiques générales
	r.GET("/stats", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Compter le total des logs
		totalLogs, err := logCollection.CountDocuments(ctx, bson.D{})
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du comptage des logs"})
			return
		}

		// Compter par module
		pipeline := []bson.M{
			{"$group": bson.M{
				"_id":   "$module",
				"count": bson.M{"$sum": 1},
			}},
		}

		cursor, err := logCollection.Aggregate(ctx, pipeline)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors de l'agrégation par module"})
			return
		}
		defer cursor.Close(ctx)

		var moduleStats []bson.M
		if err = cursor.All(ctx, &moduleStats); err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du parsing des stats par module"})
			return
		}

		// Compter par action
		pipeline = []bson.M{
			{"$group": bson.M{
				"_id":   "$action",
				"count": bson.M{"$sum": 1},
			}},
		}

		cursor, err = logCollection.Aggregate(ctx, pipeline)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors de l'agrégation par action"})
			return
		}
		defer cursor.Close(ctx)

		var actionStats []bson.M
		if err = cursor.All(ctx, &actionStats); err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du parsing des stats par action"})
			return
		}

		// Logs des dernières 24h
		yesterday := time.Now().Add(-24 * time.Hour)
		last24hLogs, err := logCollection.CountDocuments(ctx, bson.M{"timestamp": bson.M{"$gte": yesterday}})
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du comptage des logs 24h"})
			return
		}

		// Logs de la dernière semaine groupés par jour
		lastWeek := time.Now().Add(-7 * 24 * time.Hour)
		pipeline = []bson.M{
			{"$match": bson.M{"timestamp": bson.M{"$gte": lastWeek}}},
			{"$group": bson.M{
				"_id": bson.M{
					"year":  bson.M{"$year": "$timestamp"},
					"month": bson.M{"$month": "$timestamp"},
					"day":   bson.M{"$dayOfMonth": "$timestamp"},
				},
				"count": bson.M{"$sum": 1},
			}},
			{"$sort": bson.M{"_id": 1}},
		}

		cursor, err = logCollection.Aggregate(ctx, pipeline)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors de l'agrégation par jour"})
			return
		}
		defer cursor.Close(ctx)

		var dailyStats []bson.M
		if err = cursor.All(ctx, &dailyStats); err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du parsing des stats quotidiennes"})
			return
		}

		c.JSON(200, gin.H{
			"total_logs":   totalLogs,
			"last_24h":     last24hLogs,
			"module_stats": moduleStats,
			"action_stats": actionStats,
			"daily_stats":  dailyStats,
		})
	})

	// Récupérer les logs par plage de dates
	r.GET("/logs/date-range", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		startDateStr := c.Query("start_date")
		endDateStr := c.Query("end_date")

		if startDateStr == "" || endDateStr == "" {
			c.JSON(400, gin.H{"error": "start_date et end_date sont requis (format: 2024-01-01)"})
			return
		}

		startDate, err := time.Parse("2006-01-02", startDateStr)
		if err != nil {
			c.JSON(400, gin.H{"error": "Format de start_date invalide (format: 2024-01-01)"})
			return
		}

		endDate, err := time.Parse("2006-01-02", endDateStr)
		if err != nil {
			c.JSON(400, gin.H{"error": "Format de end_date invalide (format: 2024-01-01)"})
			return
		}

		// Ajuster les dates pour inclure toute la journée
		endDate = endDate.Add(24*time.Hour - time.Nanosecond)

		page := c.DefaultQuery("page", "1")
		limit := c.DefaultQuery("limit", "50")

		pageInt, err := strconv.Atoi(page)
		if err != nil || pageInt < 1 {
			pageInt = 1
		}

		limitInt, err := strconv.Atoi(limit)
		if err != nil || limitInt < 1 || limitInt > 100 {
			limitInt = 50
		}

		skip := (pageInt - 1) * limitInt

		filter := bson.M{"timestamp": bson.M{"$gte": startDate, "$lte": endDate}}

		findOptions := options.Find()
		findOptions.SetSort(bson.M{"timestamp": -1})
		findOptions.SetLimit(int64(limitInt))
		findOptions.SetSkip(int64(skip))

		cursor, err := logCollection.Find(ctx, filter, findOptions)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors de la récupération des logs"})
			return
		}
		defer cursor.Close(ctx)

		var logs []bson.M
		if err = cursor.All(ctx, &logs); err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du parsing des logs"})
			return
		}

		total, err := logCollection.CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du comptage des logs"})
			return
		}

		c.JSON(200, gin.H{
			"logs":        logs,
			"start_date":  startDateStr,
			"end_date":    endDateStr,
			"total":       total,
			"page":        pageInt,
			"limit":       limitInt,
			"total_pages": (total + int64(limitInt) - 1) / int64(limitInt),
		})
	})

	// Recherche dans les logs
	r.GET("/logs/search", func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		query := c.Query("q")
		if query == "" {
			c.JSON(400, gin.H{"error": "Paramètre de recherche 'q' requis"})
			return
		}

		page := c.DefaultQuery("page", "1")
		limit := c.DefaultQuery("limit", "50")

		pageInt, err := strconv.Atoi(page)
		if err != nil || pageInt < 1 {
			pageInt = 1
		}

		limitInt, err := strconv.Atoi(limit)
		if err != nil || limitInt < 1 || limitInt > 100 {
			limitInt = 50
		}

		skip := (pageInt - 1) * limitInt

		// Recherche dans username, action, module et ip
		filter := bson.M{"$or": []bson.M{
			{"username": bson.M{"$regex": query, "$options": "i"}},
			{"action": bson.M{"$regex": query, "$options": "i"}},
			{"module": bson.M{"$regex": query, "$options": "i"}},
			{"ip": bson.M{"$regex": query, "$options": "i"}},
		}}

		findOptions := options.Find()
		findOptions.SetSort(bson.M{"timestamp": -1})
		findOptions.SetLimit(int64(limitInt))
		findOptions.SetSkip(int64(skip))

		cursor, err := logCollection.Find(ctx, filter, findOptions)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors de la recherche"})
			return
		}
		defer cursor.Close(ctx)

		var logs []bson.M
		if err = cursor.All(ctx, &logs); err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du parsing des logs"})
			return
		}

		total, err := logCollection.CountDocuments(ctx, filter)
		if err != nil {
			c.JSON(500, gin.H{"error": "Erreur lors du comptage des logs"})
			return
		}

		c.JSON(200, gin.H{
			"logs":        logs,
			"query":       query,
			"total":       total,
			"page":        pageInt,
			"limit":       limitInt,
			"total_pages": (total + int64(limitInt) - 1) / int64(limitInt),
		})
	})

	r.Run(":8080")
}

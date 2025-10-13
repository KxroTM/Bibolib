package main

import (
	"context"
	"time"
)

// -------------------------
// Fonctions spécifiques pour l'authentification
// -------------------------

func CreateAccount(ctx context.Context, userID int, username, email, ip string) error {
	return InsertLogAccount(ctx, userID, username, email, "account", "CREATE_ACCOUNT", "success", ip)
}
func UserDeleteAccount(ctx context.Context, userID int, username, email, ip string) error {
	return InsertLogAccount(ctx, userID, username, email, "account", "USER_DELETE_ACCOUNT", "success", ip)
}
func UserUpdate(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "account", "USER_UPDATE", "success", ip)
}
func UserRolesChange(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "role", "USER_ROLES_CHANGE", "success", ip)
}
func passwordChange(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "account", "PASSWORD_CHANGE", "success", ip)
}
func userdelete(ctx context.Context, adminID int, adminName, ip string) error {
	return InsertLog(ctx, adminID, adminName, "account", "USER_DELETE", "success", ip)
}
func AddBook(ctx context.Context, userID int, BookID int, username, ip string) error {
	return InsertLogbook(ctx, userID, BookID, username, "books", "ADD_BOOK", "success", ip)
}
func UpdateBook(ctx context.Context, userID int, BookID int, username string, changeFields map[string]interface{}, oldValues map[string]interface{}, newValues map[string]interface{}, ip string) error {
	// Build custom document including change details
	logDoc := map[string]interface{}{
		"user_id":   userID,
		"book_id":   BookID,
		"username":  username,
		"module":    "books",
		"action":    "UPDATE_BOOK",
		"status":    "success",
		"ip":        ip,
		"timestamp": time.Now(),
	}
	if changeFields != nil {
		logDoc["change_fields"] = changeFields
	}
	if oldValues != nil {
		logDoc["old_values"] = oldValues
	}
	if newValues != nil {
		logDoc["new_values"] = newValues
	}
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	_, err := logCollection.InsertOne(ctx, logDoc)
	return err
}
func DeleteBook(ctx context.Context, userID int, BookID int, username string, previous map[string]interface{}, ip string) error {
	logDoc := map[string]interface{}{
		"user_id":         userID,
		"book_id":         BookID,
		"username":        username,
		"module":          "books",
		"action":          "DELETE_BOOK",
		"status":          "success",
		"ip":              ip,
		"timestamp":       time.Now(),
		"previous_values": previous,
	}
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	_, err := logCollection.InsertOne(ctx, logDoc)
	return err
}
func BookStatusChange(ctx context.Context, userID int, BookID int, username, ip string) error {
	return InsertLogbook(ctx, userID, BookID, username, "books", "BOOK_STATUS_CHANGE", "success", ip)
}
func bookReserved(ctx context.Context, userID int, BookID int, username, ip string) error {
	return InsertLogbook(ctx, userID, BookID, username, "books", "BOOK_RESERVED", "success", ip)
}
func Book_Reserved_cancel(ctx context.Context, userID int, BookID int, username, ip string) error {
	return InsertLogbook(ctx, userID, BookID, username, "books", "BOOK_RESERVED_CANCEL", "success", ip)
}
func BOOK_RESERVED(ctx context.Context, userID int, BookID int, username, ip string) error {
	return InsertLogbook(ctx, userID, BookID, username, "books", "BOOK_RESERVED", "success", ip)
}
func Book_returned(ctx context.Context, userID int, BookID int, username, ip string) error {
	return InsertLogbook(ctx, userID, BookID, username, "books", "BOOK_RETURNED", "success", ip)
}
func role_create(ctx context.Context, UserID int, NewRoles, OldRoles []string, adminName, ip string) error {
	return InsertLogRole(ctx, UserID, NewRoles, OldRoles, adminName, "role", "ROLE_CREATE", "success", ip)
}
func role_update(ctx context.Context, UserID int, NewRoles, OldRoles []string, adminName, ip string) error {
	return InsertLogRole(ctx, UserID, NewRoles, OldRoles, adminName, "role", "ROLE_UPDATE", "success", ip)
}
func role_delete(ctx context.Context, UserID int, NewRoles, OldRoles []string, adminName, ip string) error {
	return InsertLogRole(ctx, UserID, NewRoles, OldRoles, adminName, "role", "ROLE_DELETE", "success", ip)
}
func role_assigned(ctx context.Context, adminID int, NewRoles, OldRoles []string, adminName, ip string) error {
	return InsertLogRole(ctx, adminID, NewRoles, OldRoles, adminName, "role", "ROLE_ASSIGNED", "success", ip)
}
func Role_removed(ctx context.Context, adminID int, NewRoles, OldRoles []string, adminName, ip string) error {
	return InsertLogRole(ctx, adminID, NewRoles, OldRoles, adminName, "role", "ROLE_REMOVED", "success", ip)
}

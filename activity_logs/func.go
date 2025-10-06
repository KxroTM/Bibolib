package main

import (
	"context"
)

// -------------------------
// Fonctions spécifiques pour l'authentification
// -------------------------

func CreateAccount(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "auth", "CREATE_ACCOUNT", "success", ip)
}
func UserDeleteAccount(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "auth", "USER_DELETE_ACCOUNT", "success", ip)
}
func UserUpdate(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "auth", "USER_UPDATE", "success", ip)
}
func UserRolesChange(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "auth", "USER_ROLES_CHANGE", "success", ip)
}
func passwordChange(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "auth", "PASSWORD_CHANGE", "success", ip)
}
func userdelete(ctx context.Context, adminID int, adminName, ip string) error {
	return InsertLog(ctx, adminID, adminName, "auth", "USER_DELETE", "success", ip)
}
func AddBook(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "books", "ADD_BOOK", "success", ip)
}
func UpdateBook(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "books", "UPDATE_BOOK", "success", ip)
}
func DeleteBook(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "books", "DELETE_BOOK", "success", ip)
}
func BookStatusChange(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "books", "BOOK_STATUS_CHANGE", "success", ip)
}
func bookReserved(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "books", "BOOK_RESERVED", "success", ip)
}
func Book_Reserved_cancel(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "books", "BOOK_RESERVED_CANCEL", "success", ip)
}
func BOOK_RESERVED(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "books", "BOOK_RESERVED", "success", ip)
}
func Book_returned(ctx context.Context, userID int, username, ip string) error {
	return InsertLog(ctx, userID, username, "books", "BOOK_RETURNED", "success", ip)
}
func role_create(ctx context.Context, adminID int, adminName, ip string) error {
	return InsertLog(ctx, adminID, adminName, "auth", "ROLE_CREATE", "success", ip)
}
func role_update(ctx context.Context, adminID int, adminName, ip string) error {
	return InsertLog(ctx, adminID, adminName, "auth", "ROLE_UPDATE", "success", ip)
}
func role_delete(ctx context.Context, adminID int, adminName, ip string) error {
	return InsertLog(ctx, adminID, adminName, "auth", "ROLE_DELETE", "success", ip)
}
func role_assigned(ctx context.Context, adminID int, adminName, ip string) error {
	return InsertLog(ctx, adminID, adminName, "auth", "ROLE_ASSIGNED", "success", ip)
}
func Role_removed(ctx context.Context, adminID int, adminName, ip string) error {
	return InsertLog(ctx, adminID, adminName, "auth", "ROLE_REMOVED", "success", ip)
}

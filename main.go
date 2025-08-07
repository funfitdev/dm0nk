package main

import (
	"fmt"
	"log"
	"net/http"

	"dm0nk/internal/database"
	"dm0nk/internal/handlers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	// Initialize database connection
	database.InitDB()
	defer database.CloseDB()

	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Routes
	r.Get("/", handlers.NotesIndex)
	r.Get("/home", handlers.Home)
	r.Get("/about", handlers.About)
	r.Get("/api/notes", handlers.ApiNotes)

	// Static files
	r.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	fmt.Println("Server starting on :8000")
	log.Fatal(http.ListenAndServe(":8000", r))
}

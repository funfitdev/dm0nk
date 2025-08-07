package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	// Initialize database connection
	initDB()
	defer closeDB()

	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Routes
	r.Get("/", notesIndexHandler)
	r.Get("/home", homeHandler)
	r.Get("/about", aboutHandler)
	r.Get("/api/notes", apiNotesHandler)

	// Static files
	r.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	fmt.Println("Server starting on :8000")
	log.Fatal(http.ListenAndServe(":8000", r))
}

func notesIndexHandler(w http.ResponseWriter, r *http.Request) {
	notes, err := getNotes(r.Context(), 20, 0)
	if err != nil {
		http.Error(w, "Failed to load notes", http.StatusInternalServerError)
		return
	}

	component := NotesIndex(notes.Notes, notes.HasMore, notes.Offset)
	component.Render(r.Context(), w)
}

func apiNotesHandler(w http.ResponseWriter, r *http.Request) {
	offsetStr := r.URL.Query().Get("offset")
	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	notes, err := getNotes(r.Context(), 20, offset)
	if err != nil {
		http.Error(w, "Failed to load notes", http.StatusInternalServerError)
		return
	}

	component := NoteCards(notes.Notes, notes.HasMore, notes.Offset)
	component.Render(r.Context(), w)
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	component := HomePage("Welcome to dm0nk!")
	component.Render(r.Context(), w)
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
	component := AboutPage("About dm0nk", "This is a Go web server using templ and chi router.")
	component.Render(r.Context(), w)
}

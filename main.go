package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Routes
	r.Get("/", homeHandler)
	r.Get("/about", aboutHandler)

	// Static files
	r.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	fmt.Println("Server starting on :8000")
	log.Fatal(http.ListenAndServe(":8000", r))
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	component := HomePage("Welcome to dm0nk!")
	component.Render(r.Context(), w)
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
	component := AboutPage("About dm0nk", "This is a Go web server using templ and chi router.")
	component.Render(r.Context(), w)
}

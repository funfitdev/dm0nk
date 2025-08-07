package handlers

import (
	"net/http"
	"strconv"

	"dm0nk/internal/database"
	"dm0nk/internal/templates"
)

func NotesIndex(w http.ResponseWriter, r *http.Request) {
	notes, err := database.GetNotes(r.Context(), 20, 0)
	if err != nil {
		http.Error(w, "Failed to load notes", http.StatusInternalServerError)
		return
	}

	component := templates.NotesIndex(notes.Notes, notes.HasMore, notes.Offset)
	component.Render(r.Context(), w)
}

func ApiNotes(w http.ResponseWriter, r *http.Request) {
	offsetStr := r.URL.Query().Get("offset")
	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	notes, err := database.GetNotes(r.Context(), 20, offset)
	if err != nil {
		http.Error(w, "Failed to load notes", http.StatusInternalServerError)
		return
	}

	component := templates.NoteCards(notes.Notes, notes.HasMore, notes.Offset)
	component.Render(r.Context(), w)
}

func Home(w http.ResponseWriter, r *http.Request) {
	component := templates.HomePage("Welcome to dm0nk!")
	component.Render(r.Context(), w)
}

func About(w http.ResponseWriter, r *http.Request) {
	component := templates.AboutPage("About dm0nk", "This is a Go web server using templ and chi router.")
	component.Render(r.Context(), w)
}

package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"dm0nk/internal/database"
	"dm0nk/internal/models"
	"dm0nk/internal/services"
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

func Page1(w http.ResponseWriter, r *http.Request) {
	component := templates.Page1()
	component.Render(r.Context(), w)
}

func Page2(w http.ResponseWriter, r *http.Request) {
	component := templates.Page2()
	component.Render(r.Context(), w)
}

// Recordings handlers
func RecordingsIndex(w http.ResponseWriter, r *http.Request) {
	recordings, err := database.GetRecordings(r.Context())
	if err != nil {
		http.Error(w, "Failed to load recordings", http.StatusInternalServerError)
		return
	}

	component := templates.RecordingsPage(recordings)
	component.Render(r.Context(), w)
}

func UploadRecording(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse multipart form
	err := r.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("audio")
	if err != nil {
		http.Error(w, "Failed to get audio file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create recordings directory if it doesn't exist
	recordingsDir := "recordings"
	if err := os.MkdirAll(recordingsDir, 0755); err != nil {
		http.Error(w, "Failed to create recordings directory", http.StatusInternalServerError)
		return
	}

	// Generate filename with timestamp
	timestamp := time.Now().Format("2006-01-02_15-04-05")
	filename := fmt.Sprintf("recording_%s.wav", timestamp)
	filepath := filepath.Join(recordingsDir, filename)

	// Create the file
	dst, err := os.Create(filepath)
	if err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to destination
	size, err := io.Copy(dst, file)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	// Close the file before transcription
	dst.Close()

	// Initialize Deepgram service and transcribe audio
	deepgramService := services.NewDeepgramService()
	var extractedText *string
	if deepgramService != nil {
		transcript, err := deepgramService.TranscribeFile(r.Context(), filepath)
		if err != nil {
			log.Printf("Failed to transcribe audio: %v", err)
			// Continue without transcription - don't fail the upload
		} else if transcript != "" {
			extractedText = &transcript
		}
	}

	// Save recording info to database
	recording := &models.Recording{
		Filename:         filename,
		OriginalFilename: header.Filename,
		FileSize:         size,
		Duration:         0, // We'll calculate this later if needed
		MimeType:         "audio/wav",
		FilePath:         filepath,
		ExtractedText:    extractedText,
	}

	err = database.CreateRecording(r.Context(), recording)
	if err != nil {
		// Delete the file if database save fails
		os.Remove(filepath)
		http.Error(w, "Failed to save recording info", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"message":  "Recording saved successfully",
		"filename": filename,
		"size":     size,
	})
}

func ServeRecording(w http.ResponseWriter, r *http.Request) {
	// Extract filename from URL path
	path := strings.TrimPrefix(r.URL.Path, "/api/recordings/")
	if strings.HasSuffix(path, "/download") {
		path = strings.TrimSuffix(path, "/download")
	}

	// Get recording from database
	recording, err := database.GetRecordingByFilename(r.Context(), path)
	if err != nil {
		http.Error(w, "Recording not found", http.StatusNotFound)
		return
	}

	// Check if file exists
	if _, err := os.Stat(recording.FilePath); os.IsNotExist(err) {
		http.Error(w, "Recording file not found", http.StatusNotFound)
		return
	}

	// Set appropriate headers
	w.Header().Set("Content-Type", "audio/wav")
	if strings.HasSuffix(r.URL.Path, "/download") {
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", recording.Filename))
	}

	// Serve the file
	http.ServeFile(w, r, recording.FilePath)
}

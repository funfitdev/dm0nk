package models

import (
	"encoding/json"
	"time"
)

type Note struct {
	ID        string          `json:"id"`
	Title     string          `json:"title"`
	Data      json.RawMessage `json:"data"`
	Type      string          `json:"type"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

type NotesResponse struct {
	Notes   []Note `json:"notes"`
	HasMore bool   `json:"has_more"`
	Offset  int    `json:"offset"`
}

type Recording struct {
	ID               string    `json:"id"`
	Filename         string    `json:"filename"`
	OriginalFilename string    `json:"original_filename"`
	FileSize         int64     `json:"file_size"`
	Duration         int       `json:"duration"` // in seconds
	MimeType         string    `json:"mime_type"`
	FilePath         string    `json:"file_path"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

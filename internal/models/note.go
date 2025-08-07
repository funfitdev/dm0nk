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

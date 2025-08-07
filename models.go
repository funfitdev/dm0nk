package main

import (
	"context"
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

func getNotes(ctx context.Context, limit, offset int) (*NotesResponse, error) {
	// Query for notes with pagination
	query := `
		SELECT id, title, data, type, created_at, updated_at 
		FROM notes 
		ORDER BY created_at DESC 
		LIMIT $1 OFFSET $2
	`

	rows, err := db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []Note
	for rows.Next() {
		var note Note
		err := rows.Scan(&note.ID, &note.Title, &note.Data, &note.Type, &note.CreatedAt, &note.UpdatedAt)
		if err != nil {
			return nil, err
		}
		notes = append(notes, note)
	}

	// Check if there are more notes
	hasMore, err := checkHasMoreNotes(ctx, limit, offset)
	if err != nil {
		return nil, err
	}

	return &NotesResponse{
		Notes:   notes,
		HasMore: hasMore,
		Offset:  offset + limit,
	}, nil
}

func checkHasMoreNotes(ctx context.Context, limit, offset int) (bool, error) {
	var count int
	query := "SELECT COUNT(*) FROM notes"
	err := db.QueryRow(ctx, query).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > offset+limit, nil
}

func getTotalNotesCount(ctx context.Context) (int, error) {
	var count int
	query := "SELECT COUNT(*) FROM notes"
	err := db.QueryRow(ctx, query).Scan(&count)
	return count, err
}

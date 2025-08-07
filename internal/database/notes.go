package database

import (
	"context"

	"dm0nk/internal/models"
)

func GetNotes(ctx context.Context, limit, offset int) (*models.NotesResponse, error) {
	// Query for notes with pagination
	query := `
		SELECT id, title, data, type, created_at, updated_at 
		FROM notes 
		ORDER BY created_at DESC 
		LIMIT $1 OFFSET $2
	`

	rows, err := DB.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []models.Note
	for rows.Next() {
		var note models.Note
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

	return &models.NotesResponse{
		Notes:   notes,
		HasMore: hasMore,
		Offset:  offset + limit,
	}, nil
}

func checkHasMoreNotes(ctx context.Context, limit, offset int) (bool, error) {
	var count int
	query := "SELECT COUNT(*) FROM notes"
	err := DB.QueryRow(ctx, query).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > offset+limit, nil
}

func GetTotalNotesCount(ctx context.Context) (int, error) {
	var count int
	query := "SELECT COUNT(*) FROM notes"
	err := DB.QueryRow(ctx, query).Scan(&count)
	return count, err
}

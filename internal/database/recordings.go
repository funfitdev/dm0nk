package database

import (
	"context"
	"dm0nk/internal/models"
	"fmt"
)

// GetRecordings retrieves all recordings ordered by creation date (newest first)
func GetRecordings(ctx context.Context) ([]models.Recording, error) {
	query := `
		SELECT id, filename, original_filename, file_size, duration, mime_type, file_path, extracted_text, created_at, updated_at
		FROM recordings
		ORDER BY created_at DESC
	`

	rows, err := DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query recordings: %w", err)
	}
	defer rows.Close()

	var recordings []models.Recording
	for rows.Next() {
		var recording models.Recording
		err := rows.Scan(
			&recording.ID,
			&recording.Filename,
			&recording.OriginalFilename,
			&recording.FileSize,
			&recording.Duration,
			&recording.MimeType,
			&recording.FilePath,
			&recording.ExtractedText,
			&recording.CreatedAt,
			&recording.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan recording: %w", err)
		}
		recordings = append(recordings, recording)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating recordings: %w", err)
	}

	return recordings, nil
}

// CreateRecording inserts a new recording into the database
func CreateRecording(ctx context.Context, recording *models.Recording) error {
	query := `
		INSERT INTO recordings (filename, original_filename, file_size, duration, mime_type, file_path, extracted_text)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at
	`

	err := DB.QueryRow(ctx, query,
		recording.Filename,
		recording.OriginalFilename,
		recording.FileSize,
		recording.Duration,
		recording.MimeType,
		recording.FilePath,
		recording.ExtractedText,
	).Scan(&recording.ID, &recording.CreatedAt, &recording.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create recording: %w", err)
	}

	return nil
}

// GetRecordingByFilename retrieves a recording by its filename
func GetRecordingByFilename(ctx context.Context, filename string) (*models.Recording, error) {
	query := `
		SELECT id, filename, original_filename, file_size, duration, mime_type, file_path, extracted_text, created_at, updated_at
		FROM recordings
		WHERE filename = $1
	`

	var recording models.Recording
	err := DB.QueryRow(ctx, query, filename).Scan(
		&recording.ID,
		&recording.Filename,
		&recording.OriginalFilename,
		&recording.FileSize,
		&recording.Duration,
		&recording.MimeType,
		&recording.FilePath,
		&recording.ExtractedText,
		&recording.CreatedAt,
		&recording.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get recording: %w", err)
	}

	return &recording, nil
}

// DeleteRecording removes a recording from the database
func DeleteRecording(ctx context.Context, filename string) error {
	query := `DELETE FROM recordings WHERE filename = $1`

	result, err := DB.Exec(ctx, query, filename)
	if err != nil {
		return fmt.Errorf("failed to delete recording: %w", err)
	}

	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("recording not found: %s", filename)
	}

	return nil
}

package templates

import (
	"fmt"
	"strconv"
)

// Helper function to convert int to string for templ
func intToString(i int) string {
	return strconv.Itoa(i)
}

// Helper function to format duration in seconds to human readable format
func formatDuration(seconds int) string {
	if seconds < 60 {
		return fmt.Sprintf("%ds", seconds)
	}
	minutes := seconds / 60
	remainingSeconds := seconds % 60
	if remainingSeconds == 0 {
		return fmt.Sprintf("%dm", minutes)
	}
	return fmt.Sprintf("%dm %ds", minutes, remainingSeconds)
}

// Helper function to get CSS classes for note type badges
func getNoteTypeBadgeClass(noteType string) string {
	switch noteType {
	case "text":
		return "bg-gray-100 text-gray-800"
	case "markdown":
		return "bg-blue-100 text-blue-800"
	case "checklist":
		return "bg-green-100 text-green-800"
	case "birthdays":
		return "bg-pink-100 text-pink-800"
	case "spaced_rep_suite":
		return "bg-purple-100 text-purple-800"
	case "trip":
		return "bg-yellow-100 text-yellow-800"
	case "journal":
		return "bg-indigo-100 text-indigo-800"
	case "bookmarks":
		return "bg-orange-100 text-orange-800"
	default:
		return "bg-gray-100 text-gray-800"
	}
}

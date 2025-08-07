package services

import (
	"context"
	"log"
	"os"

	listen "github.com/deepgram/deepgram-go-sdk/pkg/api/listen/v1/rest"
	interfaces "github.com/deepgram/deepgram-go-sdk/pkg/client/interfaces"
	client "github.com/deepgram/deepgram-go-sdk/pkg/client/listen"
)

type DeepgramService struct {
	client *listen.Client
}

func NewDeepgramService() *DeepgramService {
	apiKey := os.Getenv("DEEPGRAM_API_KEY")
	if apiKey == "" {
		log.Println("Warning: DEEPGRAM_API_KEY not set. Speech-to-text will be disabled.")
		return nil
	}

	client.InitWithDefault()
	c := client.NewREST(apiKey, &interfaces.ClientOptions{})
	dg := listen.New(c)

	return &DeepgramService{
		client: dg,
	}
}

func (ds *DeepgramService) TranscribeFile(ctx context.Context, filePath string) (string, error) {
	if ds == nil || ds.client == nil {
		return "", nil // Return empty string if service is not initialized
	}

	options := &interfaces.PreRecordedTranscriptionOptions{
		Model:    "nova-2",
		Language: "en",
	}

	res, err := ds.client.FromFile(ctx, filePath, options)
	if err != nil {
		return "", err
	}

	// Extract the transcript from the response
	if len(res.Results.Channels) > 0 && len(res.Results.Channels[0].Alternatives) > 0 {
		return res.Results.Channels[0].Alternatives[0].Transcript, nil
	}

	return "", nil
}

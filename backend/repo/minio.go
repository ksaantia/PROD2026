package repo

import (
	"context"
	"net/url"
	"time"

	"github.com/minio/minio-go/v7"
)

type StorageService struct {
	minioClient *minio.Client
	bucketName  string
}

func NewStorageService(client *minio.Client, bucketName string) *StorageService {
	return &StorageService{
		minioClient: client,
		bucketName:  bucketName,
	}
}

// безопасная ссылкат на изображение
func (s *StorageService) GetPresignedURL(ctx context.Context, pathToFile string) (string, error) {
	if pathToFile == "" {
		return "", nil
	}

	expires := time.Minute * 15
	reqParams := make(url.Values)

	presignedURL, err := s.minioClient.PresignedGetObject(ctx, s.bucketName, pathToFile, expires, reqParams)
	if err != nil {
		return "", err
	}

	return presignedURL.String(), nil
}

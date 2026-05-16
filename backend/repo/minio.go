package repo

import (
	"context"
	"log"
	"os"
	"strconv"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// InitMinio инициализирует клиент и проверяет/создает бакет
func InitMinio() (*minio.Client, error) {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	// Конвертируем строку USE_SSL в bool
	useSSL, err := strconv.ParseBool(os.Getenv("MINIO_USE_SSL"))
	if err != nil {
		useSSL = false // по дефолту для локальной разработки выключаем
	}

	// 1. Создаем клиент MinIO
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, err
	}

	// 2. Лайфхак для хакатона: автоматически создаем бакет, если его нет
	ctx := context.Background()
	exists, err := minioClient.BucketExists(ctx, bucketName)
	if err != nil {
		return nil, err
	}

	if !exists {
		// Создаем бакет (по умолчанию в локальном MinIO регион можно оставить пустым)
		err = minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			return nil, err
		}
		log.Printf("Бакет '%s' успешно создан!", bucketName)
	} else {
		log.Printf("Бакет '%s' уже существует.", bucketName)
	}

	return minioClient, nil
}

package service

import (
	"backend/models"
	"backend/repo"
	"context"
	"log"
)

type ProductService struct {
	repo           *repo.ProductRepo
	storageService *repo.StorageService // Добавляем поле для работы с S3
}

// Обновленный конструктор: принимает и repo, и storage
func NewProductService(r *repo.ProductRepo, s *repo.StorageService) *ProductService {
	return &ProductService{
		repo:           r,
		storageService: s,
	}
}

func (s *ProductService) GetRecommendations(ctx context.Context, filter models.ProductFilter) ([]models.Product, error) {
	products, err := s.repo.GetByFilters(filter)
	if err != nil {
		return nil, err
	}

	for i := range products {
		// Берем оригинальный ключ из БД (например, "massage.jpg")
		if products[i].ImageKey != "" {
			url, err := s.storageService.GetPresignedURL(ctx, products[i].ImageKey)
			if err != nil {
				log.Printf("[MINIO ERROR] %v", err)
				continue
			}
			// ПРАВИЛЬНО: Пишем ссылку в ImageURL, оставляя ImageKey нетронутым
			products[i].ImageURL = url
		}
	}

	return products, nil
}

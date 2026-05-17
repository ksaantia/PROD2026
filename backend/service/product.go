package service

import (
	"backend/models"
	"backend/repo"
	"context"
	"log"
)

type ProductService struct {
	repo           *repo.ProductRepo
	storageService *repo.StorageService
}

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

		if products[i].ImageKey != "" {
			url, err := s.storageService.GetPresignedURL(ctx, products[i].ImageKey)
			if err != nil {
				log.Printf("[MINIO ERROR] %v", err)
				continue
			}

			products[i].ImageURL = url
		}
	}

	return products, nil
}

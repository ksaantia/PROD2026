package service

import (
	"backend/models"
	"backend/repo"
)

type ProductService struct {
	repo *repo.ProductRepo
}

func NewProductService(r *repo.ProductRepo) *ProductService {
	return &ProductService{repo: r}
}

func (s *ProductService) GetRecommendations(filter models.ProductFilter) ([]models.Product, error) {
	// Если это хакатон и вам нужны именно "рекомендации", можно добавить дефолтную сортировку.
	// Например, сначала показывать товары с бóльшим рейтингом.

	products, err := s.repo.GetByFilters(filter)
	if err != nil {
		return nil, err
	}

	// Здесь при необходимости можно отфильтровать или отсортировать слайс вручную
	return products, nil
}

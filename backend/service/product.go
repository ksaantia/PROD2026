package service

import (
	"backend/models"
	"backend/repo"
	"context"
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

func (s *ProductService) GetRecommendations(filter models.ProductFilter) ([]models.Product, error) {
	// 1. Получаем товары из БД через репозиторий
	products, err := s.repo.GetByFilters(filter)
	if err != nil {
		return nil, err
	}

	ctx := context.Background()

	// 2. Генерируем безопасные URL для каждого товара из MinIO
	for i := range products {
		if products[i].ImageKey != "" {
			// Вызываем метод созданного вами блока
			url, err := s.storageService.GetPresignedURL(ctx, products[i].ImageKey)
			if err == nil {
				products[i].ImageKey = url // Записываем ссылку в виртуальное поле
			} else {
				// Если ссылка не сгенерировалась, пишем ошибку в консоль, но не ломаем весь запрос
				println("Ошибка генерации пресайнд ссылки для ключа:", products[i].ImageKey, err.Error())
			}
		}
	}

	return products, nil
}

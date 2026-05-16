package repo

import (
	"backend/models"

	"gorm.io/gorm"
)

type ProductRepo struct {
	db *gorm.DB
}

func NewProductRepo(db *gorm.DB) *ProductRepo {
	return &ProductRepo{db: db}
}

func (r *ProductRepo) GetByFilters(filter models.ProductFilter) ([]models.Product, error) {
	var products []models.Product
	query := r.db.Model(&models.Product{})

	// Поиск по тексту (название или описание)
	if filter.Query != "" {
		percentQuery := "%" + filter.Query + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", percentQuery, percentQuery)
	}

	// Фильтр по категории
	if filter.Category != "" {
		query = query.Where("category = ?", filter.Category)
	}

	// Фильтры по цене
	if filter.MinPrice > 0 {
		query = query.Where("price >= ?", filter.MinPrice)
	}
	if filter.MaxPrice > 0 {
		query = query.Where("price <= ?", filter.MaxPrice)
	}

	// Фильтр по уровню премиальности
	if filter.PremiumLevel != "" {
		query = query.Where("premium_level = ?", filter.PremiumLevel)
	}

	// Выполняем запрос
	if err := query.Find(&products).Error; err != nil {
		return nil, err
	}

	return products, nil
}

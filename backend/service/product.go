package service

import (
	"backend/models"

	"gorm.io/gorm"
)

type ProductRepository interface {
	GetByID(id string) (*models.Product, error)
	Save(p *models.Product) error
	Delete(id string) error
}

type PostgresRepo struct {
	db *gorm.DB
}

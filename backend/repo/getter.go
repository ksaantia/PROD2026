package repo

import (
	"backend/models"
)

func (r *ProductRepo) GetByIDs(ids []uint) ([]models.Product, error) {
	var products []models.Product
	if err := r.db.Where("id IN ?", ids).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

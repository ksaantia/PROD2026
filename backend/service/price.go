package service

import (
	"backend/models"
	"backend/repo"
	"errors"
)

type OrderService struct {
	orderRepo   *repo.OrderRepo
	productRepo *repo.ProductRepo
}

func NewOrderService(o *repo.OrderRepo, p *repo.ProductRepo) *OrderService {
	return &OrderService{orderRepo: o, productRepo: p}
}

func (s *OrderService) ProcessOrder(req models.CreateOrderRequest) (float64, uint, error) {
	// счетчик товаров
	quantityMap := make(map[uint]int)
	var uniqueIDs []uint
	for _, id := range req.ProductIDs {
		if quantityMap[id] == 0 {
			uniqueIDs = append(uniqueIDs, id)
		}
		quantityMap[id]++
	}

	products, err := s.productRepo.GetByIDs(uniqueIDs)
	if err != nil {
		return 0, 0, err
	}
	if len(products) == 0 {
		return 0, 0, errors.New("no valid products found")
	}

	var items []models.CartItem
	var totalSum float64

	for _, p := range products {
		qty := quantityMap[p.ID]
		totalSum += p.Price * float64(qty)

		items = append(items, models.CartItem{
			ProductID: p.ID,
			Title:     p.Title,
			Price:     p.Price,
			Quantity:  qty,
		})
	}

	order := models.Order{
		Customer:  req.Name,
		Email:     req.Email,
		Recipient: req.Recipient,
		Comment:   req.Comment,
		TotalSum:  totalSum,
		Items:     items,
	}

	if err := s.orderRepo.Create(&order); err != nil {
		return 0, 0, err
	}

	return totalSum, order.ID, nil
}

package handlers

import (
	"backend/models"
	"backend/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	service *service.OrderService
}

func NewOrderHandler(s *service.OrderService) *OrderHandler {
	return &OrderHandler{service: s}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req models.CreateOrderRequest

	// Валидация JSON. Если корзина пустая или нет email/имени — вернет ошибку.
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	totalSum, orderID, err := h.service.ProcessOrder(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process order"})
		return
	}

	go service.SendOrderConfirmation(req.Email, req.Name, orderID, totalSum)

	c.JSON(http.StatusOK, models.CreateOrderResponse{
		TotalSum: totalSum,
		OrderID:  orderID,
	})
}

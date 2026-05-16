package handlers

import (
	"backend/models"
	"backend/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	service *service.ProductService
}

func NewProductHandler(s *service.ProductService) *ProductHandler {
	return &ProductHandler{
		service: s,
	}
}

func (h *ProductHandler) GetProducts(c *gin.Context) {
	var filter models.ProductFilter

	// Связываем параметры из URL (query, category и т.д.)
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Передаем контекст запроса и фильтр в сервис
	products, err := h.service.GetRecommendations(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	// Возвращаем успешный ответ со списком товаров
	c.JSON(http.StatusOK, products)
} // <-- ПРОВЕРЬ НАЛИЧИЕ ЭТОЙ СКОБКИ!

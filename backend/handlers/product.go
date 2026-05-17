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

// GetProducts godoc
// @Summary      Get list of products
// @Description  Responds with the list of all available products as JSON.
// @Tags         products
// @Produce      json
// @Success      200  {array}   models.Product
// @Router       /products [get]
func (h *ProductHandler) GetProducts(c *gin.Context) {
	var filter models.ProductFilter

	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	products, err := h.service.GetRecommendations(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

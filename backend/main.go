package main

import (
	"backend/handlers"
	"backend/models"
	"backend/repo"
	"backend/service"
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres" // или sqlite / mysql в зависимости от вашего стека
	"gorm.io/gorm"
)

func main() {
	// Настройка подключения к БД (замените dsn на свой)
	dsn := "host=localhost user=postgres password=secret dbname=wellness_shop port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// Автомиграция, чтобы таблицы создались сами
	db.AutoMigrate(&models.Product{}, &models.CartItem{}, &models.Order{})

	// Инициализация слоев (Dependency Injection на минималках)
	productRepo := repo.NewProductRepo(db)
	productService := service.NewProductService(productRepo)
	productHandler := handlers.NewProductHandler(productService)

	r := gin.Default()

	// Наш эндпоинт для фильтрации и рекомендаций
	r.GET("/api/products", productHandler.GetProducts)

	// Запуск на порту 8080
	r.Run(":8080")
}

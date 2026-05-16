package main

import (
	"backend/handlers"
	"backend/models"
	"backend/repo"
	"backend/service"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Println("Предупреждение: .env файл не найден, используются системные переменные")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"), os.Getenv("DB_SSLMODE"))

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

	r.GET("/api/products", productHandler.GetProducts)

	// Запуск на порту 8080
	r.Run(":8080")
}

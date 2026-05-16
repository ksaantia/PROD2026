package main

import (
	"backend/handlers"
	"backend/models"
	"backend/repo"
	"backend/service"
	"context"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := LoadEnv()

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// Автомиграция, чтобы таблицы создались сами
	db.AutoMigrate(&models.Product{}, &models.CartItem{}, &models.Order{})

	// Инициализация слоев (Dependency Injection на минималках)
	// Инициализация слоев
	productRepo := repo.NewProductRepo(db)
	orderRepo := repo.NewOrderRepo(db) // Новый репо

	productService := service.NewProductService(productRepo)
	orderService := service.NewOrderService(orderRepo, productRepo) // Новый сервис

	productHandler := handlers.NewProductHandler(productService)
	orderHandler := handlers.NewOrderHandler(orderService) // Новый хэндлер
	//TestDB(db)
	r := gin.Default()

	r.GET("/api/products", productHandler.GetProducts)
	r.POST("/api/orders", orderHandler.CreateOrder) // Новый эндпоинт для оформления заказа

	r.Run(":8080")
}

func LoadEnv() string {
	if err := godotenv.Load(); err != nil {
		log.Println("Предупреждение: .env файл не найден, используются системные переменные")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"), os.Getenv("DB_SSLMODE"))

	return dsn
}

func InitMinIO() (*minio.Client, error) {
	// Считываем конфигурацию из .env через os.Getenv
	endpoint := os.Getenv("MINIO_ENDPOINT")      // например, "127.0.0.1:9000"
	accessKey := os.Getenv("MINIO_ACCESS_KEY")   // например, "minioadmin"
	secretKey := os.Getenv("MINIO_SECRET_KEY")   // например, "minioadmin"
	bucketName := os.Getenv("MINIO_BUCKET_NAME") // например, "shop-images"
	useSSLStr := os.Getenv("MINIO_USE_SSL")
	useSSL, err := strconv.ParseBool(useSSLStr)
	if err != nil {
		useSSL = false // дефолтное значение, если в .env что-то пошло не так
	}

	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("не удалось создать клиент MinIO: %w", err)
	}

	// 2. Проверяем бакет (для хакатона критично автоматизировать этот шаг)
	ctx := context.Background()
	exists, err := minioClient.BucketExists(ctx, bucketName)
	if err != nil {
		return nil, fmt.Errorf("ошибка проверки бакета '%s': %w", bucketName, err)
	}

	if !exists {
		// Создаем бакет, если локальный запуск чистый
		err = minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			return nil, fmt.Errorf("не удалось автоматически создать бакет '%s': %w", bucketName, err)
		}
		log.Printf("[MinIO] Бакет '%s' успешно создан", bucketName)
	} else {
		log.Printf("[MinIO] Бакet '%s' уже существует, подключение успешно", bucketName)
	}

	return minioClient, nil
}

func TestDB(db *gorm.DB) {
	var count int64
	db.Model(&models.Product{}).Count(&count)

	// Если в базе уже есть продукты, ничего не делаем
	if count > 0 {
		return
	}

	log.Println("База данных пуста. Начинаем заполнение тестовыми wellness-продуктами...")

	products := []models.Product{
		{Title: "Массаж горячими камнями", Description: "Расслабляющий стоун-терапия для снятия стресса", Category: "SPA", Price: 120.00, PremiumLevel: models.LevelBasic, Rating: 4.8},
		{Title: "Комплексный Чекап Организма", Description: "Полное медицинское обследование премиум-класса", Category: "Health", Price: 450.00, PremiumLevel: models.LevelPremium, Rating: 4.9},
		{Title: "Абонемент на Медитации", Description: "10 занятий по глубокой осознанности и дыханию", Category: "Mindfulness", Price: 80.00, PremiumLevel: models.LevelBasic, Rating: 4.5},
		{Title: "Индивидуальный Йога-Ретрит", Description: "Выходные наедине с природой и тренером", Category: "Retreat", Price: 600.00, PremiumLevel: models.LevelVIP, Rating: 5.0},
		{Title: "Спа-день для двоих", Description: "Роскошная программа восстановления в гидромассажной зоне", Category: "SPA", Price: 250.00, PremiumLevel: models.LevelPremium, Rating: 4.7},
		{Title: "Консультация нутрициолога", Description: "Разбор рациона и составление персональной карты здоровья", Category: "Health", Price: 150.00, PremiumLevel: models.LevelBasic, Rating: 4.6},
	}

	if err := db.Create(&products).Error; err != nil {
		log.Printf("Ошибка при заполнении базы данных: %v\n", err)
	} else {
		log.Println("База данных успешно наполнена тестовыми продуктами!")
	}
}

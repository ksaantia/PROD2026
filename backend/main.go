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

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := LoadEnv()

	// 1. Подключение к БД
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
	db.AutoMigrate(&models.Product{}, &models.Order{}, &models.CartItem{})

	// 2. Инициализация MinIO
	minioClient, err := InitMinIO()
	if err != nil {
		log.Fatalf("failed to initialize MinIO: %v", err)
	}
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	// 3. Инициализация слоев (Dependency Injection)
	productRepo := repo.NewProductRepo(db)
	orderRepo := repo.NewOrderRepo(db)

	// Инициализируем наш StorageService, который лежит в пакете repo
	storageService := repo.NewStorageService(minioClient, bucketName)

	productService := service.NewProductService(productRepo, storageService)
	orderService := service.NewOrderService(orderRepo, productRepo)

	productHandler := handlers.NewProductHandler(productService)
	orderHandler := handlers.NewOrderHandler(orderService)

	TestDB(db)

	// 4. Настройка роутера
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
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	bucketName := os.Getenv("MINIO_BUCKET_NAME")
	useSSL := os.Getenv("MINIO_USE_SSL") == "true"

	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("не удалось создать клиент MinIO: %w", err)
	}

	ctx := context.Background()
	exists, err := minioClient.BucketExists(ctx, bucketName)
	if err != nil {
		return nil, fmt.Errorf("ошибка проверки бакета '%s': %w", bucketName, err)
	}

	if !exists {
		err = minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			return nil, fmt.Errorf("не удалось автоматически создать бакет '%s': %w", bucketName, err)
		}
		log.Printf("[MinIO] Бакет '%s' успешно создан", bucketName)
	} else {
		log.Printf("[MinIO] Бакет '%s' уже существует, подключение успешно", bucketName)
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
		{Title: "Ретрит в Altay Village Teletskoe", Description: "Эксклюзивные программы с использованием природных богатств Алтая: панты марала, икра тайменя, кедровое масло. Проживание в кедровых шале.", Category: "ретриты", Price: 55000.00, PremiumLevel: models.LevelVIP, Rating: 10.0, ImageKey: "Ретрит в Altay Village Teletskoe.webp"},
		{Title: "Ретрит «Elemental Wellness Journey»", Description: "Четырехдневное путешествие, построенное вокруг четырех стихий: земли, огня, воды и воздуха для вдохновения и восстановления.", Category: "ретриты", Price: 51000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Ретрит «Elemental Wellness Journey».jpg"},
		{Title: "Медитация с монахом в Amangiri", Description: "Утренняя осознанность, мантры, пение и медитации под открытым небом в сотрудничестве с буддийским монахом Геше Йонг Донгом.", Category: "медитации", Price: 51000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Медитация с монахом в Amangiri.jpg"},
		{Title: "Чекап в X-Clinic", Description: "Персональные медицинские программы: от экспресс-детокса до полного чекапа на базе клиники адаптационной медицины.", Category: "чекапы", Price: 49000.00, PremiumLevel: models.LevelVIP, Rating: 9.3, ImageKey: "Чекап в X-Clinic.webp"},
		{Title: "Йога и пилатес в «Первой Линии»", Description: "Программы физической активности в инновационном курорте премиум-класса, сочетающие оздоровительные практики и лекции о здоровье.", Category: "йога-программы", Price: 48000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Йога и пилатес в «Первой Линии».webp"},
		{Title: "Йога-программы в Tsar Palace Luxury Hotel", Description: "Групповые и персональные тренировки по йоге и пилатесу в роскошном дворцовом отеле с бассейном площадью 1500 м².", Category: "йога-программы", Price: 48500.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Йога-программы в Tsar Palace Luxury Hotel.webp"},
		{Title: "Сертификат в Amnis Spa", Description: "Процедуры по уходу за красотой и здоровьем на основе премиальных брендов. Включает бассейн под стеклянным куполом, финскую сауну, хаммам и джакузи.", Category: "spa", Price: 47000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Сертификат в Amnis Spa.jpg"},
		{Title: "Аюрведический детокс-погружение", Description: "Трех- или семидневные программы под руководством врача аюрведы: питание, консультации, спа-процедуры и йога.", Category: "чекапы", Price: 50000.00, PremiumLevel: models.LevelPremium, Rating: 0.0, ImageKey: "Аюрведический детокс-погружение.jpg"},
		{Title: "Авторский массаж лица «42 движения»", Description: "Уникальная авторская техника массажа лица, применяемая в спа-центре отеля «Новый Петергоф» с использованием французской косметики PAYOT.", Category: "массажи", Price: 45000.00, PremiumLevel: models.LevelPremium, Rating: 8.7, ImageKey: "Авторский массаж лица «42 движения».webp"},
		{Title: "Программа оздоровления в «Альфа-Радон»", Description: "Высокотехнологичный спа-центр с сильной базой восстановительной медицины. Специализация на радонотерапии и бальнеолечении.", Category: "чекапы", Price: 40000.00, PremiumLevel: models.LevelPremium, Rating: 0.0, ImageKey: "Программа оздоровления в «Альфа-Радон».jpg"},
		{Title: "SPA-пакет «Репино» для пар", Description: "Готовые спа-пакеты, включающие посещение просторного крытого бассейна, сауны, турецкой парной и японской бани фурако.", Category: "spa", Price: 30000.00, PremiumLevel: models.LevelBasic, Rating: 7.5, ImageKey: "SPA-пакет «Репино» для пар.jpg"},
		{Title: "Массаж камнями (Стоун-терапия) в Raivola", Description: "Профессиональный массаж горячими камнями для расслабления и восстановления сил в окружении природы.", Category: "массажи", Price: 10000.00, PremiumLevel: models.LevelBasic, Rating: 6.9, ImageKey: "Массаж камнями (Стоун-терапия) в Raivola.webp"},
		{Title: "Wellness-сессия с легендами спорта", Description: "Эксклюзивные программы тренировок и консультации, разработанные при участии советников Aman — Марии Шараповой и Новака Джоковича.", Category: "йога-программы", Price: 50000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Wellness-сессия с легендами спорта.jpg"},
		{Title: "Вертолетное сафари над Алтаем", Description: "Индивидуальные полеты над дикими районами Алтая с организацией пикников в труднодоступных местах и поддержкой персонального VIP-консьержа отеля Altay Village.", Category: "ретриты", Price: 50000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Вертолетное сафари над Алтаем.webp"},
		{Title: "Космическая экспедиция на орбиту", Description: "Полет на орбиту Земли или миссия к Марсу, включающая многомесячную подготовку и медицинские проверки.", Category: "Эксклюзивные путешествия", Price: 55000000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Космическая экспедиция на орбиту.jpg"},
		{Title: "Экспедиция «A World Less Traveled» на частном джете", Description: "18-дневное кругосветное путешествие на кастомизированном Airbus A321 через Саудовскую Аравию, Бразилию и Боливию.", Category: "Элитный отдых", Price: 1000000000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Экспедиция «A World Less Traveled» на частном джете.jpg"},
		{Title: "Аренда частного острова Necker Island", Description: "Полная приватность на частном острове Ричарда Брэнсона с роскошными виллами и безупречным сервисом.", Category: "Аренда острова", Price: 7000000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Аренда частного острова Necker Island.jpg"},
		{Title: "Круиз на суперъяхте", Description: "Аренда дизайнерской суперъяхты с персональным экипажем и посещением удаленных уголков планеты.", Category: "Морской отдых", Price: 72000000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Круиз на суперъяхте.jpg"},
		{Title: "Экспедиция в Антарктиду с White Desert", Description: "Путешествие на Южный полюс на частном самолете с проживанием в люксовых лагерях посреди льдов.", Category: "Эксклюзивные путешествия", Price: 5820000.00, PremiumLevel: models.LevelVIP, Rating: 0.0, ImageKey: "Экспедиция в Антарктиду с White Desert.jpg"},
		{Title: "Глубоководная экспедиция на Triton Submarines", Description: "Погружение на экстремальные глубины океана на частной высокотехнологичной подводной лодке.", Category: "Эксклюзивные впечатления", Price: 18200000.00, PremiumLevel: models.LevelVIP, Rating: 10.0, ImageKey: "Глубоководная экспедиция на Triton Submarines.jpg"},
		{Title: "Ужин со знаменитостью через Vertu Ruby Key", Description: "Эксклюзивные частные ужины с известными актерами, певцами или инфлюенсерами в роскошной обстановке.", Category: "Гастрономия", Price: 3000000.00, PremiumLevel: models.LevelPremium, Rating: 0.0, ImageKey: "Ужин со знаменитостью через Vertu Ruby Key.jpeg"},
		{Title: "Обучение на частного пилота вертолета", Description: "Индивидуальный курс подготовки пилотов частных вертолетов с возможностью ускоренного обучения.", Category: "Эксклюзивный спорт", Price: 2500000.00, PremiumLevel: models.LevelPremium, Rating: 0.0, ImageKey: "Обучение на частного пилота вертолета.jpg"},
		{Title: "Ужин-инсталляция в центре солончака Уюни", Description: "Обед из пяти блюд от шеф-повара Камилы Лечин внутри арт-объекта прямо посреди крупнейшего солончака планеты.", Category: "Гастрономия", Price: 500000.00, PremiumLevel: models.LevelPremium, Rating: 0.0, ImageKey: "Ужин-инсталляция в центре солончака Уюни.jpg"},
	}

	if err := db.Create(&products).Error; err != nil {
		log.Printf("Ошибка при заполнении базы данных: %v\n", err)
	} else {
		log.Println("База данных успешно наполнена тестовыми продуктами!")
	}
}

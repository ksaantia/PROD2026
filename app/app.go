package app

import (
	"github.com/gin-gonic/gin"
)

func Run() {
	r := gin.Default()

	// Раздаем статику (иначе index.html не найдет свои скрипты и стили)
	// Эти пути должны существовать относительно корня, где лежит main.go
	r.Static("/src", "./prod-shop/src")
	r.Static("/public", "./prod-shop/public")

	r.GET("/", index)

	r.Run(":8080")
}

func index(ctx *gin.Context) {
	// Используй .File вместо .HTML
	// Путь пишем относительно корня проекта (где запускаешь go run main.go)
	ctx.File("prod-shop/index.html")
}

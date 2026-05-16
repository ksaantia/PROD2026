package service

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
)

// SendOrderConfirmation отправляет красивое HTML-письмо с благодарностью
func SendOrderConfirmation(toEmail, userName string, orderID uint, totalSum float64) {
	// 1. Настройки SMTP (в идеале хранить в .env, но для тестов пишем тут)
	from := os.Getenv("EMAIL_FROM")         // Твоя реальная почта
	password := os.Getenv("EMAIL_PASSWORD") // Без пробелов!
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// 2. Формируем заголовки и тело письма (HTML)
	// Обязательно оставляем пустую строку (\r\n\r\n) перед телом body
	subject := "Subject: Спасибо за заказ в Wellness!\r\n"
	mime := "MIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n\r\n"

	body := fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
			<h2 style="color: #2e7d32;">Привет, %s! 🌿</h2>
			<p>Спасибо за твой заказ <b>№%d</b> на сумму <b>%.2f руб.</b></p>
			<p>Твои Wellness-подарки уже оформлены. Если ты указывал комментарий к заказу, мы его обязательно учтем.</p>
			<hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
			<p style="font-size: 12px; color: #888;">С заботой о тебе,<br>Команда Wellness</p>
		</div>
	`, userName, orderID, totalSum)

	msg := []byte(subject + mime + body)

	// 3. Авторизация на сервере Google
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// 4. Отправка
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{toEmail}, msg)
	if err != nil {
		log.Printf("[EMAIL ERROR] Не удалось отправить письмо на %s: %v", toEmail, err)
		return
	}

	log.Printf("[EMAIL SUCCESS] Письмо успешно отправлено на %s", toEmail)
}

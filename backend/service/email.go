package service

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
)

func SendOrderConfirmation(toEmail, userName string, orderID uint, totalSum float64) {

	from := os.Getenv("EMAIL_FROM")
	password := os.Getenv("EMAIL_PASSWORD")
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	subject := "Subject: Спасибо за заказ в Wellness!\r\n"
	mime := "MIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n\r\n"

	body := fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
			<h2 style="color: #2e7d32;">Здравствуйте, %s! 🌿</h2>
			<p>Спасибо за ваш заказ <b>№%d</b> на сумму <b>%.2f руб.</b></p>
			<p>Ваши Wellness-подарки уже оформлены. Если Вы указывали комментарий к заказу, мы его обязательно учтем.</p>
			<hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
			<p style="font-size: 12px; color: #888;">С заботой о вас,<br>Команда Wellness</p>
		</div>
	`, userName, orderID, totalSum)

	msg := []byte(subject + mime + body)

	auth := smtp.PlainAuth("", from, password, smtpHost)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{toEmail}, msg)
	if err != nil {
		log.Printf("[EMAIL ERROR] Не удалось отправить письмо на %s: %v", toEmail, err)
		return
	}

	log.Printf("[EMAIL SUCCESS] Письмо успешно отправлено на %s", toEmail)
}

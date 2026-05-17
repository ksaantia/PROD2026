package models

type PremiumLevel string

const (
	LevelBasic   PremiumLevel = "Basic"
	LevelPremium PremiumLevel = "Premium"
	LevelVIP     PremiumLevel = "VIP"
)

type Product struct {
	ID                  uint         `json:"id" gorm:"primaryKey"`
	Title               string       `json:"title" gorm:"type:varchar(255);not null" binding:"required"`
	Description         string       `json:"description" gorm:"type:text"`
	ExpandedDescription string       `json:"expanded_description" gorm:"type:text"`
	Category            string       `json:"category" gorm:"type:varchar(100);index" binding:"required"`
	Price               float64      `json:"price" gorm:"type:numeric(15,2);index" binding:"required"`
	PremiumLevel        PremiumLevel `json:"premium_level" gorm:"type:varchar(50);index"`
	ImageKey            string       `json:"image_key" gorm:"type:varchar(255)"`
	ImageURL            string       `json:"image_url" gorm:"-"`
	Rating              float32      `json:"rating" gorm:"type:real;default:0"`
}

type CartItem struct {
	ID        uint    `json:"id" gorm:"primaryKey"`
	OrderID   uint    `json:"-" gorm:"index"`
	ProductID uint    `json:"product_id"`
	Title     string  `json:"title"`
	Price     float64 `json:"price"`
	Quantity  int     `json:"quantity" gorm:"default:1"`
}

type Order struct {
	ID        uint       `json:"id" gorm:"primaryKey"`
	Customer  string     `json:"customer_name" gorm:"type:varchar(255);not null" binding:"required"`
	Email     string     `json:"email" gorm:"type:varchar(255);not null" binding:"required,email"`
	Recipient string     `json:"recipient" gorm:"type:varchar(255)"`
	Comment   string     `json:"comment" gorm:"type:text"`
	Items     []CartItem `json:"items" gorm:"foreignKey:OrderID"`
	TotalSum  float64    `json:"total_sum" gorm:"type:decimal(10,2)"`
}

type ProductFilter struct {
	Query        string  `form:"query"`
	Category     string  `form:"category"`
	MinPrice     float64 `form:"min_price"`
	MaxPrice     float64 `form:"max_price"`
	PremiumLevel string  `form:"premium_level"`
}

type CreateOrderRequest struct {
	Name       string `json:"name" binding:"required"`
	Email      string `json:"email" binding:"required,email"`
	Recipient  string `json:"recipient"`
	Comment    string `json:"comment"`
	ProductIDs []uint `json:"product_ids" binding:"required,min=1"`
}

type CreateOrderResponse struct {
	TotalSum float64 `json:"total_sum"`
	OrderID  uint    `json:"order_id"`
}

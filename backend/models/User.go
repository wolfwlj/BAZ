package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email       string `gorm:"type:text" json:"email"`
	Username    string `gorm:"type:text" json:"username"`
	Password    string `gorm:"type:text" json:"-"`
	FirstName   string `gorm:"type:text" json:"first_name"`
	LastName    string `gorm:"type:text" json:"last_name"`
	PhoneNumber string `gorm:"type:text" json:"phone_number"`
}

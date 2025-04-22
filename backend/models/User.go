package models

import (
	"gorm.io/gorm"
)


type User struct {
	gorm.Model
	Email string `gorm:"type:text"`
	Username string `gorm:"type:text"`
	Password string `gorm:"type:text" json:"-"`
	FirstName string `gorm:"type:text"`
	LastName string `gorm:"type:text"`
}
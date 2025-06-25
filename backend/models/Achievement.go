package models

import (
	"gorm.io/gorm"
)

type Achievement struct {
	gorm.Model

	Name        string `gorm:"type:text" json:"name"`
	Description string `gorm:"type:text" json:"description"`
}

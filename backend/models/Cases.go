package models

import (
	"gorm.io/gorm"
)

type Cases struct {
	gorm.Model
	Status string `gorm:"type:text" json:"status"`
	Reason string `gorm:"type:text" json:"reason"`
	Note   string `gorm:"type:text" json:"notes"`
	UserID int    `gorm:"type:int" json:"user_id"`
}

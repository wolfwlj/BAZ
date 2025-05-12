package models

import (
	"gorm.io/gorm"
)

type UserStats struct {
	gorm.Model
	ID			uint   `gorm:"type:int" json:"id"`
	UserID      uint   `gorm:"type:int" json:"user_id"`
	Streak		uint   `gorm:"type:int" json:"streak"`
	Cases		uint   `gorm:"type:type:int json:"streak"`
	Achievments_gained		uint   `gorm:"type:type:int json:"Achievments_gained"`
}

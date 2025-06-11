package models

import (
	"gorm.io/gorm"
)

type Stats struct {
	gorm.Model

	Streak              int `gorm:"type:int" json:"streak"`
	Cases               int `gorm:"type:int" json:"cases"`
	Achievements_gained int `gorm:"type:int" json:"achievements_gained"`
	UserID              int `gorm:"type:int" json:"user_id"`
}

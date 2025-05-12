package models

import (
	"time"

	"gorm.io/gorm"
)

type Accoplishments struct {
	gorm.Model
	ID    uint `gorm:"type:int" json:"id"`
	Date_achieved   time.Time `gorm:"type:date" json:"date_achieved"`
	UserID	uint `gorm:"type:int" json:"user_id"`
	AchievementID	uint `gorm:"type:int" json:"achievement_id"`
}

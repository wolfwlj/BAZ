package models

import (
	"time"

	"gorm.io/gorm"
)

type Accomplished_achievements struct {
	gorm.Model

	Date_achieved time.Time `gorm:"type:datetime" json:"date_achieved"`
	UserID        int       `gorm:"type:int" json:"user_id"`
	AchievementID int       `gorm:"type:int" json:"achievement_id"`
}

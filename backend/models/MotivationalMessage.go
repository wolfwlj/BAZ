package models

import (
	"gorm.io/gorm"
)

type MotivationalMessage struct {
	gorm.Model
	Message     string `gorm:"type:text" json:"message"`
	MessageType string `gorm:"type:text" json:"message_type"` // breakfast, lunch, dinner, general
	UserID      uint   `gorm:"type:int" json:"user_id"`
	User        User   `gorm:"foreignKey:UserID" json:"user"`
	IsRead      bool   `gorm:"type:boolean;default:false" json:"is_read"`
	ScheduledFor string `gorm:"type:text" json:"scheduled_for"` // Time of day to show this message
}

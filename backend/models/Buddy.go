package models

import (
	"gorm.io/gorm"
)

type Buddy struct {
	gorm.Model
	PatiendID int  `gorm:"type:int" json:"patiend_id"`
	BuddyID   int  `gorm:"type:int" json:"guardian_id"`
	Buddy     User `gorm:"foreignKey:GuardianID" json:"guardian"`
}

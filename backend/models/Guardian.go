package models

import (
	"gorm.io/gorm"
)

type Guardian struct {
	gorm.Model
	PatiendID  int  `gorm:"type:int" json:"patiend_id"`
	GuardianID int  `gorm:"type:int" json:"guardian_id"`
	Guardian   User `gorm:"foreignKey:GuardianID" json:"guardian"`
}

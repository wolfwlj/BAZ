package models

import (
	"gorm.io/gorm"
)

type Achievements struct {
	gorm.Model
	ID			uint   `gorm:"type:int" json:"id"`
	Name		string   `gorm:"type:string json:"name"`
	Discription		string   `gorm:"type:string json:"discription"`
}

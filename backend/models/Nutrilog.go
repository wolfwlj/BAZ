package models

import (
	"gorm.io/gorm"
)

type Nutrilog struct {
	gorm.Model
	Calories    int    `gorm:"type:int" json:"calories"`
	Proteins    int    `gorm:"type:int" json:"proteins"`
	Fats        int    `gorm:"type:int" json:"fats"`
	Carbohydrates int  `gorm:"type:int" json:"carbohydrates"`
	MealType    string `gorm:"type:text" json:"meal_type"`
	MealTime    string `gorm:"type:text" json:"meal_time"`
	MealDate    string `gorm:"type:text" json:"meal_date"`
	MealDescription string `gorm:"type:text" json:"meal_description"`
	UserID      uint   `gorm:"type:int" json:"user_id"`
	User        User   `gorm:"foreignKey:UserID" json:"user"`
}

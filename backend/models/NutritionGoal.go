package models

import (
	"time"
	"gorm.io/gorm"
)

type NutritionGoal struct {
	gorm.Model
	UserID        uint      `gorm:"type:int;not null" json:"user_id"`
	User          User      `gorm:"foreignKey:UserID" json:"user"`
	CaloriesGoal  int       `gorm:"type:int;default:2000" json:"calories_goal"`
	ProteinsGoal  int       `gorm:"type:int;default:75" json:"proteins_goal"`
	FatsGoal      int       `gorm:"type:int;default:65" json:"fats_goal"`
	CarbsGoal     int       `gorm:"type:int;default:250" json:"carbs_goal"`
	IsActive      bool      `gorm:"type:boolean;default:true" json:"is_active"`
	StartDate     time.Time `gorm:"type:datetime" json:"start_date"`
	GoalAchievedDays int    `gorm:"type:int;default:0" json:"goal_achieved_days"`
	LastAchievedDate *time.Time `gorm:"type:datetime" json:"last_achieved_date"`
}

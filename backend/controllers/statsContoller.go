package controllers

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"

	"github.com/gin-gonic/gin"
)

func InitialzeStat(c *gin.Context) {
	
	var body struct {
	UserID      uint   `json:"user_id"`
	Streak		uint   `json:"streak"`
	Cases		uint   `json:"streak"`
	Achievments_gained		uint   `json:"Achievments_gained"`
	}

	stats := models.UserStats {
		UserID: body.UserID,
		Streak: body.Streak,
		Cases: body.Cases,
		Achievments_gained: body.Achievments_gained,
	}

	c.Bind(&body)

	result := initializers.DB.Create(&stats)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "User stat initialized",
	})
}

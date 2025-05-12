package controllers

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateAccomplishment(c *gin.Context) {
	
	var body struct {
		Date_achieved	time.Time	`json:"date_achieved"`
		UserID			uint		`json:"userid"`
		AchievementID	uint		`json:"achiement_id"`
	}
	
	c.Bind(&body)

	accomplishment := models.Accoplishments {
		Date_achieved: body.Date_achieved,
		UserID: body.UserID,
		AchievementID: body.AchievementID,
	}

	result := initializers.DB.Create(&accomplishment)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "Accomplishment created",
		"accomplishment": accomplishment,
	})
}

func GetAccomplishmentsForUser(c *gin.Context) {

	id := c.Param("id")
	
	var accomplishments []models.Accoplishments

	result := initializers.DB.Model(&models.Accoplishments{}).Where("user_id = ?", id).First(&accomplishments)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"accomplishments": accomplishments,
	})
}



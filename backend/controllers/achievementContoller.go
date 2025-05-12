package controllers

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"

	"github.com/gin-gonic/gin"
)

func CreateAchievements(c *gin.Context) {
	
	var body struct {
		ID			  uint	   `json:"id"`
		Name          string   `json:"name"`
		Discription   string   `json:"discription"`
	}

	c.Bind(&body)

	achievements := models.Achievements {
		ID: body.ID,
		Name: body.Name,
		Discription: body.Discription,
	}


	result := initializers.DB.Create(&achievements)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "Achievement created",
		"achievemenet": achievements,
	})

}


func GetAchievementById(c *gin.Context) {
	id := c.Param("id")

	var achievement models.Achievements

	result := initializers.DB.First(&achievement, id)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"achievements": achievement,
	})
}


func GetAchievements(c *gin.Context) {
	var achiements []models.Achievements

	result := initializers.DB.First(&achiements)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"achievements": achiements,
	})
}


func UpdateAchievementById(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		Name		string	`json:"name"`
		Discription	string	`json:"discription"`
	}
	
	c.Bind(&body)

	result := initializers.DB.Model(&models.Achievements{}).Where("id = ?", id).Updates(models.Achievements{
		Name: body.Name,
		Discription: body.Discription,
	})

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "Achievement updated successfully",
	})
}

func DeleteAchievementById(c *gin.Context) {
	id := c.Param("id")

	result := initializers.DB.Delete(&models.Achievements{}, id)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "Achievement deleted successfully",
	})
}

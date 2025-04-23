package controllers

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"

	"github.com/gin-gonic/gin"
)

func CreateNutrilog(c *gin.Context) {

	var body struct {
		Calories        int    `json:"calories"`
		Proteins        int    `json:"proteins"`
		Fats            int    `json:"fats"`
		Carbohydrates   int    `json:"carbohydrates"`
		MealType        string `json:"meal_type"`
		MealTime        string `json:"meal_time"`
		MealDate        string `json:"meal_date"` 
		MealDescription string `json:"meal_description"`
		UserID          uint   `json:"user_id"`
	}

	c.Bind(&body)

	nutrilog := models.Nutrilog{
		Calories:        body.Calories,
		Proteins:        body.Proteins,
		Fats:            body.Fats,
		Carbohydrates:   body.Carbohydrates,
		MealType:        body.MealType,
		MealTime:        body.MealTime,
		MealDate:        body.MealDate,
		MealDescription: body.MealDescription,
		UserID:          body.UserID,
	}

	result := initializers.DB.Create(&nutrilog)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "Nutrilog created",
		"nutrilog":  nutrilog,
	})
}

func GetNutrilogById(c *gin.Context) {

	id := c.Param("id")

	var nutrilog models.Nutrilog

	result := initializers.DB.First(&nutrilog, id)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"nutrilog": nutrilog,
	})
}

func GetNutrilogs(c *gin.Context) {
	
	var nutrilogs []models.Nutrilog

	initializers.DB.Find(&nutrilogs)

	c.JSON(200, gin.H{
		"nutrilogs": nutrilogs,
	})

}

func UpdateNutrilogById(c *gin.Context) {

	id := c.Param("id")

	var body struct {
		Calories        int    `json:"calories"`
		Proteins        int    `json:"proteins"`
		Fats            int    `json:"fats"`
		Carbohydrates   int    `json:"carbohydrates"`
		MealType        string `json:"meal_type"`
		MealTime        string `json:"meal_time"`
		MealDate        string `json:"meal_date"`
		MealDescription string `json:"meal_description"`
		UserID          uint   `json:"user_id"`
	}

	c.Bind(&body)

	result := initializers.DB.Model(&models.Nutrilog{}).Where("id = ?", id).Updates(models.Nutrilog{
		Calories:        body.Calories,
		Proteins:        body.Proteins,
		Fats:            body.Fats,
		Carbohydrates:   body.Carbohydrates,
		MealType:        body.MealType,
		MealTime:        body.MealTime,
		MealDate:        body.MealDate,
		MealDescription: body.MealDescription,
		UserID:          body.UserID,
	})

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "Nutrilog updated successfully",
	})

}

func DeleteNutrilogById(c *gin.Context) {

	id := c.Param("id")

	result := initializers.DB.Delete(&models.Nutrilog{}, id)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "Nutrilog deleted successfully",
	})

}
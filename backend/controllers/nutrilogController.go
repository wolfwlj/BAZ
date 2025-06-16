package controllers

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateNutrilog(c *gin.Context) {
	// Get the authenticated user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	authenticatedUser := user.(models.User)

	var body struct {
		Calories        int    `json:"calories"`
		Proteins        int    `json:"proteins"`
		Fats            int    `json:"fats"`
		Carbohydrates   int    `json:"carbohydrates"`
		MealType        string `json:"meal_type"`
		MealTime        string `json:"meal_time"`
		MealDate        string `json:"meal_date"`
		MealDescription string `json:"meal_description"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	nutrilog := models.Nutrilog{
		Calories:        body.Calories,
		Proteins:        body.Proteins,
		Fats:            body.Fats,
		Carbohydrates:   body.Carbohydrates,
		MealType:        body.MealType,
		MealTime:        body.MealTime,
		MealDate:        body.MealDate,
		MealDescription: body.MealDescription,
		UserID:          authenticatedUser.ID,
	}

	result := initializers.DB.Create(&nutrilog)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message":  "Nutrilog created",
		"nutrilog": nutrilog,
	})
}

func GetNutrilogById(c *gin.Context) {
	// Get the authenticated user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	authenticatedUser := user.(models.User)

	id := c.Param("id")

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	var nutrilog models.Nutrilog

	// Only get nutrilog if it belongs to the authenticated user
	result := initializers.DB.Where("id = ? AND user_id = ?", id, authenticatedUser.ID).First(&nutrilog)

	if result.Error != nil {
		c.JSON(404, gin.H{"error": "Nutrilog not found or unauthorized"})
		return
	}

	c.JSON(200, gin.H{
		"nutrilog": nutrilog,
	})
}

func GetNutrilogs(c *gin.Context) {
	// Get the authenticated user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	authenticatedUser := user.(models.User)

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	var nutrilogs []models.Nutrilog

	// Only get nutrilogs for the authenticated user
	result := initializers.DB.Where("user_id = ?", authenticatedUser.ID).Find(&nutrilogs)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to fetch nutrilogs",
		})
		return
	}

	c.JSON(200, gin.H{
		"nutrilogs": nutrilogs,
	})
}

func UpdateNutrilogById(c *gin.Context) {
	// Get the authenticated user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	authenticatedUser := user.(models.User)

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
	}

	c.Bind(&body)

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	// Only update if the nutrilog belongs to the authenticated user
	result := initializers.DB.Model(&models.Nutrilog{}).
		Where("id = ? AND user_id = ?", id, authenticatedUser.ID).
		Updates(models.Nutrilog{
			Calories:        body.Calories,
			Proteins:        body.Proteins,
			Fats:            body.Fats,
			Carbohydrates:   body.Carbohydrates,
			MealType:        body.MealType,
			MealTime:        body.MealTime,
			MealDate:        body.MealDate,
			MealDescription: body.MealDescription,
		})

	if result.Error != nil {
		c.JSON(400, gin.H{"error": "Failed to update nutrilog"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(404, gin.H{"error": "Nutrilog not found or unauthorized"})
		return
	}

	c.JSON(200, gin.H{
		"message": "Nutrilog updated successfully",
	})
}

func DeleteNutrilogById(c *gin.Context) {
	// Get the authenticated user from context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	authenticatedUser := user.(models.User)

	id := c.Param("id")

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	// Only delete if the nutrilog belongs to the authenticated user
	result := initializers.DB.Where("id = ? AND user_id = ?", id, authenticatedUser.ID).Delete(&models.Nutrilog{})

	if result.Error != nil {
		c.JSON(400, gin.H{"error": "Failed to delete nutrilog"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(404, gin.H{"error": "Nutrilog not found or unauthorized"})
		return
	}

	c.JSON(200, gin.H{
		"message": "Nutrilog deleted successfully",
	})
}

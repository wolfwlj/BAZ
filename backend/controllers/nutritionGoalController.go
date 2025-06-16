package controllers

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateNutritionGoal(c *gin.Context) {
	var body struct {
		UserID       uint `json:"user_id"`
		CaloriesGoal int  `json:"calories_goal"`
		ProteinsGoal int  `json:"proteins_goal"`
		FatsGoal     int  `json:"fats_goal"`
		CarbsGoal    int  `json:"carbs_goal"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	if initializers.DB == nil {
		c.JSON(500, gin.H{"error": "database connection not available"})
		return
	}

	// Deactivate previous goals for this user
	initializers.DB.Model(&models.NutritionGoal{}).Where("user_id = ? AND is_active = ?", body.UserID, true).Update("is_active", false)

	nutritionGoal := models.NutritionGoal{
		UserID:       body.UserID,
		CaloriesGoal: body.CaloriesGoal,
		ProteinsGoal: body.ProteinsGoal,
		FatsGoal:     body.FatsGoal,
		CarbsGoal:    body.CarbsGoal,
		IsActive:     true,
		StartDate:    time.Now(),
	}

	result := initializers.DB.Create(&nutritionGoal)

	if result.Error != nil {
		c.JSON(400, gin.H{"error": "Failed to create nutrition goal"})
		return
	}

	c.JSON(200, gin.H{
		"message":        "Nutrition goal created",
		"nutrition_goal": nutritionGoal,
	})
}

func GetActiveNutritionGoal(c *gin.Context) {
	userIDStr := c.Param("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid user ID"})
		return
	}

	if initializers.DB == nil {
		c.JSON(500, gin.H{"error": "database connection not available"})
		return
	}

	var nutritionGoal models.NutritionGoal
	result := initializers.DB.Where("user_id = ? AND is_active = ?", uint(userID), true).First(&nutritionGoal)

	if result.Error != nil {
		// Create default goal if none exists
		defaultGoal := models.NutritionGoal{
			UserID:       uint(userID),
			CaloriesGoal: 2000,
			ProteinsGoal: 75,
			FatsGoal:     65,
			CarbsGoal:    250,
			IsActive:     true,
			StartDate:    time.Now(),
		}
		
		createResult := initializers.DB.Create(&defaultGoal)
		if createResult.Error != nil {
			c.JSON(400, gin.H{"error": "Failed to create default nutrition goal"})
			return
		}
		
		c.JSON(200, gin.H{"nutrition_goal": defaultGoal})
		return
	}

	c.JSON(200, gin.H{"nutrition_goal": nutritionGoal})
}

func UpdateNutritionGoal(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		CaloriesGoal int `json:"calories_goal"`
		ProteinsGoal int `json:"proteins_goal"`
		FatsGoal     int `json:"fats_goal"`
		CarbsGoal    int `json:"carbs_goal"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	if initializers.DB == nil {
		c.JSON(500, gin.H{"error": "database connection not available"})
		return
	}

	result := initializers.DB.Model(&models.NutritionGoal{}).Where("id = ?", id).Updates(models.NutritionGoal{
		CaloriesGoal: body.CaloriesGoal,
		ProteinsGoal: body.ProteinsGoal,
		FatsGoal:     body.FatsGoal,
		CarbsGoal:    body.CarbsGoal,
	})

	if result.Error != nil {
		c.JSON(400, gin.H{"error": "Failed to update nutrition goal"})
		return
	}

	c.JSON(200, gin.H{"message": "Nutrition goal updated successfully"})
}

func CheckAndUpdateGoalProgress(c *gin.Context) {
	userIDStr := c.Param("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid user ID"})
		return
	}

	if initializers.DB == nil {
		c.JSON(500, gin.H{"error": "database connection not available"})
		return
	}

	// Get active nutrition goal
	var nutritionGoal models.NutritionGoal
	result := initializers.DB.Where("user_id = ? AND is_active = ?", uint(userID), true).First(&nutritionGoal)
	if result.Error != nil {
		c.JSON(400, gin.H{"error": "No active nutrition goal found"})
		return
	}

	// Get today's nutrilogs
	today := time.Now().Format("2006-01-02")
	var todayNutrilogs []models.Nutrilog
	initializers.DB.Where("user_id = ? AND meal_date = ?", uint(userID), today).Find(&todayNutrilogs)

	// Calculate today's totals
	var totalCalories, totalProteins, totalFats, totalCarbs int
	for _, log := range todayNutrilogs {
		totalCalories += log.Calories
		totalProteins += log.Proteins
		totalFats += log.Fats
		totalCarbs += log.Carbohydrates
	}

	// Check if goals are achieved (within 10% tolerance)
	caloriesAchieved := float64(totalCalories) >= float64(nutritionGoal.CaloriesGoal)*0.9
	proteinsAchieved := float64(totalProteins) >= float64(nutritionGoal.ProteinsGoal)*0.9
	fatsAchieved := float64(totalFats) >= float64(nutritionGoal.FatsGoal)*0.9
	carbsAchieved := float64(totalCarbs) >= float64(nutritionGoal.CarbsGoal)*0.9

	goalAchieved := caloriesAchieved && proteinsAchieved && fatsAchieved && carbsAchieved

	if goalAchieved {
		now := time.Now()
		// Check if this is a consecutive day
		if nutritionGoal.LastAchievedDate != nil {
			yesterday := now.AddDate(0, 0, -1).Format("2006-01-02")
			lastAchievedDate := nutritionGoal.LastAchievedDate.Format("2006-01-02")
			
			if lastAchievedDate == yesterday {
				nutritionGoal.GoalAchievedDays++
			} else if lastAchievedDate != today {
				nutritionGoal.GoalAchievedDays = 1
			}
		} else {
			nutritionGoal.GoalAchievedDays = 1
		}
		
		nutritionGoal.LastAchievedDate = &now
		
		// Check if goals should be increased (after 7 consecutive days)
		shouldIncreaseGoals := nutritionGoal.GoalAchievedDays >= 7
		
		if shouldIncreaseGoals {
			// Increase goals by 5%
			nutritionGoal.CaloriesGoal = int(float64(nutritionGoal.CaloriesGoal) * 1.05)
			nutritionGoal.ProteinsGoal = int(float64(nutritionGoal.ProteinsGoal) * 1.05)
			nutritionGoal.FatsGoal = int(float64(nutritionGoal.FatsGoal) * 1.05)
			nutritionGoal.CarbsGoal = int(float64(nutritionGoal.CarbsGoal) * 1.05)
			nutritionGoal.GoalAchievedDays = 0
			nutritionGoal.StartDate = now
		}
		
		initializers.DB.Save(&nutritionGoal)
	}

	c.JSON(200, gin.H{
		"goal_achieved":        goalAchieved,
		"consecutive_days":     nutritionGoal.GoalAchievedDays,
		"goals_increased":      goalAchieved && nutritionGoal.GoalAchievedDays >= 7,
		"current_totals": gin.H{
			"calories":      totalCalories,
			"proteins":      totalProteins,
			"fats":          totalFats,
			"carbohydrates": totalCarbs,
		},
		"nutrition_goal": nutritionGoal,
	})
}

func GetNutrilogsByUserAndDate(c *gin.Context) {
	userIDStr := c.Param("user_id")
	date := c.Query("date")
	
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid user ID"})
		return
	}

	if date == "" {
		date = time.Now().Format("2006-01-02")
	}

	if initializers.DB == nil {
		c.JSON(500, gin.H{"error": "database connection not available"})
		return
	}

	var nutrilogs []models.Nutrilog
	result := initializers.DB.Where("user_id = ? AND meal_date = ?", uint(userID), date).Find(&nutrilogs)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to fetch nutrilogs"})
		return
	}

	c.JSON(200, gin.H{
		"nutrilogs": nutrilogs,
		"date":      date,
	})
}

package controllers

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"
	"time"

	"github.com/gin-gonic/gin"
)

// CreateMotivationalMessage creates a new motivational message
func CreateMotivationalMessage(c *gin.Context) {
	var body struct {
		Message      string `json:"message"`
		MessageType  string `json:"message_type"`
		UserID       uint   `json:"user_id"`
		ScheduledFor string `json:"scheduled_for"`
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

	message := models.MotivationalMessage{
		Message:      body.Message,
		MessageType:  body.MessageType,
		UserID:       body.UserID,
		IsRead:       false,
		ScheduledFor: body.ScheduledFor,
	}

	result := initializers.DB.Create(&message)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message":              "Motivational message created",
		"motivational_message": message,
	})
}

// GetMotivationalMessagesByUser gets all motivational messages for a user
func GetMotivationalMessagesByUser(c *gin.Context) {
	userID := c.Param("user_id")

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	var messages []models.MotivationalMessage

	result := initializers.DB.Where("user_id = ?", userID).Find(&messages)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"motivational_messages": messages,
	})
}

// GetUnreadMotivationalMessagesByUser gets all unread motivational messages for a user
func GetUnreadMotivationalMessagesByUser(c *gin.Context) {
	userID := c.Param("user_id")

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	var messages []models.MotivationalMessage

	result := initializers.DB.Where("user_id = ? AND is_read = ?", userID, false).Find(&messages)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"motivational_messages": messages,
	})
}

// GetTimedMotivationalMessages gets motivational messages for a user based on current time
func GetTimedMotivationalMessages(c *gin.Context) {
	userID := c.Param("user_id")
	
	// Get current time in HH:MM format
	currentTime := time.Now().Format("15:04")

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	var messages []models.MotivationalMessage

	// Get messages scheduled for this time or general messages
	result := initializers.DB.Where("user_id = ? AND (scheduled_for = ? OR message_type = 'general')", userID, currentTime).Find(&messages)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"motivational_messages": messages,
	})
}

// MarkMessageAsRead marks a motivational message as read
func MarkMessageAsRead(c *gin.Context) {
	id := c.Param("id")

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	result := initializers.DB.Model(&models.MotivationalMessage{}).Where("id = ?", id).Update("is_read", true)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "Message marked as read",
	})
}

// DeleteMotivationalMessage deletes a motivational message
func DeleteMotivationalMessage(c *gin.Context) {
	id := c.Param("id")

	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		c.JSON(500, gin.H{
			"error": "database connection not available",
		})
		return
	}

	result := initializers.DB.Delete(&models.MotivationalMessage{}, id)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"message": "Motivational message deleted successfully",
	})
}

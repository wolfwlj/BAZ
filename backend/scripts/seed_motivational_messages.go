package main

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"
	"fmt"
	"log"
)

// Sample motivational messages for different meal types
var breakfastMessages = []string{
	"Start your day right with a nutritious breakfast!",
	"Good morning! Remember that breakfast is the most important meal of the day.",
	"A healthy breakfast sets you up for success all day long.",
	"Time for breakfast! Fuel your body for the day ahead.",
	"Don't skip breakfast today - your body needs energy to start the day!",
}

var lunchMessages = []string{
	"It's lunchtime! Take a break and enjoy a balanced meal.",
	"Don't forget to eat lunch today - your body needs refueling!",
	"A nutritious lunch helps maintain your energy throughout the day.",
	"Lunchtime reminder: Eating regularly helps maintain stable blood sugar levels.",
	"Take time to enjoy your lunch - mindful eating improves digestion!",
}

var dinnerMessages = []string{
	"Dinner time! End your day with a balanced, nutritious meal.",
	"Remember to eat dinner at a reasonable time for better sleep.",
	"A light, healthy dinner is best for good sleep and digestion.",
	"Don't skip dinner - your body needs nutrients to recover overnight.",
	"Enjoy a mindful dinner without distractions for better digestion.",
}

var generalMessages = []string{
	"Staying hydrated is just as important as eating well!",
	"Remember to include fruits and vegetables in your meals today.",
	"Eating regularly helps maintain your energy and focus.",
	"Listen to your body's hunger cues - eat when you're hungry, stop when you're full.",
	"Small, balanced meals throughout the day can help maintain steady energy levels.",
	"Don't forget to enjoy your food - satisfaction is an important part of nutrition!",
	"Eating a variety of foods ensures you get all the nutrients you need.",
	"Great job tracking your meals! Consistency is key to healthy habits.",
}

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectDB()
	initializers.SyncDatabase()
}

func main() {
	// Check if DB is nil (database connection failed)
	if initializers.DB == nil {
		log.Fatal("Database connection not available")
		return
	}

	// Get all users to create messages for
	var users []models.User
	result := initializers.DB.Find(&users)

	if result.Error != nil {
		log.Fatal("Error fetching users:", result.Error)
		return
	}

	if len(users) == 0 {
		log.Println("No users found. Please create users first.")
		return
	}

	// For each user, create sample messages
	for _, user := range users {
		// Create breakfast messages
		for i, msg := range breakfastMessages {
			message := models.MotivationalMessage{
				Message:      msg,
				MessageType:  "breakfast",
				UserID:       user.ID,
				IsRead:       false,
				ScheduledFor: "08:00", // Scheduled for 8 AM
			}
			
			result := initializers.DB.Create(&message)
			if result.Error != nil {
				log.Printf("Error creating breakfast message %d for user %s: %v", i, user.Username, result.Error)
			}
		}

		// Create lunch messages
		for i, msg := range lunchMessages {
			message := models.MotivationalMessage{
				Message:      msg,
				MessageType:  "lunch",
				UserID:       user.ID,
				IsRead:       false,
				ScheduledFor: "12:30", // Scheduled for 12:30 PM
			}
			
			result := initializers.DB.Create(&message)
			if result.Error != nil {
				log.Printf("Error creating lunch message %d for user %s: %v", i, user.Username, result.Error)
			}
		}

		// Create dinner messages
		for i, msg := range dinnerMessages {
			message := models.MotivationalMessage{
				Message:      msg,
				MessageType:  "dinner",
				UserID:       user.ID,
				IsRead:       false,
				ScheduledFor: "18:30", // Scheduled for 6:30 PM
			}
			
			result := initializers.DB.Create(&message)
			if result.Error != nil {
				log.Printf("Error creating dinner message %d for user %s: %v", i, user.Username, result.Error)
			}
		}

		// Create general messages
		for i, msg := range generalMessages {
			message := models.MotivationalMessage{
				Message:      msg,
				MessageType:  "general",
				UserID:       user.ID,
				IsRead:       false,
				ScheduledFor: "", // No specific time for general messages
			}
			
			result := initializers.DB.Create(&message)
			if result.Error != nil {
				log.Printf("Error creating general message %d for user %s: %v", i, user.Username, result.Error)
			}
		}
	}

	fmt.Println("Successfully seeded motivational messages for all users!")
}

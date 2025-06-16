package initializers

import (
	"BAZ/Nutritracker/models"
	"log"
)

func SyncDatabase() {
	// Skip database synchronization if DB is nil
	// This happens when the database connection failed
	if DB != nil && DB.Config != nil {
		log.Println("Syncing database schema...")
		DB.AutoMigrate(&models.User{})
		DB.AutoMigrate(&models.Nutrilog{})
		DB.AutoMigrate(&models.NutritionGoal{})
	} else {
		log.Println("Skipping database synchronization due to missing connection.")
	}
}

package initializers

import (
	"BAZ/Nutritracker/models"
)

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})


}
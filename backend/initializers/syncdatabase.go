package initializers

import (
	"BAZ/Nutritracker/models"
)

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.Nutrilog{})

}
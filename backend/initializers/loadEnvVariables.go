package initializers

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Error loading .env file. Using default environment variables.")
		// Set default environment variables
		if os.Getenv("JWT_SECRET") == "" {
			os.Setenv("JWT_SECRET", "default_jwt_secret_key")
		}
	}
}

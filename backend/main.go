package main

import (
	
	"BAZ/Nutritracker/routes"
	"BAZ/Nutritracker/initializers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

)


func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectDB()
	initializers.SyncDatabase()
}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5000", "http://localhost:19006"},
		AllowMethods:     []string{"GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "X-Requested-With", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))


	v1 := router.Group("/api/v1")
	{
		routes.Routes(v1.Group("/user"))
		// routes.AdminRoutes(v1.Group("/admin"))
	}


	router.Run()
}

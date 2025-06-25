package main

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/routes"
	"fmt"
	"time"

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
	router.Use(func(c *gin.Context) {
		fmt.Println("Origin:", c.Request.Header.Get("Origin"))
		c.Next()
	})

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:19006"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "X-Requested-With", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})
	v1 := router.Group("/api/v1")
	{
		routes.Routes(v1.Group("/user"))
		// routes.AdminRoutes(v1.Group("/admin"))
	}

	router.Run()
}

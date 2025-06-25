package routes

import (
	controllers "BAZ/Nutritracker/controllers"
	middleware "BAZ/Nutritracker/middleware"

	"github.com/gin-gonic/gin"
)

func Routes(router *gin.RouterGroup) {

	// router.GET("/test",  func(ctx *gin.Context) {
	// 	ctx.JSON(200, gin.H{
	// 		"message": "Hello World",
	// 	})
	// })

	// auth routes (no auth required)
	router.POST("/login", controllers.UserLogin)
	router.POST("/register", controllers.UserRegister)

	// protected routes (require auth)
	auth := router.Group("/")
	auth.Use(middleware.RequireAuth)
	{
		// user routes
		auth.PUT("/update", controllers.UpdateUser)
		auth.DELETE("/delete", controllers.DeleteUser)
		auth.GET("/get/:email", controllers.GetUser)

		// nutrilog routes
		auth.POST("/createnutrilog", controllers.CreateNutrilog)
		auth.GET("/getnutrilog/:id", controllers.GetNutrilogById)
		auth.GET("/getallnutrilogs", controllers.GetNutrilogs)
		auth.PUT("/updatenutrilog/:id", controllers.UpdateNutrilogById)
		auth.DELETE("/deletenutrilog/:id", controllers.DeleteNutrilogById)
	}
}

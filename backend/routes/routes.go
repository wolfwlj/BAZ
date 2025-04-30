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

	// auth routes
	router.POST("/login", controllers.UserLogin)
	router.POST("/register", controllers.UserRegister)
	router.PUT("/update", controllers.UpdateUser)
	router.DELETE("/delete", controllers.DeleteUser)
	router.GET("/get/:email", controllers.GetUser)

	// nutrilog routes
	router.POST("/createnutrilog", middleware.RequireAuth, controllers.CreateNutrilog)
	router.GET("/getnutrilog/:id", middleware.RequireAuth, controllers.GetNutrilogById)
	router.GET("/getallnutrilogs", middleware.RequireAuth, controllers.GetNutrilogs)
	router.PUT("/updatenutrilog/:id", middleware.RequireAuth, controllers.UpdateNutrilogById)
	router.DELETE("/deletenutrilog/:id", middleware.RequireAuth, controllers.DeleteNutrilogById)
}

package routes

import (
	controllers "BAZ/Nutritracker/controllers"

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
	router.POST("/createnutrilog", controllers.CreateNutrilog)
	router.GET("/getnutrilog/:id", controllers.GetNutrilogById)
	router.GET("/getallnutrilogs", controllers.GetNutrilogs)
	router.PUT("/updatenutrilog/:id", controllers.UpdateNutrilogById)
	router.DELETE("/deletenutrilog/:id", controllers.DeleteNutrilogById)
	router.GET("/getnutrilogs/:user_id", controllers.GetNutrilogsByUserAndDate)

	// nutrition goal routes
	router.POST("/createnutritiongoal", controllers.CreateNutritionGoal)
	router.GET("/getnutritiongoal/:user_id", controllers.GetActiveNutritionGoal)
	router.PUT("/updatenutritiongoal/:id", controllers.UpdateNutritionGoal)
	router.POST("/checkgoalprogress/:user_id", controllers.CheckAndUpdateGoalProgress)
}

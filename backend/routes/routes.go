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

	//router.GET("/helloworld/:num", controllers.HelloWorld)
	router.POST("/register", controllers.UserRegister)
	router.PUT("/update", controllers.UpdateUser)
	router.DELETE("/delete", controllers.DeleteUser)
	router.GET("/get/:email", controllers.GetUser)

}

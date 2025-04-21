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

	router.GET("/helloworld/:num", controllers.HelloWorld)




}
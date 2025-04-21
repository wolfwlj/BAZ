package controllers



import (
	"github.com/gin-gonic/gin"
	"strconv"
)


// HelloWorld is a test controller that returns a simple JSON response.

func HelloWorld(c *gin.Context) {

	num := c.Param("num")

	numnum, error := strconv.Atoi(num)

	if error != nil {
		c.JSON(400, gin.H{
			"error": "Invalid number",
		})
		return
	}

	calc := numnum * 2

	c.JSON(200, gin.H{
		"message": calc,
	})
}

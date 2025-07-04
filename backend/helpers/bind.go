package helpers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func BindRequest(c *gin.Context, body interface{}) error {
	if err := c.Bind(body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to bind request body",
		})
		return err
	}
	return nil
}

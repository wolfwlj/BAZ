package middleware

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func RequireAuth(c *gin.Context) {
	// Get the token from the request header
	tokenString := ""
	temptoken1, err := c.Cookie("usertoken")
	temptoken2 := c.Request.Header.Get("Authorization")

	if err != nil && temptoken2 == "" {
		if err == http.ErrNoCookie {

			c.AbortWithStatus(400)
			return
		}
		c.AbortWithStatus(http.StatusForbidden)

		return
	}

	if temptoken1 != "" {
		tokenString = temptoken1
	} else if temptoken2 != "" {
		tokenString = temptoken2
	}

	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check if the signing method is HMAC
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
		}
		return []byte(os.Getenv("SECRET")), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		//check if exp
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		//find user
		var user models.User
		// initializers.DB.First(&user, claims["sub"])
		initializers.DB.First(&user, claims["sub"])

		if user.ID == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		//attach to req
		c.Set("user", user)

		//move on
		c.Next()
	} else {
		fmt.Println(err)

		c.AbortWithStatus(http.StatusUnauthorized)
	}
}

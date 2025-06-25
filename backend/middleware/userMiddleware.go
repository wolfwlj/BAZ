package middleware

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func RequireAuth(c *gin.Context) {
	// Get the token from the request header or cookie
	tokenString := ""

	// Try to get token from Authorization header
	authHeader := c.Request.Header.Get("Authorization")
	if authHeader != "" {
		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) == 2 && parts[0] == "Bearer" {
			tokenString = parts[1]
		}
	}

	// If no token in header, try cookie
	if tokenString == "" {
		if cookie, err := c.Cookie("usertoken"); err == nil {
			tokenString = cookie
		}
	}

	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Authentication required",
		})
		c.Abort()
		return
	}

	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token",
		})
		c.Abort()
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check if token is expired
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Token expired",
			})
			c.Abort()
			return
		}

		// Find user
		var user models.User
		if err := initializers.DB.First(&user, claims["sub"]).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "User not found",
			})
			c.Abort()
			return
		}

		// Attach user to context
		c.Set("user", user)
		c.Next()
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token claims",
		})
		c.Abort()
		return
	}
}

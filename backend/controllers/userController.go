package controllers

import (
	"BAZ/Nutritracker/helpers"
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

func UserLogin(c *gin.Context) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := helpers.BindRequest(c, &body); err != nil {
		return
	}

	//check if user exists in database
	user, err := checkUserExists(body.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
		return
	}
	//check if password is correct
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "verkeerd wachtwoord of gebruikersnaam",
		})
		return
	}

	//jwt token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30 * 12).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to sign token",
		})
		return
	}

	//Send a response with the user data
	c.SetSameSite(http.SameSiteNoneMode)

	//secure flag moet true staan voor production, false zodat je het kan testen in postman
	c.SetCookie("usertoken", tokenString, 36002430, "", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user":    user,
		"token":   tokenString,
	})
}

func UpdateUser(c *gin.Context) {
	var body struct {
		Email       string `json:"email"`
		Username    string `json:"username"`
		Password    string `json:"password"`
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		PhoneNumber string `json:"phone_number"`
	}

	if err := helpers.BindRequest(c, &body); err != nil {
		return
	}

	// if checkUserExists(body.Email) {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"error": "user already exists",
	// 	})
	// 	return
	//}

	var user models.User
	result := initializers.DB.Where("email = ?", body.Email).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
		return
	}
	user.Username = body.Username
	if body.Password != "" {
		hashedPassword, err := hashPassword(body.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "failed to hash password",
			})
			return
		}
		user.Password = hashedPassword
	}
	user.FirstName = body.FirstName
	user.LastName = body.LastName
	user.PhoneNumber = body.PhoneNumber

	if err := initializers.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update user in database",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "User updated successfully",
		"user":    user,
	})
}

func DeleteUser(c *gin.Context) {
	var body struct {
		Email string `json:"email"`
	}

	if err := helpers.BindRequest(c, &body); err != nil {
		return
	}

	var user models.User
	result := initializers.DB.Where("email = ?", body.Email).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
		return
	}

	if err := initializers.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete user from database",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}

func GetUser(c *gin.Context) {

	email := c.Param("email")
	var user models.User
	result := initializers.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user not found",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func UserRegister(c *gin.Context) {

	var body struct {
		Username    string
		Email       string
		Password    string
		FirstName   string
		LastName    string
		PhoneNumber string
	}

	if err := helpers.BindRequest(c, &body); err != nil {
		return
	}
	user, err := checkUserExists(body.Email)

	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user already exists",
		})
		return
	}

	if user.Email != "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user already exists",
		})
		return
	}
	hashedPassword, err := hashPassword(body.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to hash password",
		})
		return
	}

	user = models.User{
		Username:    body.Username,
		Email:       body.Email,
		Password:    hashedPassword,
		FirstName:   body.FirstName,
		LastName:    body.LastName,
		PhoneNumber: body.PhoneNumber,
	}

	if err := initializers.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to save user to database",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User registered successfully",
		"user":    user,
	})

	// c.JSON(200, gin.H{
	// 	"message": "User registered successfully",
	// 	"user":    user,
	// })

	//collect user input DONE
	//validate user input
	//check if use already exists
	//hash password
	//create user
	//save user to database
}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return (string(hashedPassword)), nil
}
func checkUserExists(email string) (models.User, error) {
	//check if user exists in database
	var user models.User
	result := initializers.DB.Where("email = ?", email).First(&user)

	fmt.Println("result", result)
	fmt.Println("user", user)

	if result.Error != nil {
		return models.User{}, errors.New("user not found")
	}
	return user, nil
}

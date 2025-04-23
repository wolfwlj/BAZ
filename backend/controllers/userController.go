package controllers

import (
	"BAZ/Nutritracker/initializers"
	"BAZ/Nutritracker/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func UserLogin() {
	var username string
	fmt.Scan(&username)
	var password string
	fmt.Scan(&password)

	//check if user exists in database
	if checkUserExists(username) {
		//check if password is correct
		if checkPasswordHash(password, username) {
			fmt.Println("Login successful")
		} else {
			fmt.Println("Invalid password")
		}
	} else {
		fmt.Println("User does not exist")
	}
}

func bindRequest(c *gin.Context, body interface{}) error {
	if err := c.Bind(body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to bind request body",
		})
		return err
	}
	return nil
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

	if err := bindRequest(c, &body); err != nil {
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

	if err := bindRequest(c, &body); err != nil {
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
		FirstName   string `gorm:"type:text"`
		LastName    string `gorm:"type:text"`
		PhoneNumber string
	}

	if err := bindRequest(c, &body); err != nil {
		return
	}

	if checkUserExists(body.Email) {
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

	user := models.User{
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
func checkUserExists(email string) bool {
	//check if user exists in database
	var user models.User
	result := initializers.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return false
	}
	return true
}

func checkPasswordHash(password, username string) bool {
	//check if password is correct
	unhashedPassword := "password" //get password from database
	err := bcrypt.CompareHashAndPassword([]byte(unhashedPassword), []byte(password))
	if err != nil {
		return false
	}
	return true
}

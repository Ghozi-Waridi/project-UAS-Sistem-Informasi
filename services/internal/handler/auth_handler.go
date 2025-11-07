package handler

import (
	"net/http"
	"services/internal/models"
	"services/internal/service"

	"github.com/gin-gonic/gin"
)

type AuthHandler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
}

type authHandler struct {
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) AuthHandler {
	return &authHandler{authService: authService}
}

func (h *authHandler) Register(c *gin.Context) {
	var input models.RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := h.authService.Register(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully", "user_id": user.UserID})

}

func (h *authHandler) Login(c *gin.Context) {
	var input models.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}
	response, err := h.authService.Login(input)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

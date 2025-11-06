package handler

import (
	"net/http"
	"services/internal/service"

	"github.com/gin-gonic/gin"
)

type Userhandler interface {
	GetUserProfile(c *gin.Context)
}

type userHandler struct {
	userService service.UserService
}

func NewUserHandler(userService service.UserService) Userhandler {
	return &userHandler{userService: userService}
}

func (h *userHandler) GetUserProfile(c *gin.Context) {
	idStr := c.Param("id")

	user, err := h.userService.GetUserByID(idStr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"Error": "User Not Found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

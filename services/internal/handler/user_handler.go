package handler

import (
	"net/http"
	"services/internal/service"
	"strconv"

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

	id64, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "Invalid user ID format"})
		return
	}
	id := uint(id64)

	user, err := h.userService.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"Error": "User Not Found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

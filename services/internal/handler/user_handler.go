package handler

import (
	"net/http"
	"services/internal/models"
	"services/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Userhandler interface {
	GetUserProfile(c *gin.Context)
	CreateDM(c *gin.Context)
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

func (h *userHandler) CreateDM(c *gin.Context) {
	var input models.CreateDMInput

	// 1. Bind JSON body ke DTO
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 2. Ambil data Admin dari context (diisi oleh middleware)
	// (Asumsi helper 'extractUserData' ada di file ini)
	_, adminCompanyID, adminRole, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	// 3. Otorisasi: Hanya Admin yang boleh membuat user
	if adminRole != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can create users"})
		return
	}

	// 4. Panggil Service
	userDTO, err := h.userService.CreateDM(input, adminCompanyID)
	if err != nil {
		if err.Error() == "email already exists" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()}) // 409 Conflict
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 5. Sukses
	c.JSON(http.StatusCreated, userDTO)
}

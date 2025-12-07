package handler

import (
	"net/http"
	"services/internal/models"
	"services/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AlternativeHandler interface {
	CreateAlternative(c *gin.Context)
	GetAlternativeByProject(c *gin.Context)
	UpdateAlternative(c *gin.Context)
	DeleteAlternative(c *gin.Context)
}

type alternativeHandler struct {
	alternativeService service.AlternativeService
}

func NewAlternativeHandler(alternativeService service.AlternativeService) AlternativeHandler {
	return &alternativeHandler{
		alternativeService: alternativeService,
	}
}

func (h *alternativeHandler) CreateAlternative(c *gin.Context) {
	var input models.CreateAlternativeInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectIDStr := c.Param("projectID")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errpr": "Invalid project ID Format"})
		return
	}
	companyID, _ := c.Get("companyID")
	role, _ := c.Get("role")

	alternativeDTO, err := h.alternativeService.CreateAlternative(
		input,
		uint(projectID),
		companyID.(uint),
		role.(string),
	)
	if err != nil {
		if err.Error() == "only admin can add alternative" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "project not found or user does not have access" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, alternativeDTO)
}

func (h *alternativeHandler) GetAlternativeByProject(c *gin.Context) {
	projectIDStr := c.Param("projectID")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID format"})
		return
	}
	companyID, _ := c.Get("companyID")
	userID, _ := c.Get("userID")
	role, _ := c.Get("role")

	alternativeDTOs, err := h.alternativeService.GetAlternativeByProject(
		uint(projectID),
		companyID.(uint),
		userID.(uint),
		role.(string),
	)
	if err != nil {
		if err.Error() == "project not found or user does not have access" || err.Error() == "Project no found or user does not have access" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, alternativeDTOs)
}

func (h *alternativeHandler) UpdateAlternative(c *gin.Context) {
	projectIDStr := c.Param("projectID")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID format"})
		return
	}

	alternativeIDStr := c.Param("alternativeID")
	alternativeID, err := strconv.Atoi(alternativeIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid alternative ID"})
		return
	}

	var input models.UpdateAlternativeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	companyID, _ := c.Get("companyID")
	role, _ := c.Get("role")

	alternativeDTO, err := h.alternativeService.UpdateAlternative(
		uint(alternativeID),
		input,
		uint(projectID),
		companyID.(uint),
		role.(string),
	)

	if err != nil {
		if err.Error() == "only admin can update alternative" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "project not found or user does not have access" || err.Error() == "alternative does not belong to this project" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, alternativeDTO)
}

func (h *alternativeHandler) DeleteAlternative(c *gin.Context) {
	projectIDStr := c.Param("projectID")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID format"})
		return
	}

	alternativeIDStr := c.Param("alternativeID")
	alternativeID, err := strconv.Atoi(alternativeIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid alternative ID"})
		return
	}

	companyID, _ := c.Get("companyID")
	role, _ := c.Get("role")

	err = h.alternativeService.DeleteAlternative(
		uint(alternativeID),
		uint(projectID),
		companyID.(uint),
		role.(string),
	)

	if err != nil {
		if err.Error() == "only admin can delete alternative" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "project not found or user does not have access" || err.Error() == "alternative does not belong to this project" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Alternative deleted successfully"})
}

package handler

import (
	"net/http"
	"services/internal/models"
	"services/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CriteriaHandler interface {
	CreateCriteria(c *gin.Context)
	GetCriteriaByProject(c *gin.Context)
	UpdateCriteria(c *gin.Context)
	DeleteCriteria(c *gin.Context)
}
type criteriaHandler struct {
	criteriaService service.CriteriaService
}

func NewCriteriaHandler(criteriaService service.CriteriaService) CriteriaHandler {
	return &criteriaHandler{
		criteriaService: criteriaService,
	}
}

func (h *criteriaHandler) CreateCriteria(c *gin.Context) {
	var input models.CreateCriteriaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}
	// userID, _ := c.Get("userID")
	companyID, _ := c.Get("companyID")
	role, _ := c.Get("role")

	criteriaDTO, err := h.criteriaService.CreateCriteria(
		input,
		projectID,
		companyID.(uint),
		role.(string),
	)

	if err != nil {

		if err.Error() == "only admins can add criteria" {
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

	c.JSON(http.StatusCreated, criteriaDTO)
}

func (h *criteriaHandler) GetCriteriaByProject(c *gin.Context) {

	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}

	companyID, _ := c.Get("companyID")

	criteriaTree, err := h.criteriaService.GetCriteriaByProject(projectID, companyID.(uint))
	if err != nil {
		if err.Error() == "project not found or user does not have access" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, criteriaTree)
}

func (h *criteriaHandler) UpdateCriteria(c *gin.Context) {
	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}
	criteriaIDStr := c.Param("criteriaID")
	criteriaID, err := strconv.Atoi(criteriaIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid criteria ID"})
		return
	}

	var input models.UpdateCriteriaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	companyID, _ := c.Get("companyID")
	role, _ := c.Get("role")

	criteriaDTO, err := h.criteriaService.UpdateCriteria(
		uint(criteriaID),
		input,
		projectID,
		companyID.(uint),
		role.(string),
	)

	if err != nil {
		if err.Error() == "only admins can update criteria" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "project not found or user does not have access" || err.Error() == "criteria does not belong to this project" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, criteriaDTO)
}

func (h *criteriaHandler) DeleteCriteria(c *gin.Context) {
	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}
	criteriaIDStr := c.Param("criteriaID")
	criteriaID, err := strconv.Atoi(criteriaIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid criteria ID"})
		return
	}

	companyID, _ := c.Get("companyID")
	role, _ := c.Get("role")

	err = h.criteriaService.DeleteCriteria(
		uint(criteriaID),
		projectID,
		companyID.(uint),
		role.(string),
	)

	if err != nil {
		if err.Error() == "only admins can delete criteria" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "project not found or user does not have access" || err.Error() == "criteria does not belong to this project" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Criteria deleted successfully"})
}

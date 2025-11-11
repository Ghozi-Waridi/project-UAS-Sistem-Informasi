package handler

import (
	"errors"
	"net/http"
	"services/internal/models"
	"services/internal/service"

	"strconv"

	"github.com/gin-gonic/gin"
)

type ProjectHandler interface {
	CreateProject(c *gin.Context)
	GetProjectByID(c *gin.Context)
	GetProjectsByCompany(c *gin.Context)
}

type projectHandler struct {
	projectService service.ProjectService
}

func NewProjectHandler(projectService service.ProjectService) ProjectHandler {
	return &projectHandler{
		projectService: projectService,
	}
}

func extractUserData(c *gin.Context) (uint, uint, string, error) {
	userID, ok := c.Get("userID")
	if !ok {
		return 0, 0, "", errors.New("userID not found in context")
	}

	companyID, ok := c.Get("companyID")
	if !ok {
		return 0, 0, "", errors.New("companyID not found in context")
	}

	role, ok := c.Get("role")
	if !ok {
		return 0, 0, "", errors.New("role not found in context")
	}

	return userID.(uint), companyID.(uint), role.(string), nil
}

func (h *projectHandler) CreateProject(c *gin.Context) {
	var input models.CreateProjectInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, companyID, role, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can create projects"})
		return
	}

	projectDTO, err := h.projectService.CreateProject(input, userID, companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, projectDTO)
}

func (h *projectHandler) GetProjectByID(c *gin.Context) {

	projectIDStr := c.Param("id")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID format"})
		return
	}

	_, companyID, _, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	projectDTO, err := h.projectService.GetProjectByID(uint(projectID), companyID)
	if err != nil {

		if err.Error() == "record not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found or you do not have permission"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, projectDTO)
}

func (h *projectHandler) GetProjectsByCompany(c *gin.Context) {

	_, companyID, _, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	projectDTOs, err := h.projectService.GetProjectsByCompany(companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, projectDTOs)
}

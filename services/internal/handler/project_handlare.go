package handler

import (
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
	UpdateProject(c *gin.Context)
	DeleteProject(c *gin.Context)
	GetAssignedProjects(c *gin.Context)
}

type projectHandler struct {
	projectService service.ProjectService
}

func NewProjectHandler(projectService service.ProjectService) ProjectHandler {
	return &projectHandler{
		projectService: projectService,
	}
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

	projectIDStr := c.Param("projectID")
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

func (h *projectHandler) UpdateProject(c *gin.Context) {
	projectIDStr := c.Param("projectID")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID format"})
		return
	}

	var input models.UpdateProjectInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, companyID, role, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can update projects"})
		return
	}

	projectDTO, err := h.projectService.UpdateProject(uint(projectID), input, companyID)
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

func (h *projectHandler) DeleteProject(c *gin.Context) {
	projectIDStr := c.Param("projectID")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID format"})
		return
	}

	_, companyID, role, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can delete projects"})
		return
	}

	err = h.projectService.DeleteProject(uint(projectID), companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

func (h *projectHandler) GetAssignedProjects(c *gin.Context) {
	userID, _, role, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	if role != "dm" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only Decision Makers can view assigned projects"})
		return
	}

	projectDTOs, err := h.projectService.GetAssignedProjects(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, projectDTOs)
}

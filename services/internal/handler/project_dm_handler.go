package handler

import (
	"net/http"
	"services/internal/models"
	"services/internal/service"

	"github.com/gin-gonic/gin"
)

type ProjectDMHandler interface {
	AssignDM(c *gin.Context)
	GetAssignmentsByProject(c *gin.Context)
	RemoveAssignment(c *gin.Context)
	UpdateAssignment(c *gin.Context)
}

type projectDMHandler struct {
	projectDMService service.ProjectDMService
}

func NewProjectDMHandler(projectDMService service.ProjectDMService) ProjectDMHandler {
	return &projectDMHandler{
		projectDMService: projectDMService,
	}
}

func (h *projectDMHandler) AssignDM(c *gin.Context) {
	var input models.AssignDMInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}

	_, adminCompanyID, adminRole, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	assignmentDTO, err := h.projectDMService.AssignDM(
		input,
		projectID,
		adminCompanyID,
		adminRole,
	)

	if err != nil {

		errMsg := err.Error()
		switch errMsg {
		case "only admins can assign decision makers":
			c.JSON(http.StatusForbidden, gin.H{"error": errMsg})
		case "project not found or admin does not have access":
			c.JSON(http.StatusNotFound, gin.H{"error": errMsg})
		case "decision maker user not found":
			c.JSON(http.StatusNotFound, gin.H{"error": errMsg})
		case "target user is not a decision maker (dm)":
			c.JSON(http.StatusBadRequest, gin.H{"error": errMsg})
		case "decision maker does not belong to this company":
			c.JSON(http.StatusBadRequest, gin.H{"error": errMsg})
		case "this decision maker is already assigned to this project":
			c.JSON(http.StatusConflict, gin.H{"error": errMsg}) // 409 Conflict
		default:

			c.JSON(http.StatusInternalServerError, gin.H{"error": errMsg})
		}
		return
	}

	c.JSON(http.StatusCreated, assignmentDTO)
}

func (h *projectDMHandler) GetAssignmentsByProject(c *gin.Context) {

	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}

	_, companyID, _, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	assignmentDTOs, err := h.projectDMService.GetAssignmentsByProject(projectID, companyID)
	if err != nil {
		if err.Error() == "project not found or user does not have access" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, assignmentDTOs)
}

func (h *projectDMHandler) RemoveAssignment(c *gin.Context) {
	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}

	dmUserID, err := getIDFromParam(c, "dmUserID")
	if err != nil {
		return
	}

	_, adminCompanyID, adminRole, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	err = h.projectDMService.RemoveAssignment(projectID, uint(dmUserID), adminCompanyID, adminRole)
	if err != nil {
		errMsg := err.Error()
		switch errMsg {
		case "only admins can remove decision makers":
			c.JSON(http.StatusForbidden, gin.H{"error": errMsg})
		case "project not found or admin does not have access":
			c.JSON(http.StatusNotFound, gin.H{"error": errMsg})
		case "assignment not found":
			c.JSON(http.StatusNotFound, gin.H{"error": errMsg})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": errMsg})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Decision maker removed from project"})
}

func (h *projectDMHandler) UpdateAssignment(c *gin.Context) {
	var input models.UpdateProjectDMInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectDMID, err := getIDFromParam(c, "projectDMID")
	if err != nil {
		return
	}

	_, adminCompanyID, adminRole, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	assignmentDTO, err := h.projectDMService.UpdateAssignment(uint(projectDMID), input, adminCompanyID, adminRole)
	if err != nil {
		errMsg := err.Error()
		switch errMsg {
		case "only admins can update decision maker assignments":
			c.JSON(http.StatusForbidden, gin.H{"error": errMsg})
		case "assignment not found":
			c.JSON(http.StatusNotFound, gin.H{"error": errMsg})
		case "project not found or admin does not have access":
			c.JSON(http.StatusNotFound, gin.H{"error": errMsg})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": errMsg})
		}
		return
	}

	c.JSON(http.StatusOK, assignmentDTO)
}

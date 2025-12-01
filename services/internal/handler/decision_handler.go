package handler

import (
	"net/http"
	"services/internal/service"

	"github.com/gin-gonic/gin"
)

type DecisionHandler interface {
	TriggerCalculation(c *gin.Context)
	GetResults(c *gin.Context)
}

type decisionHandler struct {
	decisonService service.DecisionService
}

func NewDecisionHandler(decisionService service.DecisionService) DecisionHandler {
	return &decisionHandler{decisonService: decisionService}
}

func (calc *decisionHandler) TriggerCalculation(c *gin.Context) {
	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}

	_, companyID, role, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}
	err = calc.decisonService.CalculateResults(projectID, companyID, role)
	if err != nil {
		if err.Error() == "only admins can trigger calculation" {
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
	c.JSON(http.StatusOK, gin.H{"message": "Calculation completed successfully"})
}

func (h *decisionHandler) GetResults(c *gin.Context) {
	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}
	_, companyID, _, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	results, err := h.decisonService.GetResults(projectID, companyID)
	if err != nil {
		if err.Error() == "project not found or user does not have access" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}

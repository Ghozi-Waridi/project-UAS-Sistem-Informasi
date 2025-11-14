package handler

import (
	"net/http"
	"services/internal/models"
	"services/internal/service"

	"github.com/gin-gonic/gin"
)

type InputHandlerPairwise interface {
	SubmitPairwise(c *gin.Context)
	GetPairwiseSubmissions(c *gin.Context)
}

type inputHandlerPairwise struct {
	pairwiseService service.InputPairwiseService
}

func NewInputHandlerPairwise(pairwiseService service.InputPairwiseService) InputHandlerPairwise {
	return &inputHandlerPairwise{pairwiseService: pairwiseService}
}

func (h *inputHandlerPairwise) SubmitPairwise(c *gin.Context) {
	var input models.SumbitPairwiseInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}

	dmUserID, _, _, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}
	err = h.pairwiseService.SubmitPairwise(input, projectID, dmUserID)
	if err != nil {
		if err.Error() == "user is not an assigned decission maker for this project" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Pairwise comparisons submitted successfully"})
}

func (h *inputHandlerPairwise) GetPairwiseSubmissions(c *gin.Context) {

	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}

	dmUserID, _, _, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	comparisons, err := h.pairwiseService.GetPairwiseSubmissions(projectID, dmUserID)
	if err != nil {
		if err.Error() == "user is not an assigned decision maker for this project" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comparisons)
}

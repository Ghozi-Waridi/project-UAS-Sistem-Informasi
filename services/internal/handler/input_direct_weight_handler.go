package handler

import (
	"net/http"
	"services/internal/models"
	"services/internal/service"

	"github.com/gin-gonic/gin"
)

type InputDirectWeightHandler interface {
	SubmitDirectWeights(c *gin.Context)
	GetDirectWeights(c *gin.Context)
}

type inputDirectWeightHandler struct {
	directWeightService service.InputDirectWeightService
}

func NewInputDirectWeightHandler(directWeightService service.InputDirectWeightService) InputDirectWeightHandler {
	return &inputDirectWeightHandler{
		directWeightService: directWeightService,
	}
}

func (h *inputDirectWeightHandler) SubmitDirectWeights(c *gin.Context) {
	var input models.SubmitDirectWeightsInput

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

	err = h.directWeightService.SubmitDirectWeights(input, projectID, dmUserID)
	if err != nil {

		if err.Error() == "user is not an assigned decision maker for this project" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Direct weights submitted successfully"})
}

func (h *inputDirectWeightHandler) GetDirectWeights(c *gin.Context) {

	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}

	dmUserID, _, _, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	weights, err := h.directWeightService.GetDirectWeights(projectID, dmUserID)
	if err != nil {
		if err.Error() == "user is not an assigned decision maker for this project" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, weights)
}

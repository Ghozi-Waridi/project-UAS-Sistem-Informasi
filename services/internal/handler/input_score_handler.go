package handler

import (
	"net/http"
	"services/internal/models"
	"services/internal/service"

	"github.com/gin-gonic/gin"
)

type InputScoreHandler interface {
	SubmitScores(c *gin.Context)
	SubmitScore(c *gin.Context)
	GetScores(c *gin.Context)
}

type inputScoreHandler struct {
	scoreService service.InputScoreService
}

func NewInputScoreHandler(scoreService service.InputScoreService) InputScoreHandler {
	return &inputScoreHandler{scoreService: scoreService}
}

func (h *inputScoreHandler) SubmitScores(c *gin.Context) {
	var input models.SubmitScoreInput

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

	err = h.scoreService.SubmitScores(input, projectID, dmUserID)
	if err != nil {
		if err.Error() == "user is not an assigned decision maker for this project" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Scores submitted successfully"})
}

func (h *inputScoreHandler) SubmitScore(c *gin.Context) {
	var input models.ScoreInputItem

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

	err = h.scoreService.SubmitScore(input, projectID, dmUserID)
	if err != nil {
		if err.Error() == "user is not an assigned decision maker for this project" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Score submitted successfully"})
}

func (h *inputScoreHandler) GetScores(c *gin.Context) {
	projectID, err := getProjectIDFromParam(c)
	if err != nil {
		return
	}

	dmUserID, _, _, err := extractUserData(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process user data"})
		return
	}

	scores, err := h.scoreService.GetScores(projectID, dmUserID)
	if err != nil {
		if err.Error() == "user is not an assigned decision maker for this project" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, scores)
}

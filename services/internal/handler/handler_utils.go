package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func extractUserData(c *gin.Context) (uint, uint, string, error) {
	userID, ok := c.Get("userID")
	if !ok {
		return 0, 0, "", errors.New("userID not found in context")
	}
	companyID, ok := c.Get("companyID")
	if !ok {
		return 0, 0, "", errors.New("acompanyID not found in context")
	}
	role, ok := c.Get("role")
	if !ok {
		return 0, 0, "", errors.New("role not found in context")
	}
	return userID.(uint), companyID.(uint), role.(string), nil
}

func getProjectIDFromParam(c *gin.Context) (uint, error) {
	projectIDStr := c.Param("projectID")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID format"})
		return 0, err
	}
	return uint(projectID), nil
}

func getIDFromParam(c *gin.Context, paramName string) (uint, error) {
	idStr := c.Param(paramName)
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format for " + paramName})
		return 0, err
	}
	return uint(id), nil
}

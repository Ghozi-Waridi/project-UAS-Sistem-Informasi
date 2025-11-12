package routes

import (
	"services/internal/handler"
	"services/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(r *gin.Engine, authHandler handler.AuthHandler) {
	api := r.Group("/api/v1")
	{
		authGroup := api.Group("/auth")
		{
			authGroup.POST("/register", authHandler.Register)
			authGroup.POST("/login", authHandler.Login)
		}
	}
}

func SetupUserRoutes(r *gin.Engine, userHandler handler.Userhandler) {
	api := r.Group("/api/v1")
	{
		userGroup := api.Group("/users", middleware.AuthMiddleware())
		{
			userGroup.GET("/:id", userHandler.GetUserProfile)
		}
	}
}

func SetupProjectRoutes(r *gin.Engine, projectHandler handler.ProjectHandler) {

	api := r.Group("/api/v1")
	{
		projectGroup := api.Group("/projects", middleware.AuthMiddleware())
		{
			projectGroup.POST("/", projectHandler.CreateProject)
			projectGroup.GET("/", projectHandler.GetProjectsByCompany)
			projectGroup.GET("/:projectID", projectHandler.GetProjectByID)
		}
	}
}

func SetupCriteriaRoutes(r *gin.Engine, criteriaHandler handler.CriteriaHandler) {
	api := r.Group("/api/v1")
	{
		projectGroup := api.Group("/projects/:projectID", middleware.AuthMiddleware())
		{
			projectGroup.POST("/criteria", criteriaHandler.CreateCriteria)
			projectGroup.GET("/criteria", criteriaHandler.GetCriteriaByProject)
		}
	}
}

func SetupAlternativeRoutes(r *gin.Engine, alternativeHandler handler.AlternativeHandler) {
	api := r.Group("/api/v1")
	{
		projectGroup := api.Group("/projects/:projectID", middleware.AuthMiddleware())
		{
			projectGroup.POST("/alternatives", alternativeHandler.CreateAlternative)
			projectGroup.GET("/alternatives", alternativeHandler.GetAlternativeByProject)
		}
	}
}

func SetupProjectDMRoutes(r *gin.Engine, projectDMHandler handler.ProjectDMHandler) {
	// Grup /api/v1 (sudah ada)
	api := r.Group("/api/v1")
	{
		// Grup /projects/:projectID (sudah ada & sudah diproteksi middleware)
		projectGroup := api.Group("/projects/:projectID", middleware.AuthMiddleware())
		{
			// POST /api/v1/projects/:projectID/assign-dm
			projectGroup.POST("/assign-dm", projectDMHandler.AssignDM)

			// GET /api/v1/projects/:projectID/decision-makers
			projectGroup.GET("/decision-makers", projectDMHandler.GetAssignmentsByProject)
		}
	}
}

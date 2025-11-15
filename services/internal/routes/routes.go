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
			userGroup.POST("/", userHandler.CreateDM)
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

	api := r.Group("/api/v1")
	{

		projectGroup := api.Group("/projects/:projectID", middleware.AuthMiddleware())
		{

			projectGroup.POST("/assign-dm", projectDMHandler.AssignDM)

			projectGroup.GET("/decision-makers", projectDMHandler.GetAssignmentsByProject)
		}
	}
}

func SetupInputPairwiseRoutes(r *gin.Engine, pairwiseHandler handler.InputHandlerPairwise) {
	api := r.Group("/api/v1")
	{
		projectGroup := api.Group("/projects/:projectID", middleware.AuthMiddleware())
		{
			projectGroup.POST("/pairwise", pairwiseHandler.SubmitPairwise)
			projectGroup.GET("/pairwise", pairwiseHandler.GetPairwiseSubmissions)
		}
	}
}

func SetupInputDirectWeightRoutes(r *gin.Engine, directWeightHandler handler.InputDirectWeightHandler) {

	api := r.Group("/api/v1")
	{

		projectGroup := api.Group("/projects/:projectID", middleware.AuthMiddleware())
		{

			projectGroup.POST("/direct-weights", directWeightHandler.SubmitDirectWeights)

			projectGroup.GET("/direct-weights", directWeightHandler.GetDirectWeights)
		}
	}
}

func SetupInputScoreRoutes(r *gin.Engine, scoreHandler handler.InputScoreHandler) {
	api := r.Group("/api/v1")
	{
		projectGroup := api.Group("/projects/:projectID", middleware.AuthMiddleware())
		{

			projectGroup.POST("/scores", scoreHandler.SubmitScores)

			projectGroup.GET("/scores", scoreHandler.GetScores)
		}
	}
}

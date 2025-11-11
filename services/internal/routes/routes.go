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

			projectGroup.GET("/:id", projectHandler.GetProjectByID)

		}
	}
}

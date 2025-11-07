package routes

import (
	"services/internal/handler"

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
		userGroup := api.Group("/users")
		{
			userGroup.GET("/:id", userHandler.GetUserProfile)
		}
	}
}

package main

import (
	// "fmt"
	"log"
	"services/internal/config"
	"services/internal/handler"
	// "services/internal/models"
	"services/internal/repository"
	"services/internal/routes"
	"services/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()

	db := config.ConnectDatabase()

	// err := db.AutoMigrate(
	// 	&models.Company{},
	// 	&models.User{},
	// 	&models.DecisionProject{},
	// 	&models.Alternative{},
	// 	&models.Criteria{},
	// 	&models.ProjectDecisionMaker{},
	// 	&models.DMInputScore{},
	// 	&models.DMInputPairwise{},
	// 	&models.DMInputDirectWeight{},
	// 	&models.ResultRanking{},
	// )

	// if err != nil {
	// 	log.Fatal("Failed to Migrate Database")
	// }
	// fmt.Println("Database Migration Completed Successfully")

	userReository := repository.CreateUserRepository(db)
	projectRepository := repository.NewProjectRepository(db)
	criteriarepository := repository.NewCriteriaRepository(db)

	authService := service.NewAuthService(userReository)
	userService := service.NewUserService(userReository)
	projectService := service.NewProjectService(projectRepository)
	criteriService := service.NewCriteriaService(criteriarepository, projectRepository)

	authHandler := handler.NewAuthHandler(authService)
	userHandler := handler.NewUserHandler(userService)
	projectHandler := handler.NewProjectHandler(projectService)
	criteriHandler := handler.NewCriteriaHandler(criteriService)

	r := gin.Default()

	routes.SetupAuthRoutes(r, authHandler)
	routes.SetupUserRoutes(r, userHandler)
	routes.SetupProjectRoutes(r, projectHandler)
	routes.SetupCriteriaRoutes(r, criteriHandler)

	log.Println("Starting server on port 8080....")
	r.Run(":8080")
}

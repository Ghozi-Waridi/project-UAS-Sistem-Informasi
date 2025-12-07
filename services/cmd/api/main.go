package main

import (
	"fmt"
	"log"
	"services/internal/calculations"
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

	// Uncomment untuk migrasi (hanya sekali)
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

	// Manual migration untuk menambahkan kolom weight
	db.Exec("ALTER TABLE criteria ADD COLUMN IF NOT EXISTS weight DECIMAL(5,4) DEFAULT 0")
	fmt.Println("Manual migration: Added weight column to criteria table")

	userReository := repository.CreateUserRepository(db)
	projectRepository := repository.NewProjectRepository(db)
	criteriarepository := repository.NewCriteriaRepository(db)
	alternativeRepository := repository.NewALternativeRepository(db)
	project_dm_repository := repository.NewProjectDMRepository(db)
	inputDirectWeightRepository := repository.NewInputDirectWeigtrepository(db)
	inputScoreRepository := repository.NewInputScoreRepository(db)
	resultRepository := repository.NewResultRankingRepository(db)


	topsisCalc := calculations.NewTOPSISCalculator()
	bordaCalc := calculations.NewBordaCalculator()

	authService := service.NewAuthService(userReository)
	userService := service.NewUserService(userReository)
	projectService := service.NewProjectService(projectRepository)
	criteriService := service.NewCriteriaService(criteriarepository, projectRepository)
	alternativeService := service.NewAlternativeService(alternativeRepository, projectRepository)
	projectDMService := service.NewProjectDMService(project_dm_repository, projectRepository, userReository)
	inputDirectWeightService := service.NewInputDirectWeightService(inputDirectWeightRepository, project_dm_repository)
	inputScoreService := service.NewInputScoreService(inputScoreRepository, project_dm_repository)
	decisionService := service.NewDecisionService(
		projectRepository, criteriarepository, alternativeRepository, project_dm_repository,
		inputDirectWeightRepository, inputScoreRepository, resultRepository,
		 topsisCalc, bordaCalc,
	)

	authHandler := handler.NewAuthHandler(authService)
	userHandler := handler.NewUserHandler(userService)
	projectHandler := handler.NewProjectHandler(projectService)
	criteriHandler := handler.NewCriteriaHandler(criteriService)
	alternativeHandler := handler.NewAlternativeHandler(alternativeService)
	projectDMHandler := handler.NewProjectDMHandler(projectDMService)
	inputDirectWeightHandler := handler.NewInputDirectWeightHandler(inputDirectWeightService)
	inputScoreHandler := handler.NewInputScoreHandler(inputScoreService)
	decisionHandler := handler.NewDecisionHandler(decisionService)

	r := gin.Default()

	// CORS Configuration
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	routes.SetupAuthRoutes(r, authHandler)
	routes.SetupUserRoutes(r, userHandler)
	routes.SetupProjectRoutes(r, projectHandler)
	routes.SetupCriteriaRoutes(r, criteriHandler)
	routes.SetupAlternativeRoutes(r, alternativeHandler)
	routes.SetupProjectDMRoutes(r, projectDMHandler)
	routes.SetupInputDirectWeightRoutes(r, inputDirectWeightHandler)
	routes.SetupInputScoreRoutes(r, inputScoreHandler)
	routes.SetupDecisionRoutes(r, decisionHandler)

	log.Println("Starting server on port 8084....")
	r.Run("0.0.0.0:8084")
}

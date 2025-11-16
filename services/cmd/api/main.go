package main

import (
	// "fmt"
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
	alternativeRepository := repository.NewALternativeRepository(db)
	project_dm_repository := repository.NewProjectDMRepository(db)
	inputPairwiseRepository := repository.NewInputPairwiseRepository(db)
	inputDirectWeightRepository := repository.NewInputDirectWeigtrepository(db)
	inputScoreRepository := repository.NewInputScoreRepository(db)
	resultRepository := repository.NewResultRankingRepository(db)

	ahpCalc := calculations.NewAHPCalculator()
	sawCalc := calculations.NewSAWCalculator()
	topsisCalc := calculations.NewTOPSISCalculator()
	bordaCalc := calculations.NewBordaCalculator()

	authService := service.NewAuthService(userReository)
	userService := service.NewUserService(userReository)
	projectService := service.NewProjectService(projectRepository)
	criteriService := service.NewCriteriaService(criteriarepository, projectRepository)
	alternativeService := service.NewAlternativeService(alternativeRepository, projectRepository)
	projectDMService := service.NewProjectDMService(project_dm_repository, projectRepository, userReository)
	inputPairwiseService := service.NewInputPairwiseService(inputPairwiseRepository, project_dm_repository)
	inputDirectWeightService := service.NewInputDirectWeightService(inputDirectWeightRepository, project_dm_repository)
	inputScoreService := service.NewInputScoreService(inputScoreRepository, project_dm_repository)
	decisionService := service.NewDecisionService(
		projectRepository, criteriarepository, alternativeRepository, project_dm_repository, inputPairwiseRepository,
		inputDirectWeightRepository, inputScoreRepository, resultRepository,
		ahpCalc, sawCalc, topsisCalc, bordaCalc,
	)

	authHandler := handler.NewAuthHandler(authService)
	userHandler := handler.NewUserHandler(userService)
	projectHandler := handler.NewProjectHandler(projectService)
	criteriHandler := handler.NewCriteriaHandler(criteriService)
	alternativeHandler := handler.NewAlternativeHandler(alternativeService)
	projectDMHandler := handler.NewProjectDMHandler(projectDMService)
	inputPairwiseHandler := handler.NewInputHandlerPairwise(inputPairwiseService)
	inputDirectWeightHandler := handler.NewInputDirectWeightHandler(inputDirectWeightService)
	inputScoreHandler := handler.NewInputScoreHandler(inputScoreService)
	decisionHandler := handler.NewDecisionHandler(decisionService)

	r := gin.Default()

	routes.SetupAuthRoutes(r, authHandler)
	routes.SetupUserRoutes(r, userHandler)
	routes.SetupProjectRoutes(r, projectHandler)
	routes.SetupCriteriaRoutes(r, criteriHandler)
	routes.SetupAlternativeRoutes(r, alternativeHandler)
	routes.SetupProjectDMRoutes(r, projectDMHandler)
	routes.SetupInputPairwiseRoutes(r, inputPairwiseHandler)
	routes.SetupInputDirectWeightRoutes(r, inputDirectWeightHandler)
	routes.SetupInputScoreRoutes(r, inputScoreHandler)
	routes.SetupDecisionRoutes(r, decisionHandler)

	log.Println("Starting server on port 8080....")
	r.Run(":8080")
}

package service

import (
	"services/internal/models"
	"services/internal/repository"
	"time"
)

func toProjectDTO(project *models.DecisionProject) models.ProjectDTO {
	return models.ProjectDTO{
		ProjectID:         project.ProjectID,
		CompanyID:         project.CompanyID,
		CreatedByAdminID:  project.CreatedByAdminID,
		ProjectName:       project.ProjectName,
		Description:       project.Description,
		Status:            project.Status,
		AggregationMethod: project.AggregationMethod,
		CrateAt:           project.CreatedAt,
	}
}

type ProjectService interface {
	CreateProject(input models.CreateProjectInput, adminID uint, companyID uint) (*models.ProjectDTO, error)
	GetProjectByID(projectID uint, companyID uint) (*models.ProjectDTO, error)
	GetProjectsByCompany(companyID uint) ([]models.ProjectDTO, error)
}

type projectService struct {
	projectRepo repository.ProjectRepository
}

func NewProjectService(projectRepo repository.ProjectRepository) ProjectService {
	return &projectService{
		projectRepo: projectRepo,
	}
}

func (s *projectService) CreateProject(input models.CreateProjectInput, adminID uint, companyID uint) (*models.ProjectDTO, error) {

	newProject := models.DecisionProject{
		ProjectName:       input.ProjectName,
		Description:       input.Descrtiptuin,
		AggregationMethod: input.AggregationMethod,
		CompanyID:         companyID,
		CreatedByAdminID:  adminID,
		Status:            "setup",
		CreatedAt:         time.Now(),
	}

	err := s.projectRepo.CreateProject(&newProject)
	if err != nil {
		return nil, err
	}

	projectDTO := toProjectDTO(&newProject)
	return &projectDTO, nil
}

func (s *projectService) GetProjectByID(projectID uint, companyID uint) (*models.ProjectDTO, error) {

	project, err := s.projectRepo.GetProjectByID(projectID, companyID)
	if err != nil {
		return nil, err
	}

	projectDTO := toProjectDTO(project)
	return &projectDTO, nil
}

func (s *projectService) GetProjectsByCompany(companyID uint) ([]models.ProjectDTO, error) {

	projects, err := s.projectRepo.GetProjectsByCompanyID(companyID)
	if err != nil {
		return nil, err
	}

	var projectDTOs []models.ProjectDTO
	for _, project := range projects {

		dto := toProjectDTO(&project)
		projectDTOs = append(projectDTOs, dto)
	}

	return projectDTOs, nil
}

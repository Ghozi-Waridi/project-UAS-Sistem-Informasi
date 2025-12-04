	package service

import (
	"errors"
	"log"
	"services/internal/models"
	"services/internal/repository"
	"strings"
)

func toAlternativeDTO(alt *models.Alternative) models.AlternativeDTO {
	return models.AlternativeDTO{
		AlternativeID: alt.AlternativeID,
		ProjectID:     alt.ProjectID,
		Name:          alt.Name,
		Description:   alt.Description,
	}
}

type AlternativeService interface {
	CreateAlternative(input models.CreateAlternativeInput, projectID uint, companyID uint, role string) (*models.AlternativeDTO, error)
	GetAlternativeByProject(projectID uint, companyID uint, userID uint, role string) ([]models.AlternativeDTO, error)
	UpdateAlternative(alternativeID uint, input models.UpdateAlternativeInput, projectID uint, companyID uint, role string) (*models.AlternativeDTO, error)
	DeleteAlternative(alternativeID uint, projectID uint, companyID uint, role string) error
}

type alternativeService struct {
	alternativeRepo repository.AlternativeRepository
	projectRepo     repository.ProjectRepository
}

func NewAlternativeService(alternativeRepo repository.AlternativeRepository, projectRepo repository.ProjectRepository) AlternativeService {
	return &alternativeService{
		alternativeRepo: alternativeRepo,
		projectRepo:     projectRepo,
	}
}

func (s *alternativeService) checkProjectAccess(projectID uint, companyID uint) error {
	project, err := s.projectRepo.GetProjectByID(projectID, companyID)
	if err != nil {
		return errors.New("Project no found or user does not have access")
	}
	if project == nil {
		return errors.New("project not found")
	}
	return nil
}

func (s *alternativeService) CreateAlternative(input models.CreateAlternativeInput, projectID uint, companyID uint, role string) (*models.AlternativeDTO, error) {
	if role != "admin" {
		return nil, errors.New("only admin can add alternative")
	}
	if err := s.checkProjectAccess(projectID, companyID); err != nil {
		return nil, err
	}

	newAlternative := models.Alternative{
		ProjectID:   projectID,
		Name:        input.Name,
		Description: input.Description,
	}

	err := s.alternativeRepo.CreateAlternative(&newAlternative)
	if err != nil {
		return nil, err
	}
	alternativeDTO := toAlternativeDTO(&newAlternative)
	return &alternativeDTO, nil
}

func (s *alternativeService) GetAlternativeByProject(projectID uint, companyID uint, userID uint, role string) ([]models.AlternativeDTO, error) {
	log.Printf("[GetAlternativeByProject] projectID=%d, companyID=%d, userID=%d, role=%s", projectID, companyID, userID, role)

	// For DM role, check if user is assigned to this project
	// Make role check case-insensitive
	if strings.ToLower(role) == "dm" {
		log.Printf("[GetAlternativeByProject] Checking DM access for userID=%d", userID)

		// Get all projects assigned to this DM
		dmProjects, err := s.projectRepo.GetProjectsByDM(userID)
		if err != nil {
			log.Printf("[GetAlternativeByProject] Error getting DM projects: %v", err)
			return nil, errors.New("Project no found or user does not have access")
		}

		log.Printf("[GetAlternativeByProject] DM has %d assigned projects", len(dmProjects))

		// Check if the requested project is in the DM's assigned projects
		isAssigned := false
		for _, project := range dmProjects {
			log.Printf("[GetAlternativeByProject] Checking project %d", project.ProjectID)
			if project.ProjectID == projectID {
				isAssigned = true
				log.Printf("[GetAlternativeByProject] DM is assigned to project %d", projectID)
				break
			}
		}

		if !isAssigned {
			log.Printf("[GetAlternativeByProject] DM is NOT assigned to project %d", projectID)
			return nil, errors.New("Project no found or user does not have access")
		}
	} else {
		log.Printf("[GetAlternativeByProject] Checking admin access for companyID=%d", companyID)
		// For admin, check company access
		if err := s.checkProjectAccess(projectID, companyID); err != nil {
			log.Printf("[GetAlternativeByProject] Admin access denied: %v", err)
			return nil, err
		}
	}

	alternatives, err := s.alternativeRepo.GetAlternativeByProject(projectID)
	if err != nil {
		return nil, err
	}
	var alternativeDTOs []models.AlternativeDTO
	for _, alt := range alternatives {
		dto := toAlternativeDTO(&alt)
		alternativeDTOs = append(alternativeDTOs, dto)
	}
	return alternativeDTOs, nil
}

func (s *alternativeService) UpdateAlternative(alternativeID uint, input models.UpdateAlternativeInput, projectID uint, companyID uint, role string) (*models.AlternativeDTO, error) {
	if role != "admin" {
		return nil, errors.New("only admin can update alternative")
	}

	if err := s.checkProjectAccess(projectID, companyID); err != nil {
		return nil, err
	}

	alternative, err := s.alternativeRepo.GetAlternativeByID(alternativeID)
	if err != nil {
		return nil, err
	}

	if alternative.ProjectID != projectID {
		return nil, errors.New("alternative does not belong to this project")
	}

	if input.Name != "" {
		alternative.Name = input.Name
	}
	if input.Description != "" {
		alternative.Description = input.Description
	}

	if err := s.alternativeRepo.UpdateAlternative(alternative); err != nil {
		return nil, err
	}

	dto := toAlternativeDTO(alternative)
	return &dto, nil
}

func (s *alternativeService) DeleteAlternative(alternativeID uint, projectID uint, companyID uint, role string) error {
	if role != "admin" {
		return errors.New("only admin can delete alternative")
	}

	if err := s.checkProjectAccess(projectID, companyID); err != nil {
		return err
	}

	alternative, err := s.alternativeRepo.GetAlternativeByID(alternativeID)
	if err != nil {
		return err
	}

	if alternative.ProjectID != projectID {
		return errors.New("alternative does not belong to this project")
	}

	return s.alternativeRepo.DeleteAlternative(alternativeID)
}

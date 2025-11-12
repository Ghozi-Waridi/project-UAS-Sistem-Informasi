package service

import (
	"errors"
	"services/internal/models"
	"services/internal/repository"
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
	GetAlternativeByProject(projectID uint, companyID uint) ([]models.AlternativeDTO, error)
}

type alternativeService struct {
	alternativeRepo repository.AlternativeRepository
	projectRepo     repository.ProjectRepository
}

func (s *alternativeService) checkProjectAccess(projectID uint, companyID uint) error {
	project, err := s.projectRepo.GetProjectByID(projectID, companyID)
	if err != nil {
		return errors.New("Proejct no found or user does not have access")
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

func (s *alternativeService) GetAlternativeByProject(projectID uint, companyID uint) ([]models.AlternativeDTO, error) {
	if err := s.checkProjectAccess(projectID, companyID); err != nil {
		return nil, err
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

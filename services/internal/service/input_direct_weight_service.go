package service

import (
	"errors"
	"services/internal/models"
	"services/internal/repository"
)

type InputDirectWeightService interface {
	SubmitDirectWeights(input models.SubmitDirectWeightsInput, projectID uint, dmUserID uint) error
	GetDirectWeights(projectID uint, dmUserID uint) ([]models.DMInputDirectWeight, error)
}

type inputDirectWeightService struct {
	directWeightRepo repository.InputDirectWeightRepository
	projectDMRepo    repository.ProjectDMRepository
}

func NewInputDirectWeightService(
	directWeightRepo repository.InputDirectWeightRepository,
	projectDMRepo repository.ProjectDMRepository,
) InputDirectWeightService {
	return &inputDirectWeightService{
		directWeightRepo: directWeightRepo,
		projectDMRepo:    projectDMRepo,
	}
}

func (s *inputDirectWeightService) SubmitDirectWeights(input models.SubmitDirectWeightsInput, projectID uint, dmUserID uint) error {

	assignment, err := s.projectDMRepo.GetAssignmentByProjectAndUser(projectID, dmUserID)
	if err != nil {

		return errors.New("user is not an assigned decision maker for this project")
	}

	var weights []models.DMInputDirectWeight
	for _, item := range input.Weights {
		model := models.DMInputDirectWeight{
			ProjectDMID: assignment.ProjectDMID,
			CriteriaID:  item.CriteriaID,
			WeightValue: item.WeightValue,
		}
		weights = append(weights, model)
	}
	if err := s.directWeightRepo.BatchUsertWeights(assignment.ProjectDMID, weights); err != nil {
		return err
	}

	return nil
}
func (s *inputDirectWeightService) GetDirectWeights(projectID uint, dmUserID uint) ([]models.DMInputDirectWeight, error) {
	assignment, err := s.projectDMRepo.GetAssignmentByProjectAndUser(projectID, dmUserID)
	if err != nil {
		return nil, errors.New("user is not an assigned decision maker for this project")
	}
	return s.directWeightRepo.GetDIrectWeightls(assignment.ProjectDMID)
}

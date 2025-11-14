package service

import (
	"errors"
	"services/internal/models"
	"services/internal/repository"
)

type InputPairwiseService interface {
	SubmitPairwise(input models.SumbitPairwiseInput, projectID uint, dmUserID uint) error
	GetPairwiseSubmissions(projectID uint, dmUserID uint) ([]models.DMInputPairwise, error)
}

type inputPairwiseService struct {
	pairwiseRepo  repository.InputPairwiseRepository
	projectDMRepo repository.ProjectDMRepository
}

func NewInputPairwiseService(
	pairwiseRepo repository.InputPairwiseRepository,
	projectDMRepo repository.ProjectDMRepository,
) InputPairwiseService {
	return &inputPairwiseService{
		pairwiseRepo:  pairwiseRepo,
		projectDMRepo: projectDMRepo,
	}
}

func (s *inputPairwiseService) SubmitPairwise(input models.SumbitPairwiseInput, projectID uint, dmUserID uint) error {

	assignment, err := s.projectDMRepo.GetAssignmentByProjectAndUser(projectID, dmUserID)
	if err != nil {

		return errors.New("user is not an assigned decision maker for this project")
	}

	var comparisons []models.DMInputPairwise
	for _, item := range input.Comparisons {
		model := models.DMInputPairwise{
			ProjectDMID:      assignment.ProjectDMID,
			Criteria1ID:      item.Cirteria1ID,
			Criteria2ID:      item.Cirteria2ID,
			ParentCriteriaID: item.PrentCriteriaID,
			Value:            item.Value,
		}
		comparisons = append(comparisons, model)
	}

	if err := s.pairwiseRepo.BatchUpsertPairwise(assignment.ProjectDMID, comparisons); err != nil {
		return err
	}

	return nil
}

func (s *inputPairwiseService) GetPairwiseSubmissions(projectID uint, dmUserID uint) ([]models.DMInputPairwise, error) {

	assignment, err := s.projectDMRepo.GetAssignmentByProjectAndUser(projectID, dmUserID)
	if err != nil {
		return nil, errors.New("user is not an assigned decision maker for this project")
	}

	return s.pairwiseRepo.GetPairwiseComparisons(assignment.ProjectDMID)
}

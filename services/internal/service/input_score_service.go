package service

import (
	"errors"
	"services/internal/models"
	"services/internal/repository"
)

type InputScoreService interface {
	SubmitScores(input models.SubmitScioreInput, projectID uint, dmUserID uint) error
	GetScores(projectID uint, dmUserID uint) ([]models.DMInputScore, error)
}

type inputScoreService struct {
	scoreRepo     repository.InputScoreRepository
	projectDMRepo repository.ProjectDMRepository
}

func NewInputScoreService(
	scoreRepo repository.InputScoreRepository,
	projectDMRepo repository.ProjectDMRepository,
) InputScoreService {
	return &inputScoreService{
		scoreRepo:     scoreRepo,
		projectDMRepo: projectDMRepo,
	}
}

func (s *inputScoreService) SubmitScores(input models.SubmitScioreInput, projectID uint, dmUserID uint) error {

	assignment, err := s.projectDMRepo.GetAssignmentByProjectAndUser(projectID, dmUserID)
	if err != nil {
		return errors.New("user is not an assigned decision maker for this project")
	}

	var scores []models.DMInputScore
	for _, item := range input.Scores {
		model := models.DMInputScore{
			ProjectDMID:   assignment.ProjectDMID,
			AlternativeID: item.AlternativeID,
			CriteriaID:    item.CriteriaID,
			ScoreValue:    item.ScoreValue,
		}
		scores = append(scores, model)
	}

	return s.scoreRepo.BatchUpsertInputScores(assignment.ProjectDMID, scores)
}

func (s *inputScoreService) GetScores(projectID uint, dmUserID uint) ([]models.DMInputScore, error) {
	assignment, err := s.projectDMRepo.GetAssignmentByProjectAndUser(projectID, dmUserID)
	if err != nil {
		return nil, errors.New("user is not an assigned decision maker for this project")
	}
	return s.scoreRepo.GetScores(assignment.ProjectDMID)
}

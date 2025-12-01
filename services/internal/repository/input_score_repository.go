package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type InputScoreRepository interface {
	BatchUpsertInputScores(projectDMID uint, inputScores []models.DMInputScore) error
	GetScores(projectDMID uint) ([]models.DMInputScore, error)
	CreateScore(score *models.DMInputScore) error
}

type inputScoreRepository struct {
	db *gorm.DB
}

func NewInputScoreRepository(db *gorm.DB) InputScoreRepository {
	return &inputScoreRepository{db: db}
}

func (r *inputScoreRepository) BatchUpsertInputScores(projectDMID uint, inputScores []models.DMInputScore) error {
	if len(inputScores) == 0 {
		return nil
	}
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("project_dm_id = ?", projectDMID).Delete(&models.DMInputScore{}).Error; err != nil {
			return err
		}
		if err := tx.Create(&inputScores).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *inputScoreRepository) GetScores(projectDMID uint) ([]models.DMInputScore, error) {
	var scores []models.DMInputScore
	err := r.db.Where("project_dm_id = ?", projectDMID).Find(&scores).Error
	if err != nil {
		return nil, err
	}
	return scores, nil
}

func (r *inputScoreRepository) CreateScore(score *models.DMInputScore) error {
	// Check if score exists for this criteria and alternative
	var existing models.DMInputScore
	err := r.db.Where("project_dm_id = ? AND alternative_id = ? AND criteria_id = ?",
		score.ProjectDMID, score.AlternativeID, score.CriteriaID).First(&existing).Error

	if err == nil {
		// Update existing
		existing.ScoreValue = score.ScoreValue
		return r.db.Save(&existing).Error
	}

	// Create new
	return r.db.Create(score).Error
}

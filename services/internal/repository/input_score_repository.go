package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type InputScoreRepository interface {
	BatchUpsertInputScores(projectDMID uint, inputScores []models.DMInputScore) error
	GetScores(projectDMID uint) ([]models.DMInputScore, error)
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
	err := r.db.Where("proejct_dm_id = ?", projectDMID).Find(&scores).Error
	if err != nil {
		return nil, err
	}
	return scores, nil
}

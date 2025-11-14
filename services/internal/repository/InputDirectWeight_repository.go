package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type InputDirectWeightRepository interface {
	BatchUsertWeights(projectDMID uint, weights []models.DMInputDirectWeight) error
	GetDIrectWeightls(projectlDMID uint) ([]models.DMInputDirectWeight, error)
}

type inputDirectWeightRepository struct {
	db *gorm.DB
}

func NewInputDirectWeigtrepository(db *gorm.DB) InputDirectWeightRepository {
	return &inputDirectWeightRepository{db: db}
}

func (r *inputDirectWeightRepository) BatchUsertWeights(projectDMID uint, weights []models.DMInputDirectWeight) error {
	if len(weights) == 0 {
		return nil
	}

	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("project_dm_id = ?", projectDMID).
			Delete(&models.DMInputDirectWeight{}).Error; err != nil {
			return err
		}
		if err := tx.Create(&weights).Error; err != nil {
			return err
		}
		return nil

	})
}

func (r *inputDirectWeightRepository) GetDIrectWeightls(projectDMID uint) ([]models.DMInputDirectWeight, error) {
	var weights []models.DMInputDirectWeight

	err := r.db.Where("project_dm_id = ?", projectDMID).Find(&weights).Error
	if err != nil {
		return nil, err
	}
	return weights, nil
}

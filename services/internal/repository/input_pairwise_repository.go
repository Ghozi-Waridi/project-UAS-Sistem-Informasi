package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type InputPairwiseRepository interface {
	BatchUpsertPairwise(projectDMID uint, comparisons []models.DMInputPairwise) error
	GetPairwiseComparisons(projectDMID uint) ([]models.DMInputPairwise, error)
}

type inputPairwiseRepository struct {
	db *gorm.DB
}

func NewInputPairwiseRepository(db *gorm.DB) InputPairwiseRepository {
	return &inputPairwiseRepository{db: db}
}

func (r *inputPairwiseRepository) BatchUpsertPairwise(projectDMID uint, comparisons []models.DMInputPairwise) error {
	if len(comparisons) == 0 {
		return nil
	}

	parentID := comparisons[0].ParentCriteriaID

	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("project_dm_id = ? AND parent_criteria_id = ?", projectDMID, parentID).Delete(&models.DMInputPairwise{}).Error; err != nil {
			return nil
		}

		if err := tx.Create(&comparisons).Error; err != nil {
			return nil
		}
		return nil
	})
}

func (r *inputPairwiseRepository) GetPairwiseComparisons(projectDMID uint) ([]models.DMInputPairwise, error) {
	var comparisons []models.DMInputPairwise

	err := r.db.Where("project_dm_id = ?", projectDMID).Find(&comparisons).Error
	if err != nil {
		return nil, err
	}

	return comparisons, nil
}

package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type CriteriaRepository interface {
	CreateCriteria(criteria *models.Criteria) error
	GetCriteriaByProjectID(projectID uint) ([]models.Criteria, error)
}

type criteriaRepository struct {
	db *gorm.DB
}

func NewCriteriaRepository(db *gorm.DB) CriteriaRepository {
	return &criteriaRepository{db: db}
}

func (r *criteriaRepository) CreateCriteria(criteria *models.Criteria) error {
	return r.db.Create(criteria).Error
}

func (r *criteriaRepository) GetCriteriaByProjectID(projectID uint) ([]models.Criteria, error) {
	var criteriaList []models.Criteria
	err := r.db.Where("proejct_id = ?", projectID).
		Order("parent_criteria_id IS NOT NULL, parent_criteria_id, criteria_id").
		Find(&criteriaList).Error

	if err != nil {
		return nil, err
	}

	return criteriaList, nil
}

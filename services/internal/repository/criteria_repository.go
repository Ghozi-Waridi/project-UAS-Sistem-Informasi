package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type CriteriaRepository interface {
	CreateCriteria(criteria *models.Criteria) error
	GetCriteriaByProjectID(projectID uint) ([]models.Criteria, error)
	GetCriteriaByID(criteriaID uint) (*models.Criteria, error)
	UpdateCriteria(criteria *models.Criteria) error
	DeleteCriteria(criteriaID uint) error
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
	err := r.db.Where("project_id = ?", projectID).
		Order("parent_criteria_id IS NOT NULL, parent_criteria_id, criteria_id").
		Find(&criteriaList).Error

	if err != nil {
		return nil, err
	}

	return criteriaList, nil
}

func (r *criteriaRepository) GetCriteriaByID(criteriaID uint) (*models.Criteria, error) {
	var criteria models.Criteria
	err := r.db.First(&criteria, criteriaID).Error
	if err != nil {
		return nil, err
	}
	return &criteria, nil
}

func (r *criteriaRepository) UpdateCriteria(criteria *models.Criteria) error {
	return r.db.Save(criteria).Error
}

func (r *criteriaRepository) DeleteCriteria(criteriaID uint) error {
	return r.db.Delete(&models.Criteria{}, criteriaID).Error
}

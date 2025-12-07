package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type AlternativeRepository interface {
	CreateAlternative(alternative *models.Alternative) error
	GetAlternativeByProject(projectID uint) ([]models.Alternative, error)
	GetAlternativeByID(alternativeID uint) (*models.Alternative, error)
	UpdateAlternative(alternative *models.Alternative) error
	DeleteAlternative(alternativeID uint) error
}

type alternativeRrepository struct {
	db *gorm.DB
}

func NewALternativeRepository(db *gorm.DB) AlternativeRepository {
	return &alternativeRrepository{db: db}
}

func (r *alternativeRrepository) CreateAlternative(alternative *models.Alternative) error {
	return r.db.Create(alternative).Error
}

func (r *alternativeRrepository) GetAlternativeByProject(projectID uint) ([]models.Alternative, error) {
	var alternatives []models.Alternative

	err := r.db.Where("project_id = ?", projectID).
		Order("project_id").
		Find(&alternatives).Error
	if err != nil {
		return nil, err
	}
	return alternatives, nil
}

func (r *alternativeRrepository) GetAlternativeByID(alternativeID uint) (*models.Alternative, error) {
	var alternative models.Alternative
	err := r.db.First(&alternative, alternativeID).Error
	if err != nil {
		return nil, err
	}
	return &alternative, nil
}

func (r *alternativeRrepository) UpdateAlternative(alternative *models.Alternative) error {
	return r.db.Save(alternative).Error
}

func (r *alternativeRrepository) DeleteAlternative(alternativeID uint) error {
	return r.db.Delete(&models.Alternative{}, alternativeID).Error
}

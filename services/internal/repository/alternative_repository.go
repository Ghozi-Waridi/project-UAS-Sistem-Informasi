package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type AlternativeRepository interface {
	CreateAlternative(alternative *models.Alternative) error
	GetAlternativeByProject(projectID uint) ([]models.Alternative, error)
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

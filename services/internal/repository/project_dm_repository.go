package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type ProjectDMRepository interface {
	AssignDM(assignment *models.ProjectDecisionMaker) error
	GetAssignmentsByProjectID(projectID uint) ([]models.ProjectDecisionMaker, error)
	CheckAssignmentExists(projectID uint, dmUserID uint) (bool, error)
	GetAssignmentByProjectAndUser(projectID uint, dmUserID uint) (*models.ProjectDecisionMaker, error)
}

type projectDMRepository struct {
	db *gorm.DB
}

func NewProjectDMRepository(db *gorm.DB) ProjectDMRepository {
	return &projectDMRepository{db: db}
}
func (r *projectDMRepository) AssignDM(assignment *models.ProjectDecisionMaker) error {
	return r.db.Create(assignment).Error
}

func (r *projectDMRepository) GetAssignmentsByProjectID(projectID uint) ([]models.ProjectDecisionMaker, error) {
	var assignments []models.ProjectDecisionMaker

	err := r.db.Where("project_id = ?", projectID).Find(&assignments).Error
	if err != nil {
		return nil, err
	}
	return assignments, nil
}

func (r *projectDMRepository) CheckAssignmentExists(projectID uint, dmUserID uint) (bool, error) {
	var count int64

	err := r.db.Model(&models.ProjectDecisionMaker{}).
		Where("project_id = ? AND dm_user_id = ?", projectID, dmUserID).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *projectDMRepository) GetAssignmentByProjectAndUser(projectID uint, dmUserID uint) (*models.ProjectDecisionMaker, error) {
	var assignment models.ProjectDecisionMaker

	// Cari satu record yang cocok dengan kedua ID
	err := r.db.Where("project_id = ? AND dm_user_id = ?", projectID, dmUserID).First(&assignment).Error

	if err != nil {
		return nil, err // Akan error 'record not found' jika tidak ada
	}

	return &assignment, nil
}

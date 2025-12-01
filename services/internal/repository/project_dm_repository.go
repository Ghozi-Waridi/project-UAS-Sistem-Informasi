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
	RemoveAssignment(projectID uint, dmUserID uint) error
	UpdateAssignment(projectDMID uint, method string, groupWeight float64) error
	GetAssignmentByID(projectDMID uint) (*models.ProjectDecisionMaker, error)
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

func (r *projectDMRepository) RemoveAssignment(projectID uint, dmUserID uint) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// 1. Get the ProjectDMID first
		var assignment models.ProjectDecisionMaker
		if err := tx.Where("project_id = ? AND dm_user_id = ?", projectID, dmUserID).First(&assignment).Error; err != nil {
			return err
		}

		// 2. Delete related records manually to avoid FK constraints
		// Delete Direct Weights
		if err := tx.Where("project_dm_id = ?", assignment.ProjectDMID).Delete(&models.DMInputDirectWeight{}).Error; err != nil {
			return err
		}
		// Delete Pairwise Comparisons
		if err := tx.Where("project_dm_id = ?", assignment.ProjectDMID).Delete(&models.DMInputPairwise{}).Error; err != nil {
			return err
		}
		// Delete Scores
		if err := tx.Where("project_dm_id = ?", assignment.ProjectDMID).Delete(&models.DMInputScore{}).Error; err != nil {
			return err
		}
		// Delete Results (if any)
		if err := tx.Where("project_dm_id = ?", assignment.ProjectDMID).Delete(&models.ResultRanking{}).Error; err != nil {
			return err
		}

		// 3. Finally delete the assignment
		if err := tx.Delete(&assignment).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *projectDMRepository) UpdateAssignment(projectDMID uint, method string, groupWeight float64) error {
	return r.db.Model(&models.ProjectDecisionMaker{}).
		Where("project_dm_id = ?", projectDMID).
		Updates(map[string]interface{}{
			"method":       method,
			"group_weight": groupWeight,
		}).Error
}

func (r *projectDMRepository) GetAssignmentByID(projectDMID uint) (*models.ProjectDecisionMaker, error) {
	var assignment models.ProjectDecisionMaker
	err := r.db.First(&assignment, projectDMID).Error
	if err != nil {
		return nil, err
	}
	return &assignment, nil
}

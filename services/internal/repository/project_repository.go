package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type ProjectRepository interface {
	CreateProject(project *models.DecisionProject) error
	GetProjectByID(projectID uint, companyID uint) (*models.DecisionProject, error)
	GetProjectsByCompanyID(companyID uint) ([]models.DecisionProject, error)
	UpdateProject(project *models.DecisionProject) error
	DeleteProject(projectID uint, companyID uint) error
	GetProjectsByDM(userID uint) ([]models.DecisionProject, error)
}

type projectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) ProjectRepository {
	return &projectRepository{db: db}
}

func (r *projectRepository) CreateProject(project *models.DecisionProject) error {

	return r.db.Create(project).Error
}
func (r *projectRepository) GetProjectByID(projectID uint, companyID uint) (*models.DecisionProject, error) {
	var project models.DecisionProject
	err := r.db.Where("project_id = ? AND company_id = ?", projectID, companyID).First(&project).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *projectRepository) GetProjectsByCompanyID(companyID uint) ([]models.DecisionProject, error) {
	var projects []models.DecisionProject

	err := r.db.Where("company_id = ?", companyID).Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *projectRepository) UpdateProject(project *models.DecisionProject) error {
	return r.db.Save(project).Error
}

func (r *projectRepository) DeleteProject(projectID uint, companyID uint) error {
	return r.db.Where("project_id = ? AND company_id = ?", projectID, companyID).Delete(&models.DecisionProject{}).Error
}

func (r *projectRepository) GetProjectsByDM(userID uint) ([]models.DecisionProject, error) {
	var projects []models.DecisionProject
	// Join with project_decision_makers to find projects assigned to this user
	err := r.db.Joins("JOIN project_decision_makers ON project_decision_makers.project_id = decision_projects.project_id").
		Where("project_decision_makers.dm_user_id = ?", userID).
		Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, nil
}

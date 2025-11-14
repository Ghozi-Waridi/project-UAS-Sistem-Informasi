package service

import (
	"errors"
	"services/internal/models"
	"services/internal/repository"
)

func toProjectDMDTO(assignment *models.ProjectDecisionMaker) models.ProjectDMDTO {
	return models.ProjectDMDTO{
		ProjectDMID: assignment.ProjectDMID,
		ProjectID:   assignment.ProjectID,
		DMUserID:    assignment.DMUserID,
		Method:      assignment.Method,
		GroupWeight: assignment.GroupWeight,
	}
}

type ProjectDMService interface {
	AssignDM(input models.AssignDMInput, projectID uint, adminCompanyID uint, adminRole string) (*models.ProjectDMDTO, error)
	GetAssignmentsByProject(projectID uint, companyID uint) ([]models.ProjectDMDTO, error)
}

type projectDMService struct {
	projectDMRepo repository.ProjectDMRepository
	projectRepo   repository.ProjectRepository
	userRepo      repository.UserRepository
}

func NewProjectDMService(
	projectDMRepo repository.ProjectDMRepository,
	projectRepo repository.ProjectRepository,
	userRepo repository.UserRepository,
) ProjectDMService {
	return &projectDMService{
		projectDMRepo: projectDMRepo,
		projectRepo:   projectRepo,
		userRepo:      userRepo,
	}
}

func (s *projectDMService) AssignDM(input models.AssignDMInput, projectID uint, adminCompanyID uint, adminRole string) (*models.ProjectDMDTO, error) {
	if adminRole != "admin" {
		return nil, errors.New("only admins can assign decision makers")
	}

	project, err := s.projectRepo.GetProjectByID(projectID, adminCompanyID)
	if err != nil {
		return nil, errors.New("project not found or admin does not have access")
	}
	if project == nil {
		return nil, errors.New("project not found`")
	}

	targetDM, err := s.userRepo.FindById(input.DMUserID)
	if err != nil {
		return nil, errors.New("decision maker user not found")
	}
	if targetDM.Role != "dm" {
		return nil, errors.New("target user is not a decision maker (dm)")
	}
	if targetDM.CompanyID != adminCompanyID {
		return nil, errors.New("decision maker does not belong to this company")
	}

	exists, err := s.projectDMRepo.CheckAssignmentExists(projectID, input.DMUserID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("this decision maker is already assigned to this project")
	}

	newAssignment := models.ProjectDecisionMaker{
		ProjectID:   projectID,
		DMUserID:    input.DMUserID,
		Method:      input.Method,
		GroupWeight: input.GroupWeight,
	}

	if err := s.projectDMRepo.AssignDM(&newAssignment); err != nil {
		return nil, err
	}

	assignmentDTO := toProjectDMDTO(&newAssignment)
	return &assignmentDTO, nil
}
func (s *projectDMService) GetAssignmentsByProject(projectID uint, companyID uint) ([]models.ProjectDMDTO, error) {
	_, err := s.projectRepo.GetProjectByID(projectID, companyID)
	if err != nil {
		return nil, errors.New("project not found or user does not have access")
	}
	assignments, err := s.projectDMRepo.GetAssignmentsByProjectID(projectID)
	if err != nil {
		return nil, err
	}

	var assignmentDTOs []models.ProjectDMDTO
	for _, a := range assignments {
		dto := toProjectDMDTO(&a)
		assignmentDTOs = append(assignmentDTOs, dto)
	}

	return assignmentDTOs, nil
}

package service

import (
	"errors"
	"services/internal/models"
	"services/internal/repository"
)

func toCriteriaDTO(criteria *models.Criteria) models.CriteriaDTO {
	return models.CriteriaDTO{
		CriteriaID:       criteria.CriteriaID,
		ProjectID:        criteria.ProjectID,
		ParentCriteriaID: criteria.ParentCriteriaID,
		Name:             criteria.Name,
		Code:             criteria.Code,
		Type:             criteria.Type,
	}
}

type CriteriaService interface {
	CreateCriteria(input models.CreateCriteriaInput, projectID uint, companyID uint, role string) (*models.CriteriaDTO, error)
	GetCriteriaByProject(projectID uint, companyID uint) ([]models.CriteriaDTO, error)
}

type criteriaService struct {
	criteriaRepo repository.CriteriaRepository
	projectRepo  repository.ProjectRepository
}

func NewCriteriaService(criteriaRepo repository.CriteriaRepository, projectRepo repository.ProjectRepository) CriteriaService {
	return &criteriaService{
		criteriaRepo: criteriaRepo,
		projectRepo:  projectRepo,
	}
}

func (s *criteriaService) checkProjectAccess(projectID uint, companyID uint) error {

	project, err := s.projectRepo.GetProjectByID(projectID, companyID)
	if err != nil {
		return errors.New("project not found or user does not have access")
	}
	if project == nil {
		return errors.New("project not found")
	}
	return nil
}

func (s *criteriaService) CreateCriteria(input models.CreateCriteriaInput, projectID uint, companyID uint, role string) (*models.CriteriaDTO, error) {

	if role != "admin" {
		return nil, errors.New("only admins can add criteria")
	}

	if err := s.checkProjectAccess(projectID, companyID); err != nil {
		return nil, err
	}

	newCriteria := models.Criteria{
		ProjectID:        projectID,
		Name:             input.Name,
		Code:             input.Code,
		Type:             input.Type,
		ParentCriteriaID: input.ParentCriteriaID,
	}

	err := s.criteriaRepo.CreateCriteria(&newCriteria)
	if err != nil {
		return nil, err
	}

	criteriaDTO := toCriteriaDTO(&newCriteria)
	return &criteriaDTO, nil
}

func (s *criteriaService) GetCriteriaByProject(projectID uint, companyID uint) ([]models.CriteriaDTO, error) {

	if err := s.checkProjectAccess(projectID, companyID); err != nil {
		return nil, err
	}

	flatList, err := s.criteriaRepo.GetCriteriaByProjectID(projectID)
	if err != nil {
		return nil, err
	}

	dtoMap := make(map[uint]models.CriteriaDTO)

	childMap := make(map[uint][]models.CriteriaDTO)

	var rootCriteria []models.CriteriaDTO

	for _, criteria := range flatList {
		dto := toCriteriaDTO(&criteria)
		dtoMap[dto.CriteriaID] = dto

		if dto.ParentCriteriaID == nil {

			rootCriteria = append(rootCriteria, dto)
		} else {

			parentID := *dto.ParentCriteriaID
			childMap[parentID] = append(childMap[parentID], dto)
		}
	}

	var buildTree func(nodes []models.CriteriaDTO) []models.CriteriaDTO
	buildTree = func(nodes []models.CriteriaDTO) []models.CriteriaDTO {
		for i, node := range nodes {

			if children, ok := childMap[node.CriteriaID]; ok {

				nodes[i].SubCriteria = buildTree(children)
			}
		}
		return nodes
	}

	tree := buildTree(rootCriteria)

	return tree, nil
}

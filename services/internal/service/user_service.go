package service

import (
	"errors"
	"services/internal/models"
	"services/internal/repository"
)

type UserService interface {
	GetUserByID(id string) (*models.UserProfile, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

func (s *userService) GetUserByID(id string) (*models.UserProfile, error) {

	user, err := s.userRepo.FindById(id)

	if err != nil {
		return nil, errors.New("Invalid User ID")
	} else if user == nil {
		return nil, errors.New("User NOt Found")
	}

	response := models.UserProfile{
		UserID:      user.UserID,
		Name:        user.Name,
		Email:       user.Email,
		CompanyName: "",
		Role:        user.Role,
	}
	return &response, nil
}

package service

import (
	"services/internal/models"
	"services/internal/repository"
)

type UserService interface {
	GetUserByID(id string) (*models.User, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

func (s *userService) GetUserByID(id string) (*models.User, error) {
	return s.userRepo.FindById(id)
}

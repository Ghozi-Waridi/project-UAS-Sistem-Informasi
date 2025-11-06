package service

import (
	"errors"
	"services/internal/models"
	"services/internal/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService interface {
	Register(input models.RegisterInput) (*models.User, error)
	Login(input models.LoginInput) (*models.LoginResponse, error)
}

type authService struct {
	userRepo repository.UserRepository
}

func NewAuthService(userRepo repository.UserRepository) AuthService {
	return &authService{userRepo: userRepo}
}

func (s *authService) Register(input models.RegisterInput) (*models.User, error) {
	_, err := s.userRepo.FindByEmail(input.Email)
	if err == nil || err != gorm.ErrRecordNotFound {
		return nil, errors.New("Email already exists")
	}

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	newCompany := models.Company{
		CompanyName: input.CompanyName,
	}
	if err := s.userRepo.CreateCompany(&newCompany); err != nil {
		return nil, err
	}
	newUser := models.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hashPassword),
		Role:         "admin",
		CompanyID:    newCompany.CompanyID,
	}

	if err := s.userRepo.CreateUser(&newUser); err != nil {
		return nil, err
	}

	return &newUser, nil
}

func (s *authService) Login(input models.LoginInput) (*models.LoginResponse, error) {
	user, err := s.userRepo.FindByEmail(input.Email)
	if err != nil {
		return nil, errors.New("invalid password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password))
	if err != nil {
		return nil, errors.New("invalid password")
	}

	token := "dummy_jwt_token_ganti_ini_nanti"
	response := models.LoginResponse{
		Token: token,
		User:  *user,
	}

	return &response, nil
}

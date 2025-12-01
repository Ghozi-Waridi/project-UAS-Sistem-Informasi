package service

import (
	"errors"
	"services/internal/models"
	"services/internal/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func toUserDTO(user *models.User) models.UserDTO {
	return models.UserDTO{
		UserID:    user.UserID,
		CompanyID: user.CompanyID,
		Email:     user.Email,
		Name:      user.Name,
		Role:      user.Role,
	}
}

type UserService interface {
	GetUserByID(id uint) (*models.UserProfile, error)
	CreateDM(input models.CreateDMInput, adminCompanyID uint) (*models.UserDTO, error)
	GetDMs(companyID uint) ([]models.UserDTO, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

func (s *userService) GetUserByID(id uint) (*models.UserProfile, error) {

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

func (s *userService) CreateDM(input models.CreateDMInput, adminCompanyID uint) (*models.UserDTO, error) {
	// 1. Cek duplikat email
	_, err := s.userRepo.FindByEmail(input.Email)
	if err == nil || err != gorm.ErrRecordNotFound {
		return nil, errors.New("email already exists")
	}

	// 2. Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// 3. Buat model User baru
	newUser := models.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
		Role:         "dm",           // <-- PENTING: Role di-set ke "dm"
		CompanyID:    adminCompanyID, // <-- PENTING: CompanyID dari token Admin
	}

	// 4. Simpan ke database
	if err := s.userRepo.CreateUser(&newUser); err != nil {
		return nil, err
	}

	// 5. Kembalikan sebagai DTO yang aman
	userDTO := toUserDTO(&newUser)
	return &userDTO, nil
}

func (s *userService) GetDMs(companyID uint) ([]models.UserDTO, error) {
	users, err := s.userRepo.GetUsersByRole(companyID, "dm")
	if err != nil {
		return nil, err
	}

	var userDTOs []models.UserDTO
	for _, u := range users {
		userDTOs = append(userDTOs, toUserDTO(&u))
	}
	return userDTOs, nil
}

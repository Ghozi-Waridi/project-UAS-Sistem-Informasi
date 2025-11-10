package service

import (
	"errors"
	"os"
	"services/internal/models"
	"services/internal/repository"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type MyCustomClaims struct {
	UserID    uint   `json:"user_id"`
	CompanyID uint   `json:"company_id"`
	Role      string `json:"role"`
	jwt.RegisteredClaims
}

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

func (s *authService) generateToken(user *models.User) (string, error) {
	jwtKey := os.Getenv("JWT_SECRET")
	if jwtKey == "" {
		return "", errors.New("JWT_SECRET Tidak DItermukan")
	}

	claims := MyCustomClaims{
		user.UserID,
		user.CompanyID,
		user.Role,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "proyek-GDSS",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(jwtKey))
	if err != nil {
		return "", err
	}
	return signedToken, nil

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

	token, err := s.generateToken(user)

	if err != nil {
		return nil, err
	}
	response := models.LoginResponse{
		Token: token,
		User:  *user,
	}

	return &response, nil
}

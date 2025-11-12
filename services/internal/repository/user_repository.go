package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *models.User) error
	FindByEmail(email string) (*models.User, error)
	FindById(id uint) (*models.User, error)
	CreateCompany(comapany *models.Company) error
}

type userRepository struct {
	db *gorm.DB
}

func CreateUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) CreateCompany(company *models.Company) error {
	return r.db.Create(company).Error
}

func (r *userRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User

	err := r.db.Where("email = ?", email).First(&user).Error

	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindById(id uint) (*models.User, error) {
	var user models.User

	err := r.db.Where("user_id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

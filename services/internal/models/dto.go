package models

import "time"

type RegisterInput struct {
	Name        string `json:"name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=6"`
	CompanyName string `json:"company_name" binding:"required"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type UserProfile struct {
	UserID      uint   `json:"user_id" binding:"required"`
	CompanyName string `json:"company_name"`
	Email       string `json:"email" binding:"required,email"`
	Name        string `json:"name" binding:"required,min=255"`
	Role        string `json:"role" binding:"required,oneof=admin dm"`
}

type CreateProjectInput struct {
	ProjectName       string `json:"project_name" binding:"required"`
	Descrtiptuin      string `json:"description"`
	AggregationMethod string `json:"aggregation_method" binding:"required"`
}

type ProjectDTO struct {
	ProjectID         uint      `json:"project_id"`
	CompanyID         uint      `json:"company_id"`
	CreatedByAdminID  uint      `json:"created_by_admin_id"`
	ProjectName       string    `json:"project_name"`
	Description       string    `json:"description"`
	Status            string    `json:"status"`
	AggregationMethod string    `json:"aggregation_method"`
	CrateAt           time.Time `json:"created_at"`
}

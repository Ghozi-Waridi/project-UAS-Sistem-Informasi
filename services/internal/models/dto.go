package models

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

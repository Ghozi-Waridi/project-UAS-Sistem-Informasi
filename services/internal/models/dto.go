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
type CreateDMInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}
type UserDTO struct {
	UserID    uint   `json:"user_id"`
	CompanyID uint   `json:"company_id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Role      string `json:"role"`
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

type CreateCriteriaInput struct {
	Name             string `json:"name" binding:"required"`
	Code             string `json:"code"`
	Type             string `json:"type" binding:"required,oneof=benefit cost"`
	ParentCriteriaID *uint  `json:"parent_criteria_id"`
}

type CriteriaDTO struct {
	CriteriaID       uint          `json:"criteria_id"`
	ProjectID        uint          `json:"project_id"`
	ParentCriteriaID *uint         `json:"parent_criteria_id,omitempty"`
	Name             string        `json:"name"`
	Code             string        `json:"code"`
	Type             string        `string:"type"`
	SubCriteria      []CriteriaDTO `json:"sub_criteria,omitempty"`
}

type CreateAlternativeInput struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

type AlternativeDTO struct {
	AlternativeID uint   `json:"alternative_id"`
	ProjectID     uint   `json:"project_id"`
	Name          string `json:"name"`
	Description   string `json:"description"`
}

type AssignDMInput struct {
	DMUserID    uint    `json:"dm_user_id" binding:"required"`
	Method      string  `json:"method" binding:"required,oneof=AHP AHP_SAW TOPSIS DIRECT_WEIGHT"`
	GroupWeight float64 `json:"group_weight" binding:"required,gte=0,lte=1"`
}
type ProjectDMDTO struct {
	ProjectDMID uint    `json:"project_dm_id"`
	ProjectID   uint    `json:"project_id"`
	DMUserID    uint    `json:"dm_user_id"`
	Method      string  `json:"method"`
	GroupWeight float64 `json:"group_weight"`
}

type PairwiseInputItem struct {
	Cirteria1ID     uint    `json:"criteria_1_id" bidnign:"required"`
	Cirteria2ID     uint    `json:"criteria_2_id" biding:"required"`
	PrentCriteriaID *uint   `json:"parent_criteria_id"`
	Value           float64 `json:"value" binding:"required,gt=0"`
}

type SumbitPairwiseInput struct {
	Comparisons []PairwiseInputItem `json:"comparisons" binding:"required,dive"`
}

type DirectWeightInputItem struct {
	CriteriaID  uint    `json:"criteria_id" binding:"required"`
	WeightValue float64 `json:"weight_value" binding:"required,gte=0,lte=1"`
}

type SubmitDirectionWeightInput struct {
	Weights []DirectWeightInputItem `json:"weights" binding:"required,dive"`
}

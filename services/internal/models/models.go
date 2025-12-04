package models

import "time"

type Company struct {
	CompanyID        uint      `gorm:"primaryKey;column:company_id" json:"company_id"`
	CompanyName      string    `gorm:"not null;column:company_name" json:"company_name"`
	SubscriptionPlan string    `gorm:"type:varchar(50);default:'free';column:subscription_plan" json:"subscription_plan"`
	CreatedAt        time.Time `gorm:"autoCreateTime;column:created_at" json:"created_at"`

	Users            []User            `gorm:"foreignKey:CompanyID" json:"-"`
	DecisionProjects []DecisionProject `gorm:"foreignKey:CompanyID" json:"-"`
}

type User struct {
	UserID       uint      `gorm:"primaryKey;column:user_id" json:"user_id"`
	CompanyID    uint      `gorm:"not null;column:company_id" json:"company_id"`
	Email        string    `gorm:"unique;not null;column:email" json:"email"`
	PasswordHash string    `gorm:"not null;column:password_hash" json:"-"`
	Name         string    `gorm:"column:name" json:"name"`
	Role         string    `gorm:"type:varchar(50);not null;column:role;check:role IN ('admin','dm')" json:"role"`
	CreatedAt    time.Time `gorm:"autoCreateTime;column:created_at" json:"created_at"`

	Company               Company                `gorm:"foreignKey:CompanyID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	ProjectDecisionMakers []ProjectDecisionMaker `gorm:"foreignKey:DMUserID" json:"-"`
}

type DecisionProject struct {
	ProjectID         uint      `gorm:"primaryKey;column:project_id" json:"project_id"`
	CompanyID         uint      `gorm:"not null;column:company_id" json:"company_id"`
	CreatedByAdminID  uint      `gorm:"not null;column:created_by_admin_id" json:"created_by_admin_id"`
	ProjectName       string    `gorm:"not null;column:project_name" json:"project_name"`
	Description       string    `gorm:"type:text;column:description" json:"description"`
	Status            string    `gorm:"type:varchar(50);default:'setup';column:status;check:status IN ('setup','scoring','completed')" json:"status"`
	AggregationMethod string    `gorm:"type:varchar(50);default:'BORDA';column:aggregation_method;check:aggregation_method IN ('BORDA','COPELAND','LAINNYA')" json:"aggregation_method"`
	CreatedAt         time.Time `gorm:"autoCreateTime;column:created_at" json:"created_at"`

	Company Company `gorm:"foreignKey:CompanyID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Creator User    `gorm:"foreignKey:CreatedByAdminID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`

	Alternatives          []Alternative          `gorm:"foreignKey:ProjectID" json:"-"`
	Criteria              []Criteria             `gorm:"foreignKey:ProjectID" json:"-"`
	ProjectDecisionMakers []ProjectDecisionMaker `gorm:"foreignKey:ProjectID" json:"-"`
	Results               []ResultRanking        `gorm:"foreignKey:ProjectID" json:"-"`
}

type Alternative struct {
	AlternativeID uint   `gorm:"primaryKey;column:alternative_id" json:"alternative_id"`
	ProjectID     uint   `gorm:"not null;column:project_id" json:"project_id"`
	Name          string `gorm:"not null;column:name" json:"name"`
	Description   string `gorm:"type:text;column:description" json:"description"`

	DecisionProject DecisionProject `gorm:"foreignKey:ProjectID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

type Criteria struct {
	CriteriaID       uint    `gorm:"primaryKey;column:criteria_id" json:"criteria_id"`
	ProjectID        uint    `gorm:"not null;column:project_id" json:"project_id"`
	ParentCriteriaID *uint   `gorm:"column:parent_criteria_id" json:"parent_criteria_id"`
	Name             string  `gorm:"not null;column:name" json:"name"`
	Code             string  `gorm:"type:varchar(20);column:code" json:"code"`
	Type             string  `gorm:"type:varchar(50);not null;column:type;check:type IN ('benefit','cost')" json:"type"`
	Weight           float64 `gorm:"type:decimal(5,4);default:0;column:weight" json:"weight"`

	DecisionProject DecisionProject `gorm:"foreignKey:ProjectID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	ParentCriteria  *Criteria       `gorm:"foreignKey:ParentCriteriaID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`
	SubCriteria     []Criteria      `gorm:"foreignKey:ParentCriteriaID" json:"-"`
}

type ProjectDecisionMaker struct {
	ProjectDMID uint    `gorm:"primaryKey;column:project_dm_id" json:"project_dm_id"`
	ProjectID   uint    `gorm:"not null;column:project_id" json:"project_id"`
	DMUserID    uint    `gorm:"not null;column:dm_user_id" json:"dm_user_id"`
	Method      string  `gorm:"type:varchar(50);not null;column:method;check:method IN ('TOPSIS')" json:"method"`
	GroupWeight float64 `gorm:"type:decimal(5,4);default:1.0;column:group_weight" json:"group_weight"`

	DecisionProject DecisionProject `gorm:"foreignKey:ProjectID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	DecisionMaker   User            `gorm:"foreignKey:DMUserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`

	DMInputScores        []DMInputScore        `gorm:"foreignKey:ProjectDMID" json:"-"`
	DMInputPairwises     []DMInputPairwise     `gorm:"foreignKey:ProjectDMID" json:"-"`
	DMInputDirectWeights []DMInputDirectWeight `gorm:"foreignKey:ProjectDMID" json:"-"`
}

type DMInputScore struct {
	ScoreID       uint    `gorm:"primaryKey;column:score_id" json:"score_id"`
	ProjectDMID   uint    `gorm:"not null;column:project_dm_id" json:"project_dm_id"`
	AlternativeID uint    `gorm:"not null;column:alternative_id" json:"alternative_id"`
	CriteriaID    uint    `gorm:"not null;column:criteria_id" json:"criteria_id"`
	ScoreValue    float64 `gorm:"type:decimal(10,4);not null;column:score_value" json:"score_value"`

	ProjectDecisionMaker ProjectDecisionMaker `gorm:"foreignKey:ProjectDMID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Alternative          Alternative          `gorm:"foreignKey:AlternativeID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Criteria             Criteria             `gorm:"foreignKey:CriteriaID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

// TableName overrides the default table name for DMInputScore
func (DMInputScore) TableName() string {
	return "dm_inputs_scores"
}

type DMInputPairwise struct {
	ComparisonID     uint    `gorm:"primaryKey;column:comparison_id" json:"comparison_id"`
	ProjectDMID      uint    `gorm:"not null;column:project_dm_id" json:"project_dm_id"`
	Criteria1ID      uint    `gorm:"not null;column:criteria_1_id" json:"criteria_1_id"`
	Criteria2ID      uint    `gorm:"not null;column:criteria_2_id" json:"criteria_2_id"`
	ParentCriteriaID *uint   `gorm:"column:parent_criteria_id" json:"parent_criteria_id"`
	Value            float64 `gorm:"type:decimal(10,4);not null;column:value" json:"value"`

	ProjectDecisionMaker ProjectDecisionMaker `gorm:"foreignKey:ProjectDMID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Criteria1            Criteria             `gorm:"foreignKey:Criteria1ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Criteria2            Criteria             `gorm:"foreignKey:Criteria2ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	ParentCriteria       *Criteria            `gorm:"foreignKey:ParentCriteriaID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`
}

// TableName overrides the default table name for DMInputPairwise
func (DMInputPairwise) TableName() string {
	return "dm_inputs_pairwises"
}

type DMInputDirectWeight struct {
	WeightID    uint    `gorm:"primaryKey;column:weight_id" json:"weight_id"`
	ProjectDMID uint    `gorm:"not null;column:project_dm_id" json:"project_dm_id"`
	CriteriaID  uint    `gorm:"not null;column:criteria_id" json:"criteria_id"`
	WeightValue float64 `gorm:"type:decimal(5,4);not null;column:weight_value" json:"weight_value"`

	ProjectDecisionMaker ProjectDecisionMaker `gorm:"foreignKey:ProjectDMID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Criteria             Criteria             `gorm:"foreignKey:CriteriaID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
}

// TableName overrides the default table name for DMInputDirectWeight
func (DMInputDirectWeight) TableName() string {
	return "dm_inputs_direct_weights"
}

type ResultRanking struct {
	ResultID      uint    `gorm:"primaryKey;column:result_id" json:"result_id"`
	ProjectID     uint    `gorm:"not null;column:project_id" json:"project_id"`
	AlternativeID uint    `gorm:"not null;column:alternative_id" json:"alternative_id"`
	ProjectDMID   *uint   `gorm:"column:project_dm_id" json:"project_dm_id"`
	FinalScore    float64 `gorm:"type:decimal(10,6);not null;column:final_score" json:"final_score"`
	Rank          int     `gorm:"not null;column:rank" json:"rank"`

	DecisionProject      DecisionProject       `gorm:"foreignKey:ProjectID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Alternative          Alternative           `gorm:"foreignKey:AlternativeID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	ProjectDecisionMaker *ProjectDecisionMaker `gorm:"foreignKey:ProjectDMID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`
}

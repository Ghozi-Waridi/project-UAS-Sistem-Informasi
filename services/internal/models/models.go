package models

import "time"

type Company struct {
	CompanyID        uint      `gorm:"primaryKey" json:"company_id"`
	CompanyName      string    `gorm:"not null" json:"company_name"`
	SubscriptionPlan string    `gorm:"type:varchar(50);default:'free'" json:"subscription_plan"`
	CreatedAt        time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Relasi: Satu Perusahaan punya BANYAK Pengguna dan Proyek
	Users            []User            `gorm:"foreignKey:CompanyID" json:"-"`
	DecisionProjects []DecisionProject `gorm:"foreignKey:CompanyID" json:"-"`
}

// User merepresentasikan tabel 'users'
type User struct {
	UserID       uint      `gorm:"primaryKey" json:"user_id"`
	CompanyID    uint      `gorm:"not null" json:"company_id"`
	Email        string    `gorm:"unique;not null" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"` // Sembunyikan dari JSON
	Name         string    `json:"name"`
	Role         string    `gorm:"type:varchar(50);not null" json:"role"` // "admin" atau "dm"
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Relasi: Pengguna ini milik SATU Perusahaan
	Company Company `gorm:"foreignKey:CompanyID" json:"-"`
	// Relasi: Pengguna ini (jika 'dm') bisa ditugaskan ke BANYAK Proyek
	ProjectDecisionMakers []ProjectDecisionMaker `gorm:"foreignKey:DMUserID" json:"-"`
}

// ========================================================================
// 2. Tabel Inti GDSS (Proyek Keputusan)
// ========================================================================

// DecisionProject merepresentasikan tabel 'decision_projects'
type DecisionProject struct {
	ProjectID         uint      `gorm:"primaryKey" json:"project_id"`
	CompanyID         uint      `gorm:"not null" json:"company_id"`
	CreatedByAdminID  uint      `gorm:"not null" json:"created_by_admin_id"`
	ProjectName       string    `gorm:"not null" json:"project_name"`
	Description       string    `json:"description"`
	Status            string    `gorm:"type:varchar(50);default:'setup'" json:"status"` // 'setup', 'scoring', 'completed'
	AggregationMethod string    `gorm:"type:varchar(50);default:'BORDA'" json:"aggregation_method"`
	CreatedAt         time.Time `gorm:"autoCreateTime" json:"created_at"`

	// Relasi: Proyek ini milik SATU Perusahaan
	Company Company `gorm:"foreignKey:CompanyID" json:"-"`
	// Relasi: Proyek ini dibuat oleh SATU Admin (User)
	Creator User `gorm:"foreignKey:CreatedByAdminID" json:"-"`

	// Relasi: Proyek ini punya BANYAK Alternatif, Kriteria, DM, dan Hasil
	Alternatives          []Alternative          `gorm:"foreignKey:ProjectID" json:"-"`
	Criteria              []Criteria             `gorm:"foreignKey:ProjectID" json:"-"`
	ProjectDecisionMakers []ProjectDecisionMaker `gorm:"foreignKey:ProjectID" json:"-"`
	Results               []ResultRanking        `gorm:"foreignKey:ProjectID" json:"-"`
}

// Alternative merepresentasikan tabel 'alternatives'
type Alternative struct {
	AlternativeID uint   `gorm:"primaryKey" json:"alternative_id"`
	ProjectID     uint   `gorm:"not null" json:"project_id"`
	Name          string `gorm:"not null" json:"name"`
	Description   string `json:"description"`

	// Relasi: Alternatif ini milik SATU Proyek
	DecisionProject DecisionProject `gorm:"foreignKey:ProjectID" json:"-"`
}

// Criteria merepresentasikan tabel 'criteria' (bisa jadi Kriteria atau Sub-Kriteria)
type Criteria struct {
	CriteriaID       uint   `gorm:"primaryKey" json:"criteria_id"`
	ProjectID        uint   `gorm:"not null" json:"project_id"`
	ParentCriteriaID *uint  `json:"parent_criteria_id"` // Pointer (*uint) agar bisa NULL
	Name             string `gorm:"not null" json:"name"`
	Code             string `gorm:"type:varchar(20)" json:"code"`
	Type             string `gorm:"type:varchar(50);not null" json:"type"` // "benefit" atau "cost"

	// Relasi: Kriteria ini milik SATU Proyek
	DecisionProject DecisionProject `gorm:"foreignKey:ProjectID" json:"-"`
	// Relasi: Kriteria ini (jika sub-kriteria) milik SATU Kriteria Induk
	ParentCriteria *Criteria `gorm:"foreignKey:ParentCriteriaID" json:"-"`
	// Relasi: Kriteria ini (jika kriteria induk) punya BANYAK Sub-Kriteria
	SubCriteria []Criteria `gorm:"foreignKey:ParentCriteriaID" json:"-"`
}

// ========================================================================
// 3. Tabel Penilaian & Metode DM
// ========================================================================

// ProjectDecisionMaker merepresentasikan tabel 'project_decision_makers' (Tabel Pivot)
type ProjectDecisionMaker struct {
	ProjectDMID uint    `gorm:"primaryKey" json:"project_dm_id"`
	ProjectID   uint    `gorm:"not null" json:"project_id"`
	DMUserID    uint    `gorm:"not null" json:"dm_user_id"`
	Method      string  `gorm:"type:varchar(50);not null" json:"method"` // 'AHP_SAW', 'TOPSIS', dll.
	GroupWeight float64 `gorm:"type:decimal(5,4);default:1.0" json:"group_weight"`

	// Relasi: Penugasan ini milik SATU Proyek
	DecisionProject DecisionProject `gorm:"foreignKey:ProjectID" json:"-"`
	// Relasi: Penugasan ini milik SATU DM (User)
	DecisionMaker User `gorm:"foreignKey:DMUserID" json:"-"`
}

// DMInputScore merepresentasikan tabel 'dm_inputs_scores' (untuk SAW & TOPSIS)
type DMInputScore struct {
	ScoreID       uint    `gorm:"primaryKey" json:"score_id"`
	ProjectDMID   uint    `gorm:"not null" json:"project_dm_id"`
	AlternativeID uint    `gorm:"not null" json:"alternative_id"`
	CriteriaID    uint    `gorm:"not null" json:"criteria_id"` // Harus menunjuk ke sub-kriteria
	ScoreValue    float64 `gorm:"type:decimal(10,4);not null" json:"score_value"`

	// Relasi
	ProjectDecisionMaker ProjectDecisionMaker `gorm:"foreignKey:ProjectDMID" json:"-"`
	Alternative          Alternative          `gorm:"foreignKey:AlternativeID" json:"-"`
	Criteria             Criteria             `gorm:"foreignKey:CriteriaID" json:"-"`
}

// DMInputPairwise merepresentasikan tabel 'dm_inputs_pairwise' (untuk AHP)
type DMInputPairwise struct {
	ComparisonID     uint    `gorm:"primaryKey" json:"comparison_id"`
	ProjectDMID      uint    `gorm:"not null" json:"project_dm_id"`
	Criteria1ID      uint    `gorm:"not null" json:"criteria_1_id"`
	Criteria2ID      uint    `gorm:"not null" json:"criteria_2_id"`
	ParentCriteriaID *uint   `json:"parent_criteria_id"` // NULL jika membandingkan Kriteria Utama
	Value            float64 `gorm:"type:decimal(10,4);not null" json:"value"`

	// Relasi
	ProjectDecisionMaker ProjectDecisionMaker `gorm:"foreignKey:ProjectDMID" json:"-"`
	Criteria1            Criteria             `gorm:"foreignKey:Criteria1ID" json:"-"`
	Criteria2            Criteria             `gorm:"foreignKey:Criteria2ID" json:"-"`
}

// DMInputDirectWeight merepresentasikan tabel 'dm_inputs_direct_weights' (untuk TOPSIS)
type DMInputDirectWeight struct {
	WeightID    uint    `gorm:"primaryKey" json:"weight_id"`
	ProjectDMID uint    `gorm:"not null" json:"project_dm_id"`
	CriteriaID  uint    `gorm:"not null" json:"criteria_id"`                    // Harus menunjuk ke sub-kriteria
	WeightValue float64 `gorm:"type:decimal(5,4);not null" json:"weight_value"` // cth: 0.15 untuk 15%

	// Relasi
	ProjectDecisionMaker ProjectDecisionMaker `gorm:"foreignKey:ProjectDMID" json:"-"`
	Criteria             Criteria             `gorm:"foreignKey:CriteriaID" json:"-"`
}

type ResultRanking struct {
	ResultID      uint    `gorm:"primaryKey" json:"result_id"`
	ProjectID     uint    `gorm:"not null" json:"project_id"`
	AlternativeID uint    `gorm:"not null" json:"alternative_id"`
	ProjectDMID   *uint   `json:"project_dm_id"` // Pointer (*uint) agar bisa NULL (untuk Final Rank)
	FinalScore    float64 `gorm:"type:decimal(10,6);not null" json:"final_score"`
	Rank          int     `gorm:"not null" json:"rank"`

	// Relasi
	DecisionProject      DecisionProject      `gorm:"foreignKey:ProjectID" json:"-"`
	Alternative          Alternative          `gorm:"foreignKey:AlternativeID" json:"-"`
	ProjectDecisionMaker ProjectDecisionMaker `gorm:"foreignKey:ProjectDMID" json:"-"` // Bisa NULL
}

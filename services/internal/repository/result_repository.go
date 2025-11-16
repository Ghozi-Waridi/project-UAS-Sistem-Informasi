package repository

import (
	"services/internal/models"

	"gorm.io/gorm"
)

type ResultRankingRepository interface {
	ClearRangkings(projectID uint) error
	CreatelRangkingss(rangkings []models.ResultRanking) error
	GetRangkings(projectID uint) ([]models.ResultRanking, error)
}

type resultRankingRepository struct {
	db *gorm.DB
}

func NewResultRankingRepository(db *gorm.DB) ResultRankingRepository {
	return &resultRankingRepository{db: db}
}

func (r *resultRankingRepository) ClearRangkings(projectID uint) error {
	return r.db.Where("project_id = ?", projectID).Delete(&models.ResultRanking{}).Error
}

func (r *resultRankingRepository) CreatelRangkingss(rangkings []models.ResultRanking) error {
	if len(rangkings) == 0 {
		return nil
	}
	return r.db.Create(&rangkings).Error
}

func (r *resultRankingRepository) GetRangkings(projectID uint) ([]models.ResultRanking, error) {
	var result []models.ResultRanking
	err := r.db.Where("proejct_id = ?", projectID).Order("project_dm_id IS NOT NULL , project_dm_id, rank").Find(&result).Error
	return result, err
}

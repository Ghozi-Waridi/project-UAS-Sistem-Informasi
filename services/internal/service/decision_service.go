package service

import (
	"errors"
	"log"
	"services/internal/calculations"
	"services/internal/models"
	"services/internal/repository"
)

type DecisionService interface {
	CalculateResults(projectID uint, companyID uint, role string) error
	GetResults(projectID uint, companyID uint) ([]models.ResultRanking, error)
}

type decisionService struct {
	projectRepo   repository.ProjectRepository
	criteriaRepo  repository.CriteriaRepository
	altRepo       repository.AlternativeRepository
	projectDMRepo repository.ProjectDMRepository
	directWtRepo  repository.InputDirectWeightRepository
	scoreRepo     repository.InputScoreRepository
	resultRepo    repository.ResultRankingRepository

	ahpCalc    calculations.AHPCalculator
	sawCalc    calculations.SAWCalculator
	topsisCalc calculations.TOPSISCalculator
	bordaCalc  calculations.BordaCalculator
}

func NewDecisionService(
	pRepo repository.ProjectRepository,
	cRepo repository.CriteriaRepository,
	aRepo repository.AlternativeRepository,
	pdmRepo repository.ProjectDMRepository,
	dwRepo repository.InputDirectWeightRepository,
	sRepo repository.InputScoreRepository,
	rRepo repository.ResultRankingRepository,
	ahp calculations.AHPCalculator,
	saw calculations.SAWCalculator,
	topsis calculations.TOPSISCalculator,
	borda calculations.BordaCalculator,
) DecisionService {
	return &decisionService{
		projectRepo:   pRepo,
		criteriaRepo:  cRepo,
		altRepo:       aRepo,
		projectDMRepo: pdmRepo,
		directWtRepo:  dwRepo,
		scoreRepo:     sRepo,
		resultRepo:    rRepo,
		ahpCalc:       ahp,
		sawCalc:       saw,
		topsisCalc:    topsis,
		bordaCalc:     borda,
	}
}

func (s *decisionService) checkProjectAccess(projectID uint, companyID uint) error {
	project, err := s.projectRepo.GetProjectByID(projectID, companyID)
	if err != nil {
		return errors.New("project not found or user does not have access")
	}
	if project == nil {
		return errors.New("project not found")
	}
	return nil
}

func (s *decisionService) validateProjectReadyForCalculation(projectID uint) error {
	// 1. Check criteria
	allCriteria, err := s.criteriaRepo.GetCriteriaByProjectID(projectID)
	if err != nil {
		return err
	}
	if len(allCriteria) == 0 {
		return errors.New("Proyek belum memiliki kriteria. Silakan tambahkan kriteria terlebih dahulu.")
	}

	// 2. Check alternatives
	alternatives, err := s.altRepo.GetAlternativeByProject(projectID)
	if err != nil {
		return err
	}
	if len(alternatives) == 0 {
		return errors.New("Proyek belum memiliki alternatif (kandidat). Silakan tambahkan kandidat terlebih dahulu.")
	}

	// 4. Check DM assignments
	assignments, err := s.projectDMRepo.GetAssignmentsByProjectID(projectID)
	if err != nil {
		return err
	}
	if len(assignments) == 0 {
		return errors.New("Belum ada Decision Maker yang ditugaskan untuk proyek ini.")
	}

	// 5. Check criteria weights (Admin input)
	for _, c := range allCriteria {
		if c.Weight == 0 {
			return errors.New("Ada kriteria yang belum memiliki bobot. Silakan lengkapi bobot untuk semua kriteria.")
		}
	}

	// 6. Check DM input data (scores only, weights now from criteria)
	for _, dm := range assignments {
		switch dm.Method {
		case "TOPSIS":
			// TOPSIS needs scores (weights come from criteria)
			scores, _ := s.scoreRepo.GetScores(dm.ProjectDMID)
			if len(scores) == 0 {
				return errors.New("Decision Maker belum melengkapi input skor untuk kandidat.")
			}
		}
	}

	return nil
}

func (s *decisionService) GetResults(projectID uint, companyID uint) ([]models.ResultRanking, error) {

	if err := s.checkProjectAccess(projectID, companyID); err != nil {
		return nil, err
	}

	return s.resultRepo.GetRangkings(projectID)
}

func (s *decisionService) CalculateResults(projectID uint, companyID uint, role string) error {

	if role != "admin" {
		return errors.New("only admins can trigger calculation")
	}
	if err := s.checkProjectAccess(projectID, companyID); err != nil {
		return err
	}

	// Validate project has all required data before attempting calculation
	if err := s.validateProjectReadyForCalculation(projectID); err != nil {
		return err
	}

	log.Printf("Memulai kalkulasi untuk Proyek ID: %d", projectID)

	if err := s.resultRepo.ClearRangkings(projectID); err != nil {
		log.Printf("Error menghapus hasil lama: %v", err)
		return err
	}

	assignments, err := s.projectDMRepo.GetAssignmentsByProjectID(projectID)
	if err != nil {
		return err
	}
	allCriteria, err := s.criteriaRepo.GetCriteriaByProjectID(projectID)
	if err != nil {
		return err
	}
	alternatives, err := s.altRepo.GetAlternativeByProject(projectID)
	if err != nil {
		return err
	}

	var subCriteria []models.Criteria
	for _, c := range allCriteria {
		if c.ParentCriteriaID != nil {
			subCriteria = append(subCriteria, c)
		}
	}

	var allDMRankings []calculations.SingleDMRanking
	var allResultsToSave []models.ResultRanking

	for _, dm := range assignments {
		log.Printf("Menghitung untuk DM: %d (%s)", dm.ProjectDMID, dm.Method)

		var dmRanking calculations.SingleDMRanking
		dmRanking.DMID = dm.ProjectDMID
		dmRanking.DMWeight = dm.GroupWeight

		switch dm.Method {
		case "TOPSIS":
			// Get scores from DM input
			scoreData, err := s.scoreRepo.GetScores(dm.ProjectDMID)
			if err != nil {
				return err
			}

			// Get weights from criteria (Admin input)
			weights := make(map[uint]float64)
			for _, c := range allCriteria {
				weights[c.CriteriaID] = c.Weight
			}

			topsisRanks, err := s.topsisCalc.CalculateRanking(scoreData, allCriteria, alternatives, weights)
			if err != nil {
				return err
			}

			for i, r := range topsisRanks {
				dmRanking.RankedList = append(dmRanking.RankedList, calculations.AltertnativeRank{
					AlternativeID: r.AlternativeID,
					Rank:          i + 1,
					Score:         r.FinalScore,
				})
			}

		default:
			log.Printf("Metode %s tidak diketahui, DM dilewati.", dm.Method)
			continue
		}

		allDMRankings = append(allDMRankings, dmRanking)

		for _, r := range dmRanking.RankedList {
			allResultsToSave = append(allResultsToSave, models.ResultRanking{
				ProjectID:     projectID,
				AlternativeID: r.AlternativeID,
				ProjectDMID:   &dm.ProjectDMID,
				FinalScore:    r.Score,
				Rank:          r.Rank,
			})
		}
	}

	log.Println("Menghitung ranking final BORDA...")
	finalBordaRanks := s.bordaCalc.CalcualteRanking(alternatives, allDMRankings)

	for _, r := range finalBordaRanks {
		allResultsToSave = append(allResultsToSave, models.ResultRanking{
			ProjectID:     projectID,
			AlternativeID: r.AlternativeID,
			ProjectDMID:   nil,
			FinalScore:    r.BordaScore,
			Rank:          r.Rank,
		})
	}

	log.Println("Menyimpan semua hasil ke database...")
	return s.resultRepo.CreateRankings(allResultsToSave)
}

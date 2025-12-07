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

	// 3. Check DM assignments
	assignments, err := s.projectDMRepo.GetAssignmentsByProjectID(projectID)
	if err != nil {
		return err
	}
	if len(assignments) == 0 {
		return errors.New("Belum ada Decision Maker yang ditugaskan untuk proyek ini.")
	}

	// 4. Check criteria weights (Admin input)
	for _, c := range allCriteria {
		if c.Weight == 0 {
			return errors.New("Ada kriteria yang belum memiliki bobot. Silakan lengkapi bobot untuk semua kriteria.")
		}
	}

	// 5. Check DM input data
	for _, dm := range assignments {
		scores, _ := s.scoreRepo.GetScores(dm.ProjectDMID)
		if len(scores) == 0 {
			return errors.New("Decision Maker belum melengkapi input skor untuk kandidat.")
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

	// Validate project has all required data
	if err := s.validateProjectReadyForCalculation(projectID); err != nil {
		return err
	}

	log.Printf("Memulai kalkulasi untuk Proyek ID: %d", projectID)

	// Clear existing results
	if err := s.resultRepo.ClearRangkings(projectID); err != nil {
		log.Printf("Error menghapus hasil lama: %v", err)
		return err
	}

	// Get all required data
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

	// Buat map untuk nama alternatif
	altMap := make(map[uint]string)
	for _, a := range alternatives {
		altMap[a.AlternativeID] = a.Name
	}

	// Step 1: Calculate TOPSIS for each DM
	var allDMRankings []calculations.SingleDMRanking
	var allResultsToSave []models.ResultRanking

	for _, dm := range assignments {
		log.Printf("Menghitung TOPSIS untuk DM: %d", dm.ProjectDMID)

		// Get scores from DM input
		scoreData, err := s.scoreRepo.GetScores(dm.ProjectDMID)
		if err != nil {
			log.Printf("Error mendapatkan skor untuk DM %d: %v", dm.ProjectDMID, err)
			return err
		}

		// Get weights from criteria (Admin input)
		weights := make(map[uint]float64)
		for _, c := range allCriteria {
			weights[c.CriteriaID] = c.Weight
		}

		// Calculate TOPSIS for this DM
		topsisRanks, err := s.topsisCalc.CalculateRanking(scoreData, allCriteria, alternatives, weights)
		if err != nil {
			log.Printf("Error menghitung TOPSIS untuk DM %d: %v", dm.ProjectDMID, err)
			return err
		}

		// Convert TOPSIS results to Borda format
		var dmRanking calculations.SingleDMRanking
		dmRanking.DMID = dm.ProjectDMID
		dmRanking.DMWeight = dm.GroupWeight

		// Pastikan kita memiliki semua alternatif dengan ranking
		for i, r := range topsisRanks {
			dmRanking.RankedList = append(dmRanking.RankedList, calculations.AlternativeRank{
				AlternativeID: r.AlternativeID,
				Rank:          i + 1, // Rank berdasarkan posisi di sorted list
				Score:         r.FinalScore,
			})

			log.Printf("  DM %d: %s (ID:%d) = Rank %d, Score: %.6f",
				dm.ProjectDMID, altMap[r.AlternativeID], r.AlternativeID, i+1, r.FinalScore)

			// Save TOPSIS results per DM
			allResultsToSave = append(allResultsToSave, models.ResultRanking{
				ProjectID:     projectID,
				AlternativeID: r.AlternativeID,
				ProjectDMID:   &dm.ProjectDMID,
				FinalScore:    r.FinalScore,
				Rank:          i + 1,
			})
		}

		// DEBUG: Pastikan semua alternatif ada
		log.Printf("DM %d ranking count: %d", dm.ProjectDMID, len(dmRanking.RankedList))

		allDMRankings = append(allDMRankings, dmRanking)
	}

	// DEBUG: Cek data yang akan dikirim ke Borda
	log.Println("=== DATA UNTUK BORDA ===")
	for i, dmRank := range allDMRankings {
		log.Printf("DM %d (ID:%d, Weight:%.1f) - %d alternatif:",
			i+1, dmRank.DMID, dmRank.DMWeight, len(dmRank.RankedList))
		for _, altRank := range dmRank.RankedList {
			log.Printf("  Alt %d: Rank %d, Score: %.6f",
				altRank.AlternativeID, altRank.Rank, altRank.Score)
		}
	}

	// Step 2: Calculate Borda aggregate
	log.Println("=== Menghitung ranking final BORDA ===")
	finalBordaRanks := s.bordaCalc.AggregateBorda(allDMRankings)

	if len(finalBordaRanks) == 0 {
		log.Println("ERROR: Borda calculator tidak menghasilkan ranking!")
		return errors.New("gagal menghitung ranking Borda")
	}

	// Step 3: Save Borda results
	log.Println("=== HASIL BORDA FINAL ===")
	for _, r := range finalBordaRanks {
		allResultsToSave = append(allResultsToSave, models.ResultRanking{
			ProjectID:     projectID,
			AlternativeID: r.AlternativeID,
			ProjectDMID:   nil, // Nil untuk hasil aggregate
			FinalScore:    r.Score,
			Rank:          r.Rank,
		})

		log.Printf("Rank %d: %s (ID:%d) - Score: %.6f",
			r.Rank, altMap[r.AlternativeID], r.AlternativeID, r.Score)
	}

	// Save all results to database
	log.Println("Menyimpan semua hasil ke database...")
	return s.resultRepo.CreateRankings(allResultsToSave)
}
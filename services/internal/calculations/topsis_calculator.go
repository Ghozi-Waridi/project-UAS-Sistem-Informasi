

package calculations

import (
	"errors"
	"log"
	"math"
	"services/internal/models"
	"sort"
)

type TOPSISRank struct {
	AlternativeID uint
	FinalScore    float64
	Rank          int // Ranking per DM (1,2,3,...)
}

type TOPSISCalculator interface {
	CalculateRanking(
		scores []models.DMInputScore,
		criteria []models.Criteria,
		alternatives []models.Alternative,
		weights map[uint]float64,
	) ([]TOPSISRank, error)
}

type topsisCalculator struct{}

func NewTOPSISCalculator() TOPSISCalculator {
	return &topsisCalculator{}
}

func (calc *topsisCalculator) CalculateRanking(
	scores []models.DMInputScore,
	criteria []models.Criteria,
	alternatives []models.Alternative,
	weights map[uint]float64,
) ([]TOPSISRank, error) {

	if len(criteria) == 0 || len(alternatives) == 0 || len(scores) == 0 {
		return nil, errors.New("TOPSIS: data tidak lengkap")
	}

	// 1. Build matrices
	criteriaMap := make(map[uint]models.Criteria)
	for _, c := range criteria {
		criteriaMap[c.CriteriaID] = c
	}

	scoreMatrix := make(map[uint]map[uint]float64)
	for _, a := range alternatives {
		scoreMatrix[a.AlternativeID] = make(map[uint]float64)
	}
	for _, s := range scores {
		if _, ok := scoreMatrix[s.AlternativeID]; ok {
			scoreMatrix[s.AlternativeID][s.CriteriaID] = s.ScoreValue
		}
	}

	// 2. Normalization (R matrix) - SESUAI EXCEL
	normFactors := make(map[uint]float64)
	for _, c := range criteria {
		sumOfSquares := 0.0
		for _, a := range alternatives {
			score := scoreMatrix[a.AlternativeID][c.CriteriaID]
			sumOfSquares += (score * score)
		}
		normFactors[c.CriteriaID] = math.Sqrt(sumOfSquares)
	}

	// R: Normalized matrix
	R := make(map[uint]map[uint]float64)
	// Y: Weighted normalized matrix
	Y := make(map[uint]map[uint]float64)

	for _, a := range alternatives {
		R[a.AlternativeID] = make(map[uint]float64)
		Y[a.AlternativeID] = make(map[uint]float64)
		for _, c := range criteria {
			score := scoreMatrix[a.AlternativeID][c.CriteriaID]
			factor := normFactors[c.CriteriaID]

			var r_ij float64
			if factor != 0 {
				r_ij = score / factor
			}
			R[a.AlternativeID][c.CriteriaID] = r_ij

			// Weighted: y_ij = r_ij * w_j
			w_j := weights[c.CriteriaID]
			Y[a.AlternativeID][c.CriteriaID] = r_ij * w_j
		}
	}

	// 3. Determine A+ and A- from Y matrix (SESUAI EXCEL)
	A_plus := make(map[uint]float64)
	A_minus := make(map[uint]float64)

	for _, c := range criteria {
		var max, min float64
		first := true

		for _, a := range alternatives {
			y_ij := Y[a.AlternativeID][c.CriteriaID]
			if first {
				max = y_ij
				min = y_ij
				first = false
			}
			if y_ij > max {
				max = y_ij
			}
			if y_ij < min {
				min = y_ij
			}
		}

		if c.Type == "benefit" {
			A_plus[c.CriteriaID] = max
			A_minus[c.CriteriaID] = min
		} else { // cost
			A_plus[c.CriteriaID] = min
			A_minus[c.CriteriaID] = max
		}
	}

	// 4. Calculate distances D+ and D- using R matrix (SESUAI EXCEL)
	D_plus := make(map[uint]float64)
	D_minus := make(map[uint]float64)

	for _, a := range alternatives {
		sumSqPlus := 0.0
		sumSqMinus := 0.0

		for _, c := range criteria {
			r_ij := R[a.AlternativeID][c.CriteriaID]
			a_plus := A_plus[c.CriteriaID]
			a_minus := A_minus[c.CriteriaID]

			// SESUAI EXCEL: D+ = √(Σ(A+ - R)²)
			sumSqPlus += math.Pow(a_plus-r_ij, 2)
			sumSqMinus += math.Pow(a_minus-r_ij, 2)
		}

		D_plus[a.AlternativeID] = math.Sqrt(sumSqPlus)
		D_minus[a.AlternativeID] = math.Sqrt(sumSqMinus)
	}

	// 5. Calculate final score C_i
	var results []TOPSISRank
	for _, a := range alternatives {
		dPlus := D_plus[a.AlternativeID]
		dMinus := D_minus[a.AlternativeID]

		var C_i float64
		if (dMinus + dPlus) != 0 {
			C_i = dMinus / (dMinus + dPlus)
		}

		results = append(results, TOPSISRank{
			AlternativeID: a.AlternativeID,
			FinalScore:    C_i,
		})
	}

	// Sort by FinalScore descending
	sort.Slice(results, func(i, j int) bool {
		return results[i].FinalScore > results[j].FinalScore
	})

	// Log results
	log.Println("=== TOPSIS FINAL RANKING ===")
	for i, r := range results {
		log.Printf("Rank %d: Alt ID %d, Score: %.4f", i+1, r.AlternativeID, r.FinalScore)
	}

	return results, nil
}
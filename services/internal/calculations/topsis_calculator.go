package calculations

import (
	"errors"
	"math"
	"services/internal/models"

	"sort"
)

type TOPSISRank struct {
	AlternativeID uint
	FinalScore    float64
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
		return nil, errors.New("TOPSIS: data kriteria, alternatif, atau skor tidak lengkap")
	}

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

	normFactors := make(map[uint]float64)
	for _, c := range criteria {
		if c.ParentCriteriaID == nil {
			continue
		}

		sumOfSquares := 0.0
		for _, a := range alternatives {
			score := scoreMatrix[a.AlternativeID][c.CriteriaID]
			sumOfSquares += (score * score)
		}
		normFactors[c.CriteriaID] = math.Sqrt(sumOfSquares)
	}

	normalizedMatrix := make(map[uint]map[uint]float64)
	for _, a := range alternatives {
		normalizedMatrix[a.AlternativeID] = make(map[uint]float64)
		for _, c := range criteria {
			if c.ParentCriteriaID == nil {
				continue
			}

			score := scoreMatrix[a.AlternativeID][c.CriteriaID]
			factor := normFactors[c.CriteriaID]

			if factor == 0 {
				normalizedMatrix[a.AlternativeID][c.CriteriaID] = 0
			} else {
				normalizedMatrix[a.AlternativeID][c.CriteriaID] = score / factor
			}
		}
	}

	weightedMatrix := make(map[uint]map[uint]float64)
	for _, a := range alternatives {
		weightedMatrix[a.AlternativeID] = make(map[uint]float64)
		for _, c := range criteria {
			if c.ParentCriteriaID == nil {
				continue
			}

			r_ij := normalizedMatrix[a.AlternativeID][c.CriteriaID]
			w_j, ok := weights[c.CriteriaID]
			if !ok {
				w_j = 0
			}
			weightedMatrix[a.AlternativeID][c.CriteriaID] = r_ij * w_j
		}
	}

	pisMap := make(map[uint]float64)
	nisMap := make(map[uint]float64)

	for _, c := range criteria {
		if c.ParentCriteriaID == nil {
			continue
		}

		var max, min float64
		isFirst := true

		for _, a := range alternatives {
			v_ij := weightedMatrix[a.AlternativeID][c.CriteriaID]
			if isFirst {
				max = v_ij
				min = v_ij
				isFirst = false
			}
			if v_ij > max {
				max = v_ij
			}
			if v_ij < min {
				min = v_ij
			}
		}

		// Logika terbalik untuk benefit vs cost
		if c.Type == "benefit" {
			pisMap[c.CriteriaID] = max
			nisMap[c.CriteriaID] = min
		} else if c.Type == "cost" {
			pisMap[c.CriteriaID] = min
			nisMap[c.CriteriaID] = max
		}
	}

	dPlusMap := make(map[uint]float64)
	dMinusMap := make(map[uint]float64)

	for _, a := range alternatives {
		var sumSqPlus, sumSqMinus float64
		for _, c := range criteria {
			if c.ParentCriteriaID == nil {
				continue
			}

			v_ij := weightedMatrix[a.AlternativeID][c.CriteriaID]
			s_plus := pisMap[c.CriteriaID]
			s_minus := nisMap[c.CriteriaID]

			sumSqPlus += math.Pow(s_plus-v_ij, 2)
			sumSqMinus += math.Pow(s_minus-v_ij, 2)
		}
		dPlusMap[a.AlternativeID] = math.Sqrt(sumSqPlus)
		dMinusMap[a.AlternativeID] = math.Sqrt(sumSqMinus)
	}

	var finalRanks []TOPSISRank
	for _, a := range alternatives {
		dPlus := dPlusMap[a.AlternativeID]
		dMinus := dMinusMap[a.AlternativeID]

		var c_i float64
		if (dMinus + dPlus) == 0 {
			c_i = 0
		} else {
			c_i = dMinus / (dMinus + dPlus)
		}

		finalRanks = append(finalRanks, TOPSISRank{
			AlternativeID: a.AlternativeID,
			FinalScore:    c_i,
		})
	}

	sort.Slice(finalRanks, func(i, j int) bool {
		return finalRanks[i].FinalScore > finalRanks[j].FinalScore
	})

	return finalRanks, nil
}

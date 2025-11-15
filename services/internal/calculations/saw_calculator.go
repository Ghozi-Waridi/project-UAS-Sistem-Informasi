package calculations

import (
	"errors"
	"services/internal/models"

	"sort"
)

type SAWRank struct {
	AlternativeID uint
	FinalScore    float64
}

type SAWCalculator interface {
	CalculateRanking(
		scores []models.DMInputScore,
		criteria []models.Criteria,
		alternatives []models.Alternative,
		weights map[uint]float64,
	) ([]SAWRank, error)
}

type sawCalculator struct{}

func NewSAWCalculator() SAWCalculator {
	return &sawCalculator{}
}

func (calc *sawCalculator) CalculateRanking(
	scores []models.DMInputScore,
	criteria []models.Criteria,
	alternatives []models.Alternative,
	weights map[uint]float64,
) ([]SAWRank, error) {

	if len(criteria) == 0 || len(alternatives) == 0 || len(scores) == 0 {
		return nil, errors.New("SAW: data kriteria, alternatif, atau skor tidak lengkap")
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

	maxMinMap := make(map[uint]struct{ max, min float64 })
	for _, c := range criteria {

		if c.ParentCriteriaID != nil {
			isFirst := true
			var max, min float64
			for _, a := range alternatives {
				score := scoreMatrix[a.AlternativeID][c.CriteriaID]
				if isFirst {
					max = score
					min = score
					isFirst = false
				}
				if score > max {
					max = score
				}
				if score < min {
					min = score
				}
			}
			maxMinMap[c.CriteriaID] = struct{ max, min float64 }{max, min}
		}
	}

	normalizedMatrix := make(map[uint]map[uint]float64)
	for _, a := range alternatives {
		normalizedMatrix[a.AlternativeID] = make(map[uint]float64)
	}

	for _, c := range criteria {

		if c.ParentCriteriaID == nil {
			continue
		}

		cData, ok := maxMinMap[c.CriteriaID]
		if !ok {
			continue
		}

		for _, a := range alternatives {
			score := scoreMatrix[a.AlternativeID][c.CriteriaID]

			if c.Type == "benefit" {
				if cData.max == 0 {
					normalizedMatrix[a.AlternativeID][c.CriteriaID] = 0
				} else {
					normalizedMatrix[a.AlternativeID][c.CriteriaID] = score / cData.max
				}
			} else if c.Type == "cost" {
				if score == 0 {

					normalizedMatrix[a.AlternativeID][c.CriteriaID] = 0
				} else {
					normalizedMatrix[a.AlternativeID][c.CriteriaID] = cData.min / score
				}
			}
		}
	}

	var finalRanks []SAWRank

	for _, a := range alternatives {
		finalScore := 0.0
		for _, c := range criteria {

			if c.ParentCriteriaID == nil {
				continue
			}

			weight, okW := weights[c.CriteriaID]
			normalizedValue, okN := normalizedMatrix[a.AlternativeID][c.CriteriaID]

			if okW && okN {
				finalScore += normalizedValue * weight
			}
		}
		finalRanks = append(finalRanks, SAWRank{
			AlternativeID: a.AlternativeID,
			FinalScore:    finalScore,
		})
	}

	sort.Slice(finalRanks, func(i, j int) bool {
		return finalRanks[i].FinalScore > finalRanks[j].FinalScore
	})

	return finalRanks, nil
}

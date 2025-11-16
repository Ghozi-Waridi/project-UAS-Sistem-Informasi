package calculations

import (
	"services/internal/models"
	"sort"
)

type SingleDMRanking struct {
	DMID       uint
	DMWeight   float64
	RankedList []AltertnativeRank
}

type AltertnativeRank struct {
	AlternativeID uint
	Rank          int
	Score         float64
}

type BordaRank struct {
	AlternativeID uint
	BordaScore    float64
	Rank          int
}

type BordaCalculator interface {
	CalcualteRanking(
		alternatives []models.Alternative,
		dmRangking []SingleDMRanking,
	) []BordaRank
}

type bordaCalculator struct{}

func NewBordaCalculator() BordaCalculator {
	return &bordaCalculator{}
}

func (calc *bordaCalculator) CalcualteRanking(
	alternatives []models.Alternative,
	dmRanking []SingleDMRanking,
) []BordaRank {
	bordaScore := make(map[uint]float64)
	numAlternatives := len(alternatives)
	for _, alt := range alternatives {
		bordaScore[alt.AlternativeID] = 0
	}
	for _, dm := range dmRanking {
		for i, rankItem := range dm.RankedList {
			rank := i + 1
			bordePoint := float64(numAlternatives - rank + 1)
			weighBordaPoint := bordePoint * dm.DMWeight
			bordaScore[rankItem.AlternativeID] += weighBordaPoint
		}
	}
	var finalRanks []BordaRank
	for altID, score := range bordaScore {
		finalRanks = append(finalRanks, BordaRank{
			AlternativeID: altID,
			BordaScore:    score,
		})
	}
	sort.Slice(finalRanks, func(i, j int) bool {
		return finalRanks[i].BordaScore > finalRanks[j].BordaScore
	})
	for i := range finalRanks {
		finalRanks[i].Rank = i + 1
	}
	return finalRanks
}

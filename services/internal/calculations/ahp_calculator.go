package calculation

import (
	"errors"
	"math"
	"services/internal/models"
)

type AHPCalculator interface {
	CalculateWeights(
		comparisons []models.DMInputPairwise,
		criteriaIDs []uint,
	) (map[uint]float64, error)
}

type ahpCalculator struct{}

func NewAHPCalculator() AHPCalculator {
	return &ahpCalculator{}
}
func (calc *ahpCalculator) CalculateWeights(
	comparisons []models.DMInputPairwise,
	criteriaIDs []uint,
) (map[uint]float64, error) {

	n := len(criteriaIDs)
	if n == 0 {
		return nil, errors.New("AHP: tidak ada kriteria untuk dibandingkan")
	}
	matrix := make(map[uint]map[uint]float64)
	criteriaMap := make(map[uint]bool)
	for _, id := range criteriaIDs {
		matrix[id] = make(map[uint]float64)
		matrix[id][id] = 1.0
		criteriaMap[id] = true
	}

	for _, comp := range comparisons {
		if _, ok := criteriaMap[comp.Criteria1ID]; ok {
			if _, ok := criteriaMap[comp.Criteria2ID]; ok {
				matrix[comp.Criteria1ID][comp.Criteria2ID] = comp.Value
				if comp.Value != 0 {
					matrix[comp.Criteria2ID][comp.Criteria1ID] = 1.0 / comp.Value
				}
			}
		}
	}
	geometricMeans := make(map[uint]float64)
	sumOfGeometricMeans := 0.0

	for _, rowID := range criteriaIDs {
		product := 1.0
		for _, colID := range criteriaIDs {
			product *= matrix[rowID][colID]
		}
		geoMean := math.Pow(product, 1.0/float64(n))
		geometricMeans[rowID] = geoMean
		sumOfGeometricMeans += geoMean
	}

	if sumOfGeometricMeans == 0 {
		return nil, errors.New("AHP: gagal menghitung bobot, total geometrik mean adalah nol")
	}

	weights := make(map[uint]float64)
	for _, id := range criteriaIDs {
		weights[id] = geometricMeans[id] / sumOfGeometricMeans
	}

	return weights, nil
}

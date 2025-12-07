package calculations

import (
	"log"
	"sort"
)

type AlternativeRank struct {
	AlternativeID uint
	Rank          int
	Score         float64
}

type SingleDMRanking struct {
	DMID       uint
	DMWeight   float64
	RankedList []AlternativeRank
}

type BordaCalculator interface {
	AggregateBorda(dmRankings []SingleDMRanking) []AlternativeRank
}

type bordaCalculator struct{}

func NewBordaCalculator() BordaCalculator {
	return &bordaCalculator{}
}

func (bc *bordaCalculator) AggregateBorda(dmRankings []SingleDMRanking) []AlternativeRank {
	if len(dmRankings) == 0 {
		return []AlternativeRank{}
	}

	// Count number of alternatives (assuming all DMs rank the same number of alternatives)
	numAlternatives := len(dmRankings[0].RankedList)
	
	// Borda weights: rank 1 = 5, rank 2 = 4, rank 3 = 3, rank 4 = 2, rank 5 = 1
	// Adjust based on number of alternatives
	bordaWeights := make(map[int]float64)
	for i := 1; i <= numAlternatives; i++ {
		bordaWeights[i] = float64(numAlternatives - i + 1)
	}

	log.Printf("[Borda] Jumlah alternatif: %d", numAlternatives)
	log.Printf("[Borda] Bobot: %v", bordaWeights)

	// Create map to accumulate points for each alternative
	bordaPoints := make(map[uint]float64)
	
	// Initialize all alternatives with 0 points
	for _, dmRank := range dmRankings {
		for _, altRank := range dmRank.RankedList {
			bordaPoints[altRank.AlternativeID] = 0.0
		}
		break // Just need first DM to initialize
	}

	// Calculate Borda points according to Excel logic
	// For each DM, for each alternative, add: BordaWeight(rank) * DMWeight
	for _, dmRank := range dmRankings {
		dmWeight := dmRank.DMWeight
		if dmWeight == 0 {
			dmWeight = 1.0 // Default weight if not specified
		}
		
		for _, altRank := range dmRank.RankedList {
			weight, exists := bordaWeights[altRank.Rank]
			if !exists {
				// If rank is out of range, use minimum weight
				weight = 1.0
			}
			
			points := weight * dmWeight
			bordaPoints[altRank.AlternativeID] += points
			
			log.Printf("[Borda] DM %d - Alt %d: Rank %d × Bobot %0.f × DMWeight %.1f = %.2f", 
				dmRank.DMID, altRank.AlternativeID, altRank.Rank, weight, dmWeight, points)
		}
	}

	// Calculate total points for normalization
	totalPoints := 0.0
	for _, points := range bordaPoints {
		totalPoints += points
	}
	
	log.Printf("[Borda] Total semua poin: %.2f", totalPoints)

	// Normalize and create results
	var results []AlternativeRank
	for altID, rawPoints := range bordaPoints {
		normalizedScore := rawPoints
		if totalPoints > 0 {
			normalizedScore = rawPoints / totalPoints
		}
		
		results = append(results, AlternativeRank{
			AlternativeID: altID,
			Score:         normalizedScore,
		})
		
		log.Printf("[Borda] Alt %d: Raw=%.2f, Normalized=%.4f", 
			altID, rawPoints, normalizedScore)
	}

	// Sort by Score Descending
	sort.Slice(results, func(i, j int) bool {
		return results[i].Score > results[j].Score
	})

	// Assign ranks
	for i := range results {
		results[i].Rank = i + 1
	}

	// Log final ranking
	log.Println("=== FINAL BORDA RANKING ===")
	for _, r := range results {
		log.Printf("Rank %d: Alternative ID %d (Score: %.4f)", r.Rank, r.AlternativeID, r.Score)
	}

	return results
}

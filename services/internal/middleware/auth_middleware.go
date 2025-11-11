package middleware

import (
	"errors"
	"net/http"
	"os"
	"services/internal/service" // Pastikan path import ini benar
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			return
		}

		// PERBAIKAN #1: Gunakan spasi " " untuk memisah, bukan ""
		tokenParts := strings.Split(authHeader, " ") // Mengganti nama var 'token' menjadi 'tokenParts'
		if len(tokenParts) != 2 || strings.ToLower(tokenParts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format. Must be 'Bearer <token>'."})
			return
		}

		// Sekarang kita ambil bagian token yang benar
		tokenString := tokenParts[1]

		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			// PERBAIKAN #3: Typo 'COnfigured'
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "JWT_SECRET is not Configured"})
			return
		}

		claims := &service.MyCustomClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("Unexpected signing method")
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Set data untuk digunakan oleh handler selanjutnya
		c.Set("userID", claims.UserID)
		c.Set("companyID", claims.CompanyID)

		// PERBAIKAN #2: Gunakan key "role"
		c.Set("role", claims.Role)

		c.Next()
	}
}


package main

import "github.com/gin-gonic/gin"
import "net/http"

func main() {

	r := gin.Default()

	// Contoh inisialisasi route sederhana.
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello World!",
		})
	})

	r.GET("/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello " + name,
		})
	})
	r.Run(":8080")
}

package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

type Product struct {
	gorm.Model
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

func initDB() {
	var err error
	db, err = gorm.Open(sqlite.Open("ebiz.db"), &gorm.Config{})
	if err != nil {
		panic("Nie udało się połączyć z bazą danych")
	}

	db.AutoMigrate(&Product{})
}

//CRUD and GORM

// Create
func createProduct(c echo.Context) error {
	p := new(Product)
	if err := c.Bind(p); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Zły format danych"})
	}
	db.Create(p)
	return c.JSON(http.StatusCreated, p)
}

// Read All
func getProducts(c echo.Context) error {
	var products []Product
	db.Find(&products)
	return c.JSON(http.StatusOK, products)
}

// Read One
func getProduct(c echo.Context) error {
	id := c.Param("id")
	var p Product
	if err := db.First(&p, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Produkt nie istnieje"})
	}
	return c.JSON(http.StatusOK, p)
}

func updateProduct(c echo.Context) error {
	id := c.Param("id")
	var p Product
	if err := db.First(&p, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Produkt nie istnieje"})
	}

	updateData := new(Product)
	if err := c.Bind(updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Zły format danych"})
	}

	p.Name = updateData.Name
	p.Price = updateData.Price
	db.Save(&p)
	
	return c.JSON(http.StatusOK, p)
}

// Delete
func deleteProduct(c echo.Context) error {
	id := c.Param("id")
	var p Product
	if err := db.First(&p, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Produkt nie istnieje"})
	}

	db.Delete(&p)
	return c.NoContent(http.StatusNoContent)
}

func main() {
	initDB()

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.POST("/products", createProduct)
	e.GET("/products", getProducts)
	e.GET("/products/:id", getProduct)
	e.PUT("/products/:id", updateProduct)
	e.DELETE("/products/:id", deleteProduct)

	e.Logger.Fatal(e.Start(":8080"))
}
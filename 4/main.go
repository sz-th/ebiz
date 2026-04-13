package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Product struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

var (
	products = make(map[int]Product)
	seq      = 1
)

// CRUD

// Create (POST)
func createProduct(c echo.Context) error {
	p := new(Product)
	if err := c.Bind(p); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Niepoprawne dane"})
	}
	
	p.ID = seq
	products[seq] = *p
	seq++
	
	return c.JSON(http.StatusCreated, p)
}

// Read All (GET)
func getProducts(c echo.Context) error {
	list := make([]Product, 0, len(products))
	for _, p := range products {
		list = append(list, p)
	}
	return c.JSON(http.StatusOK, list)
}

// Read One (GET)
func getProduct(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Niepoprawne ID"})
	}

	p, exists := products[id]
	if !exists {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nie znaleziony"})
	}
	return c.JSON(http.StatusOK, p)
}

// Update (PUT)
func updateProduct(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Niepoprawne ID"})
	}

	if _, exists := products[id]; !exists {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nie znaleziony"})
	}

	p := new(Product)
	if err := c.Bind(p); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Niepoprawne dane"})
	}
	
	p.ID = id
	products[id] = *p
	
	return c.JSON(http.StatusOK, p)
}

// Delete (DELETE)
func deleteProduct(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Niepoprawne ID"})
	}

	if _, exists := products[id]; !exists {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Produkt nie znaleziony"})
	}

	delete(products, id)
	return c.NoContent(http.StatusNoContent)
}

func main() {
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
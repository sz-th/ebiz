package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

type Category struct {
	gorm.Model
	Name string `json:"name"`
}

type Product struct {
	gorm.Model
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	CategoryID uint     `json:"category_id"`
	Category   Category `json:"category" gorm:"foreignKey:CategoryID"`
}

type Cart struct {
	gorm.Model
	Status string `json:"status" gorm:"default:'active'"`
}

func initDB() {
	var err error
	db, err = gorm.Open(sqlite.Open("ebiz.db"), &gorm.Config{})
	if err != nil {
		panic("Nie udało się połączyć z bazą danych")
	}

	db.AutoMigrate(&Category{}, &Product{}, &Cart{})
}


func createCategory(c echo.Context) error {
	cat := new(Category)
	if err := c.Bind(cat); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Zły format danych"})
	}
	db.Create(cat)
	return c.JSON(http.StatusCreated, cat)
}

func getCategories(c echo.Context) error {
	var cats []Category
	db.Find(&cats)
	return c.JSON(http.StatusOK, cats)
}


func createProduct(c echo.Context) error {
	p := new(Product)
	if err := c.Bind(p); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Zły format danych"})
	}
	db.Create(p)
	return c.JSON(http.StatusCreated, p)
}

func getProducts(c echo.Context) error {
	var products []Product
	db.Preload("Category").Find(&products)
	return c.JSON(http.StatusOK, products)
}

func getProduct(c echo.Context) error {
	id := c.Param("id")
	var p Product
	if err := db.Preload("Category").First(&p, id).Error; err != nil {
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
	p.CategoryID = updateData.CategoryID
	db.Save(&p)
	
	db.Preload("Category").First(&p, p.ID)
	return c.JSON(http.StatusOK, p)
}

func deleteProduct(c echo.Context) error {
	id := c.Param("id")
	var p Product
	if err := db.First(&p, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Produkt nie istnieje"})
	}

	db.Delete(&p)
	return c.NoContent(http.StatusNoContent)
}


func createCart(c echo.Context) error {
	cart := Cart{Status: "active"}
	db.Create(&cart)
	return c.JSON(http.StatusCreated, cart)
}

func getCart(c echo.Context) error {
	id := c.Param("id")
	var cart Cart
	if err := db.First(&cart, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Koszyk nie istnieje"})
	}
	return c.JSON(http.StatusOK, cart)
}

func main() {
	initDB()

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.POST("/categories", createCategory)
	e.GET("/categories", getCategories)

	e.POST("/products", createProduct)
	e.GET("/products", getProducts)
	e.GET("/products/:id", getProduct)
	e.PUT("/products/:id", updateProduct)
	e.DELETE("/products/:id", deleteProduct)

	e.POST("/carts", createCart)
	e.GET("/carts/:id", getCart)

	e.Logger.Fatal(e.Start(":8080"))
}
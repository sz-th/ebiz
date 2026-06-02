package main

import (
	"net/http"
	"strconv"

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
	Name       string   `json:"name"`
	Price      float64  `json:"price"`
	CategoryID uint     `json:"category_id"`
	Category   Category `json:"category" gorm:"foreignKey:CategoryID"`
}

type Cart struct {
	gorm.Model
	Status string `json:"status" gorm:"default:'active'"`
}

func initDB() error {
	var err error
	db, err = gorm.Open(sqlite.Open("ebiz.db"), &gorm.Config{})
	if err != nil {
		return err
	}
	return db.AutoMigrate(&Category{}, &Product{}, &Cart{})
}

func ActiveCarts(db *gorm.DB) *gorm.DB {
	return db.Where("status = ?", "active")
}

func PriceGreaterThan(minPrice float64) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("price >= ?", minPrice)
	}
}

func createCategory(c echo.Context) error {
	cat := new(Category)
	if err := c.Bind(cat); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Zły format"})
	}
	if err := db.Create(cat).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd zapisu"})
	}
	return c.JSON(http.StatusCreated, cat)
}

func getCategories(c echo.Context) error {
	var cats []Category
	if err := db.Find(&cats).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd odczytu"})
	}
	return c.JSON(http.StatusOK, cats)
}

func createProduct(c echo.Context) error {
	p := new(Product)
	if err := c.Bind(p); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Zły format"})
	}
	if err := db.Create(p).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd zapisu"})
	}
	return c.JSON(http.StatusCreated, p)
}

func getProducts(c echo.Context) error {
	var products []Product
	query := db.Preload("Category")

	minPriceStr := c.QueryParam("min_price")
	if minPriceStr != "" {
		if minPrice, err := strconv.ParseFloat(minPriceStr, 64); err == nil {
			query = query.Scopes(PriceGreaterThan(minPrice))
		}
	}

	if err := query.Find(&products).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd odczytu"})
	}
	return c.JSON(http.StatusOK, products)
}

func getProduct(c echo.Context) error {
	id := c.Param("id")
	var p Product
	if err := db.Preload("Category").First(&p, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Brak"})
	}
	return c.JSON(http.StatusOK, p)
}

func updateProduct(c echo.Context) error {
	id := c.Param("id")
	var p Product
	if err := db.First(&p, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Brak"})
	}

	updateData := new(Product)
	if err := c.Bind(updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Zły format"})
	}

	p.Name = updateData.Name
	p.Price = updateData.Price
	p.CategoryID = updateData.CategoryID
	if err := db.Save(&p).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd zapisu"})
	}

	if err := db.Preload("Category").First(&p, p.ID).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd odczytu"})
	}
	return c.JSON(http.StatusOK, p)
}

func deleteProduct(c echo.Context) error {
	id := c.Param("id")
	var p Product
	if err := db.First(&p, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Brak"})
	}
	if err := db.Delete(&p).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd usuwania"})
	}
	return c.NoContent(http.StatusNoContent)
}

func createCart(c echo.Context) error {
	cart := Cart{Status: "active"}
	if err := db.Create(&cart).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd zapisu"})
	}
	return c.JSON(http.StatusCreated, cart)
}

func getActiveCartsList(c echo.Context) error {
	var carts []Cart
	if err := db.Scopes(ActiveCarts).Find(&carts).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd odczytu"})
	}
	return c.JSON(http.StatusOK, carts)
}

func getCart(c echo.Context) error {
	id := c.Param("id")
	var cart Cart
	if err := db.First(&cart, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Brak"})
	}
	return c.JSON(http.StatusOK, cart)
}

func main() {
	if err := initDB(); err != nil {
		panic("Nie udało się połączyć z bazą danych")
	}

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
	e.GET("/carts", getActiveCartsList)
	e.GET("/carts/:id", getCart)

	e.Logger.Fatal(e.Start(":8080"))
}

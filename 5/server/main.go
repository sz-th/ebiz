package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Product struct {
	ID    uint    `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type PaymentRequest struct {
	Method string  `json:"method"`
	Amount float64 `json:"amount"`
	Holder string  `json:"holder"`
}

type PaymentResponse struct {
	ID        string    `json:"id"`
	Status    string    `json:"status"`
	Amount    float64   `json:"amount"`
	Method    string    `json:"method"`
	Timestamp time.Time `json:"timestamp"`
}

var products = []Product{
	{ID: 1, Name: "Klawiatura mechaniczna", Price: 349.99},
	{ID: 2, Name: "Mysz bezprzewodowa", Price: 129.50},
	{ID: 3, Name: "Monitor 27 cali", Price: 1499.00},
	{ID: 4, Name: "Słuchawki nauszne", Price: 259.00},
	{ID: 5, Name: "Podkładka pod mysz", Price: 49.99},
}

func getProducts(c echo.Context) error {
	return c.JSON(http.StatusOK, products)
}

func processPayment(c echo.Context) error {
	req := new(PaymentRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Zły format"})
	}
	if req.Amount <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Kwota musi być większa od zera"})
	}
	resp := PaymentResponse{
		ID:        "PMT-" + time.Now().Format("20060102150405"),
		Status:    "OK",
		Amount:    req.Amount,
		Method:    req.Method,
		Timestamp: time.Now(),
	}
	return c.JSON(http.StatusCreated, resp)
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/products", getProducts)
	e.POST("/payments", processPayment)

	e.Logger.Fatal(e.Start(":8080"))
}

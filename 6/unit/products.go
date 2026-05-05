package shop

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Product struct {
	ID    uint    `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

var Products = []Product{
	{ID: 1, Name: "Klawiatura mechaniczna", Price: 349.99},
	{ID: 2, Name: "Mysz bezprzewodowa", Price: 129.50},
	{ID: 3, Name: "Monitor 27 cali", Price: 1499.00},
	{ID: 4, Name: "Słuchawki nauszne", Price: 259.00},
	{ID: 5, Name: "Podkładka pod mysz", Price: 49.99},
}

func TotalPrice(products []Product) float64 {
	var sum float64
	for _, p := range products {
		sum += p.Price
	}
	return sum
}

func FindProductByID(products []Product, id uint) (*Product, bool) {
	for i := range products {
		if products[i].ID == id {
			return &products[i], true
		}
	}
	return nil, false
}

func GetProducts(c echo.Context) error {
	return c.JSON(http.StatusOK, Products)
}

package shop

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestProductsCount(t *testing.T) {
	assert.Len(t, Products, 5)
	assert.NotEmpty(t, Products)
}

func TestProductsHaveUniqueIDs(t *testing.T) {
	seen := map[uint]bool{}
	for _, p := range Products {
		assert.False(t, seen[p.ID], "ID %d wystąpił dwukrotnie", p.ID)
		seen[p.ID] = true
	}
	assert.Len(t, seen, 5)
}

func TestProductsHavePositivePrices(t *testing.T) {
	for _, p := range Products {
		assert.Greater(t, p.Price, 0.0, "produkt %s ma niedodatnią cenę", p.Name)
		assert.NotEmpty(t, p.Name)
		assert.NotZero(t, p.ID)
	}
}

func TestSpecificProductPrices(t *testing.T) {
	cases := map[uint]struct {
		name  string
		price float64
	}{
		1: {"Klawiatura mechaniczna", 349.99},
		2: {"Mysz bezprzewodowa", 129.50},
		3: {"Monitor 27 cali", 1499.00},
		4: {"Słuchawki nauszne", 259.00},
		5: {"Podkładka pod mysz", 49.99},
	}

	for id, want := range cases {
		p, ok := FindProductByID(Products, id)
		require.True(t, ok, "brak produktu o ID %d", id)
		assert.Equal(t, want.name, p.Name)
		assert.Equal(t, want.price, p.Price)
	}
}

func TestFindProductByIDFound(t *testing.T) {
	p, ok := FindProductByID(Products, 3)
	require.True(t, ok)
	assert.Equal(t, "Monitor 27 cali", p.Name)
	assert.Equal(t, 1499.00, p.Price)
}

func TestFindProductByIDNotFound(t *testing.T) {
	p, ok := FindProductByID(Products, 999)
	assert.False(t, ok)
	assert.Nil(t, p)
}

func TestTotalPrice(t *testing.T) {
	cases := []struct {
		name string
		in   []Product
		want float64
	}{
		{"pusta lista", []Product{}, 0},
		{"jeden", []Product{{ID: 1, Name: "x", Price: 10}}, 10},
		{"wszystkie", Products, 349.99 + 129.50 + 1499.00 + 259.00 + 49.99},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			assert.InDelta(t, c.want, TotalPrice(c.in), 0.0001)
		})
	}
}

func TestGetProductsHandler(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodGet, "/products", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	require.NoError(t, GetProducts(c))
	assert.Equal(t, http.StatusOK, rec.Code)
	assert.Contains(t, rec.Header().Get(echo.HeaderContentType), "application/json")

	var got []Product
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &got))
	assert.Len(t, got, 5)
	assert.Equal(t, "Klawiatura mechaniczna", got[0].Name)
	assert.Equal(t, uint(1), got[0].ID)
	assert.Equal(t, 349.99, got[0].Price)
}

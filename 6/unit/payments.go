package shop

import (
	"errors"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

const IDPrefix = "PMT-"
const IDLayout = "20060102150405"
const StatusOK = "OK"

var AllowedMethods = []string{"card", "blik", "transfer"}

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

var (
	ErrInvalidPayload = errors.New("Zły format")
	ErrAmountTooLow   = errors.New("Kwota musi być większa od zera")
)

func ValidateAmount(amount float64) error {
	if amount <= 0 {
		return ErrAmountTooLow
	}
	return nil
}

func GeneratePaymentID(now time.Time) string {
	return IDPrefix + now.Format(IDLayout)
}

func BuildPaymentResponse(req PaymentRequest, now time.Time) PaymentResponse {
	return PaymentResponse{
		ID:        GeneratePaymentID(now),
		Status:    StatusOK,
		Amount:    req.Amount,
		Method:    req.Method,
		Timestamp: now,
	}
}

func IsAllowedMethod(method string) bool {
	for _, m := range AllowedMethods {
		if m == method {
			return true
		}
	}
	return false
}

func ProcessPayment(c echo.Context) error {
	req := new(PaymentRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": ErrInvalidPayload.Error()})
	}
	if err := ValidateAmount(req.Amount); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	resp := BuildPaymentResponse(*req, time.Now())
	return c.JSON(http.StatusCreated, resp)
}

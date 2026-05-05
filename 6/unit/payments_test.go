package shop

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestValidateAmount(t *testing.T) {
	cases := []struct {
		name    string
		amount  float64
		wantErr error
	}{
		{"zero", 0, ErrAmountTooLow},
		{"ujemna", -1, ErrAmountTooLow},
		{"bardzo mala", -0.0001, ErrAmountTooLow},
		{"minimalna dodatnia", 0.01, nil},
		{"typowa", 199.99, nil},
		{"duza", 1_000_000.5, nil},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			err := ValidateAmount(c.amount)
			assert.Equal(t, c.wantErr, err)
		})
	}
}

func TestValidateAmountErrorMessage(t *testing.T) {
	err := ValidateAmount(0)
	require.Error(t, err)
	assert.Equal(t, "Kwota musi być większa od zera", err.Error())
	assert.ErrorIs(t, err, ErrAmountTooLow)
}

func TestGeneratePaymentID(t *testing.T) {
	now := time.Date(2026, time.May, 5, 12, 30, 45, 0, time.UTC)
	id := GeneratePaymentID(now)

	assert.Equal(t, "PMT-20260505123045", id)
	assert.True(t, strings.HasPrefix(id, IDPrefix))
	assert.Len(t, id, len(IDPrefix)+len(IDLayout))
	assert.Contains(t, id, "20260505")
	assert.Equal(t, "PMT-", IDPrefix)
}

func TestGeneratePaymentIDChangesWithTime(t *testing.T) {
	a := GeneratePaymentID(time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC))
	b := GeneratePaymentID(time.Date(2026, 1, 1, 0, 0, 1, 0, time.UTC))
	assert.NotEqual(t, a, b)
	assert.Len(t, a, 18)
	assert.Len(t, b, 18)
}

func TestBuildPaymentResponse(t *testing.T) {
	req := PaymentRequest{Method: "card", Amount: 199.99, Holder: "Jan Kowalski"}
	now := time.Date(2026, 5, 5, 19, 0, 0, 0, time.UTC)
	resp := BuildPaymentResponse(req, now)

	assert.Equal(t, "PMT-20260505190000", resp.ID)
	assert.Equal(t, StatusOK, resp.Status)
	assert.Equal(t, "OK", resp.Status)
	assert.Equal(t, 199.99, resp.Amount)
	assert.Equal(t, "card", resp.Method)
	assert.Equal(t, now, resp.Timestamp)
	assert.NotEmpty(t, resp.ID)
	assert.NotEmpty(t, resp.Status)
}

func TestBuildPaymentResponseSerialization(t *testing.T) {
	req := PaymentRequest{Method: "blik", Amount: 50, Holder: "Anna"}
	now := time.Date(2026, 5, 5, 19, 0, 0, 0, time.UTC)
	resp := BuildPaymentResponse(req, now)

	bytes, err := json.Marshal(resp)
	require.NoError(t, err)

	var decoded map[string]any
	require.NoError(t, json.Unmarshal(bytes, &decoded))

	assert.Equal(t, "PMT-20260505190000", decoded["id"])
	assert.Equal(t, "OK", decoded["status"])
	assert.Equal(t, "blik", decoded["method"])
	assert.Equal(t, 50.0, decoded["amount"])
	assert.Contains(t, decoded, "timestamp")
}

func TestIsAllowedMethod(t *testing.T) {
	cases := []struct {
		method string
		want   bool
	}{
		{"card", true},
		{"blik", true},
		{"transfer", true},
		{"paypal", false},
		{"", false},
		{"CARD", false},
	}

	for _, c := range cases {
		t.Run(c.method, func(t *testing.T) {
			assert.Equal(t, c.want, IsAllowedMethod(c.method))
		})
	}
	assert.Len(t, AllowedMethods, 3)
}

func TestProcessPaymentSuccess(t *testing.T) {
	e := echo.New()
	body := `{"method":"card","amount":250.5,"holder":"Jan Kowalski"}`
	req := httptest.NewRequest(http.MethodPost, "/payments", strings.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	require.NoError(t, ProcessPayment(c))
	assert.Equal(t, http.StatusCreated, rec.Code)

	var resp PaymentResponse
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &resp))

	assert.Equal(t, "OK", resp.Status)
	assert.Equal(t, 250.5, resp.Amount)
	assert.Equal(t, "card", resp.Method)
	assert.True(t, strings.HasPrefix(resp.ID, "PMT-"))
	assert.False(t, resp.Timestamp.IsZero())
	assert.WithinDuration(t, time.Now(), resp.Timestamp, 5*time.Second)
}

func TestProcessPaymentZeroAmount(t *testing.T) {
	e := echo.New()
	body := `{"method":"card","amount":0,"holder":"Jan"}`
	req := httptest.NewRequest(http.MethodPost, "/payments", strings.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	require.NoError(t, ProcessPayment(c))
	assert.Equal(t, http.StatusBadRequest, rec.Code)

	var resp map[string]string
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &resp))
	assert.Equal(t, "Kwota musi być większa od zera", resp["error"])
	assert.NotContains(t, resp, "id")
}

func TestProcessPaymentNegativeAmount(t *testing.T) {
	e := echo.New()
	body := `{"method":"card","amount":-10,"holder":"Jan"}`
	req := httptest.NewRequest(http.MethodPost, "/payments", strings.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	require.NoError(t, ProcessPayment(c))
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "Kwota")
}

func TestProcessPaymentInvalidJSON(t *testing.T) {
	e := echo.New()
	body := `to nie jest json`
	req := httptest.NewRequest(http.MethodPost, "/payments", strings.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	require.NoError(t, ProcessPayment(c))
	assert.Equal(t, http.StatusBadRequest, rec.Code)
	assert.Contains(t, rec.Body.String(), "Zły format")
}

func TestProcessPaymentBlikMethod(t *testing.T) {
	e := echo.New()
	body := `{"method":"blik","amount":99.99,"holder":"Anna"}`
	req := httptest.NewRequest(http.MethodPost, "/payments", strings.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	require.NoError(t, ProcessPayment(c))
	assert.Equal(t, http.StatusCreated, rec.Code)

	var resp PaymentResponse
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &resp))
	assert.Equal(t, "blik", resp.Method)
	assert.Equal(t, 99.99, resp.Amount)
}

func TestPaymentRequestStruct(t *testing.T) {
	r := PaymentRequest{Method: "transfer", Amount: 12.34, Holder: "Test"}
	assert.Equal(t, "transfer", r.Method)
	assert.Equal(t, 12.34, r.Amount)
	assert.Equal(t, "Test", r.Holder)
}

package main

import (
	"fmt"
	"net/http"
	"time"
)

const (
	BaseURLV1 = "https://{{base_url}}/wp-json/wp-site-health/v1/directory-sizes"
)

type Client struct {
	BaseURL    string
	apiKey     string
	HTTPClient *http.Client
}

func NewClient(apiKey string) *Client {
	return &Client{
		BaseURL: BaseURLV1,
		apiKey:  apiKey,
		HTTPClient: &http.Client{
			Timeout: time.Minute,
		},
	}
}

func main() {
	fmt.Println("hello world")
}

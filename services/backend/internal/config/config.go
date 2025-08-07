package config

import (
	"os"
)

type Config struct {
	Environment   string
	DatabaseURL   string
	RedisURL      string
	JWTSecret     string
	OpenAIAPIKey  string
	AnthropicKey  string
	Port          string
}

func Load() *Config {
	return &Config{
		Environment:   getEnv("ENVIRONMENT", "development"),
		DatabaseURL:   getEnv("DATABASE_URL", "postgres://localhost:5432/budget_tracker?sslmode=disable"),
		RedisURL:      getEnv("REDIS_URL", "redis://localhost:6379"),
		JWTSecret:     getEnv("JWT_SECRET", "your-secret-key"),
		OpenAIAPIKey:  getEnv("OPENAI_API_KEY", ""),
		AnthropicKey:  getEnv("ANTHROPIC_API_KEY", ""),
		Port:          getEnv("PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
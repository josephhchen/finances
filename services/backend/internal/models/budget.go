package models

import (
	"time"
	"gorm.io/gorm"
)

type Budget struct {
	ID        uint                `json:"id" gorm:"primaryKey"`
	Name      string              `json:"name" gorm:"not null"`
	Category  TransactionCategory `json:"category" gorm:"not null"`
	Limit     float64             `json:"limit" gorm:"not null"`
	Spent     float64             `json:"spent" gorm:"default:0"`
	Period    string              `json:"period" gorm:"not null"` // weekly, monthly, yearly
	StartDate time.Time           `json:"start_date" gorm:"not null"`
	EndDate   time.Time           `json:"end_date" gorm:"not null"`
	IsActive  bool                `json:"is_active" gorm:"default:true"`
	UserID    uint                `json:"user_id" gorm:"not null"`
	CreatedAt time.Time           `json:"created_at"`
	UpdatedAt time.Time           `json:"updated_at"`
	DeletedAt gorm.DeletedAt      `json:"-" gorm:"index"`

	// Alert settings
	AlertAt50Percent bool `json:"alert_at_50_percent" gorm:"default:false"`
	AlertAt75Percent bool `json:"alert_at_75_percent" gorm:"default:false"`
	AlertAt90Percent bool `json:"alert_at_90_percent" gorm:"default:false"`

	// Relations
	User User `json:"user" gorm:"foreignKey:UserID"`
}

type FinancialGoal struct {
	ID            uint           `json:"id" gorm:"primaryKey"`
	Title         string         `json:"title" gorm:"not null"`
	Description   *string        `json:"description,omitempty"`
	TargetAmount  float64        `json:"target_amount" gorm:"not null"`
	CurrentAmount float64        `json:"current_amount" gorm:"default:0"`
	TargetDate    time.Time      `json:"target_date" gorm:"not null"`
	Category      string         `json:"category" gorm:"not null"`
	IsCompleted   bool           `json:"is_completed" gorm:"default:false"`
	UserID        uint           `json:"user_id" gorm:"not null"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	User User `json:"user" gorm:"foreignKey:UserID"`
}

type SpendingInsight struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Type        string         `json:"type" gorm:"not null"` // trend, anomaly, prediction, recommendation
	Title       string         `json:"title" gorm:"not null"`
	Description string         `json:"description" gorm:"not null"`
	Category    *string        `json:"category,omitempty"`
	Impact      string         `json:"impact" gorm:"not null"` // positive, negative, neutral
	Confidence  float64        `json:"confidence" gorm:"not null"`
	Data        []byte         `json:"data" gorm:"type:jsonb"` // JSON data
	UserID      uint           `json:"user_id" gorm:"not null"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	User User `json:"user" gorm:"foreignKey:UserID"`
}
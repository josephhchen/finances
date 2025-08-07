package models

import (
	"time"
	"gorm.io/gorm"
)

type TransactionType string
type TransactionCategory string

const (
	// Transaction Types
	TransactionTypeIncome   TransactionType = "income"
	TransactionTypeExpense  TransactionType = "expense"
	TransactionTypeTransfer TransactionType = "transfer"

	// Income Categories
	CategorySalary     TransactionCategory = "salary"
	CategoryFreelance  TransactionCategory = "freelance"
	CategoryInvestment TransactionCategory = "investment"
	CategoryBusiness   TransactionCategory = "business"
	CategoryOtherIncome TransactionCategory = "other_income"

	// Expense Categories
	CategoryFood         TransactionCategory = "food"
	CategoryTransport    TransactionCategory = "transport"
	CategoryHousing      TransactionCategory = "housing"
	CategoryUtilities    TransactionCategory = "utilities"
	CategoryHealthcare   TransactionCategory = "healthcare"
	CategoryEntertainment TransactionCategory = "entertainment"
	CategoryShopping     TransactionCategory = "shopping"
	CategoryEducation    TransactionCategory = "education"
	CategorySavings      TransactionCategory = "savings"
	CategoryOtherExpense TransactionCategory = "other_expense"
)

type Transaction struct {
	ID                  uint                `json:"id" gorm:"primaryKey"`
	Amount              float64             `json:"amount" gorm:"not null"`
	Type                TransactionType     `json:"type" gorm:"not null"`
	Category            TransactionCategory `json:"category" gorm:"not null"`
	Description         string              `json:"description" gorm:"not null"`
	Date                time.Time           `json:"date" gorm:"not null"`
	AccountID           uint                `json:"account_id" gorm:"not null"`
	UserID              uint                `json:"user_id" gorm:"not null"`
	IsRecurring         bool                `json:"is_recurring" gorm:"default:false"`
	RecurringFrequency  *string             `json:"recurring_frequency,omitempty"`
	Tags                []string            `json:"tags" gorm:"type:text[]"`
	CreatedAt           time.Time           `json:"created_at"`
	UpdatedAt           time.Time           `json:"updated_at"`
	DeletedAt           gorm.DeletedAt      `json:"-" gorm:"index"`

	// Relations
	Account Account `json:"account" gorm:"foreignKey:AccountID"`
	User    User    `json:"user" gorm:"foreignKey:UserID"`
}

type Account struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name" gorm:"not null"`
	Type      string         `json:"type" gorm:"not null"`
	Balance   float64        `json:"balance" gorm:"default:0"`
	Currency  string         `json:"currency" gorm:"default:'USD'"`
	IsActive  bool           `json:"is_active" gorm:"default:true"`
	UserID    uint           `json:"user_id" gorm:"not null"`
	Color     *string        `json:"color,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	User         User          `json:"user" gorm:"foreignKey:UserID"`
	Transactions []Transaction `json:"transactions,omitempty"`
}

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Email     string         `json:"email" gorm:"unique;not null"`
	Name      string         `json:"name" gorm:"not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relations
	Accounts     []Account     `json:"accounts,omitempty"`
	Transactions []Transaction `json:"transactions,omitempty"`
	Budgets      []Budget      `json:"budgets,omitempty"`
}
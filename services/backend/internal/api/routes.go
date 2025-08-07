package api

import (
	"github.com/budget-tracker/backend/internal/config"
	"github.com/budget-tracker/backend/internal/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(db *gorm.DB, cfg *config.Config) *gin.Engine {
	router := gin.Default()

	// Middleware
	router.Use(middleware.CORS())
	router.Use(middleware.Logger())
	router.Use(gin.Recovery())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API versioning
	v1 := router.Group("/api/v1")
	{
		// Public routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", RegisterHandler(db))
			auth.POST("/login", LoginHandler(db, cfg))
			auth.POST("/refresh", RefreshTokenHandler(cfg))
		}

		// Protected routes
		protected := v1.Group("/")
		protected.Use(middleware.AuthRequired(cfg.JWTSecret))
		{
			// User routes
			users := protected.Group("/users")
			{
				users.GET("/profile", GetProfileHandler(db))
				users.PUT("/profile", UpdateProfileHandler(db))
			}

			// Account routes
			accounts := protected.Group("/accounts")
			{
				accounts.GET("/", GetAccountsHandler(db))
				accounts.POST("/", CreateAccountHandler(db))
				accounts.GET("/:id", GetAccountHandler(db))
				accounts.PUT("/:id", UpdateAccountHandler(db))
				accounts.DELETE("/:id", DeleteAccountHandler(db))
			}

			// Transaction routes
			transactions := protected.Group("/transactions")
			{
				transactions.GET("/", GetTransactionsHandler(db))
				transactions.POST("/", CreateTransactionHandler(db))
				transactions.GET("/:id", GetTransactionHandler(db))
				transactions.PUT("/:id", UpdateTransactionHandler(db))
				transactions.DELETE("/:id", DeleteTransactionHandler(db))
				transactions.POST("/categorize", CategorizeTransactionHandler(cfg))
			}

			// Budget routes
			budgets := protected.Group("/budgets")
			{
				budgets.GET("/", GetBudgetsHandler(db))
				budgets.POST("/", CreateBudgetHandler(db))
				budgets.GET("/:id", GetBudgetHandler(db))
				budgets.PUT("/:id", UpdateBudgetHandler(db))
				budgets.DELETE("/:id", DeleteBudgetHandler(db))
			}

			// AI/Insights routes
			ai := protected.Group("/ai")
			{
				ai.POST("/analyze", AnalyzeSpendingHandler(db, cfg))
				ai.POST("/recommendations", GetRecommendationsHandler(db, cfg))
				ai.POST("/chat", ChatHandler(db, cfg))
			}
		}
	}

	return router
}
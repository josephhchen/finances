# Budget Tracker Mobile App

A local-first, AI-powered budgeting app with Plaid bank account integration. Built with React Native, Expo, SQLite, Redux, and Claude AI.

## Features

### 🏦 Bank Account Integration
- **Plaid Integration**: Link bank accounts securely
- **Real-time Sync**: Automatic transaction synchronization
- **Multi-account Support**: Manage checking, savings, credit, and investment accounts
- **Local Storage**: All data stored locally with SQLite for privacy and offline access

### 🤖 AI-Powered Budgeting
- **Smart Budget Suggestions**: Claude AI analyzes spending patterns and suggests realistic budgets
- **Financial Insights**: Get personalized recommendations for saving money
- **Spending Analysis**: Identify trends and unusual spending patterns
- **Auto-categorization**: Transactions automatically categorized with AI assistance

### 📱 Clean, Minimal UI
- **Sleek Design**: Black and white theme with minimal, fast interface
- **Intuitive Navigation**: Easy-to-use for anyone
- **Real-time Updates**: Instant updates when linking accounts or making changes
- **Responsive Design**: Optimized for all screen sizes

### 🔒 Privacy-First
- **Local Data Storage**: All financial data stays on your device
- **No External Databases**: Until you choose to sync
- **Secure Integration**: Bank connections through Plaid's secure infrastructure
- **Data Export**: Full control over your data with export capabilities

## Architecture

### Frontend
- **React Native** with Expo for cross-platform mobile development
- **Redux** with Redux Toolkit for state management
- **SQLite** for local data persistence
- **TypeScript** for type safety

### Services
- **Database Service**: SQLite operations for accounts, transactions, and budgets
- **Plaid Service**: Bank account linking and transaction synchronization
- **AI Service**: Claude AI integration for budgeting and financial insights
- **Sync Service**: Automatic data synchronization and backup

### Key Components
- **PlaidLinkButton**: Secure bank account linking
- **AccountCard**: Display account information with sync status
- **BudgetSuggestionsCard**: AI-powered budget recommendations
- **TransactionItem**: Clean transaction display
- **Financial Cards**: Overview of financial metrics

## Setup Instructions

### Prerequisites
1. Node.js (v16 or higher)
2. Expo CLI (`npm install -g @expo/cli`)
3. iOS Simulator or Android Emulator (or physical device)
4. Plaid Developer Account
5. Anthropic API Key (for Claude AI)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd /path/to/your/project
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your API keys:
   ```
   EXPO_PUBLIC_PLAID_CLIENT_ID=your_plaid_client_id
   EXPO_PUBLIC_PLAID_SECRET=your_plaid_secret_key
   EXPO_PUBLIC_PLAID_ENV=sandbox
   EXPO_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

   **⚠️ Security Warning**: Never put secret keys in client-side code in production. Use a backend API for secure operations.

3. **Plaid Setup**
   - Sign up at [Plaid Dashboard](https://dashboard.plaid.com)
   - Create a new application
   - Get your Client ID and Secret Key
   - Set up webhook endpoints (for production)

4. **Anthropic API Setup**
   - Sign up at [Anthropic Console](https://console.anthropic.com)
   - Generate an API key
   - Add it to your environment variables

### Running the App

1. **Start the Development Server**
   ```bash
   npm start
   ```

2. **Run on Device/Simulator**
   - iOS: Press `i` or scan QR code with Camera app
   - Android: Press `a` or scan QR code with Expo Go app

## Usage

### First Time Setup
1. **Launch the app** - Database will initialize automatically
2. **Link Bank Account** - Tap "Link Bank Account" to connect via Plaid
3. **Review AI Suggestions** - Claude will analyze your transactions and suggest budgets
4. **Apply Budgets** - Select and apply suggested budgets
5. **Add Manual Transactions** - Add any missing transactions manually

### Daily Use
- **View Dashboard** - See account balances, monthly income/expenses
- **Review Transactions** - All transactions auto-sync from linked accounts
- **Check Budget Status** - Track spending against AI-suggested budgets
- **Get Insights** - Receive AI-powered financial recommendations
- **Manual Entry** - Add cash transactions or missed payments

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── accounts/       # Account-specific components
│   ├── ai/             # AI-related components
│   ├── common/         # Shared components
│   ├── plaid/          # Plaid integration components
│   └── ui/             # Basic UI components
├── services/           # Business logic and API integrations
│   ├── aiService.ts    # Claude AI integration
│   ├── database.ts     # SQLite operations
│   ├── plaidService.ts # Plaid API integration
│   └── syncService.ts  # Data synchronization
├── stores/             # Redux store configuration
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Services

#### Database Service
- SQLite database management
- CRUD operations for accounts, transactions, budgets
- Data migration and schema management

#### Plaid Service
- Secure bank account linking
- Transaction synchronization
- Account balance updates
- Error handling and retries

#### AI Service
- Claude AI integration for budget suggestions
- Spending pattern analysis
- Financial insights generation
- Natural language processing for categorization

#### Sync Service
- Automatic background synchronization
- Manual sync capabilities
- Data export and backup
- Sync status management

### Extending the App

#### Adding New Account Types
1. Update `Account` type in `types/financial.ts`
2. Add mapping logic in `plaidService.ts`
3. Update UI components in `components/accounts/`

#### Adding New AI Features
1. Extend `aiService.ts` with new analysis methods
2. Create corresponding UI components
3. Update types for new insight categories

#### Adding New Transaction Categories
1. Update `TransactionCategory` type
2. Update AI categorization logic
3. Add category icons and colors

## Security Best Practices

### Production Deployment
1. **Never expose secret keys** in client-side code
2. **Use a backend API** for Plaid operations
3. **Implement proper authentication**
4. **Enable encryption** for local database
5. **Use certificate pinning** for API calls
6. **Implement biometric authentication**

### Data Protection
- All financial data stored locally
- Database encryption for sensitive information
- Secure API communication with HTTPS
- No third-party analytics tracking financial data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following the existing code style
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Plaid documentation
3. Check Anthropic API documentation
4. Create an issue in the repository

---

**Note**: This app is designed for personal use. For production deployment serving multiple users, implement proper backend services, authentication, and security measures.
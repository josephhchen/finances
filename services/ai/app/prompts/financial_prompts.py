"""Structured prompts for financial AI interactions"""

from typing import Dict, Any, List


class FinancialPrompts:
    """Collection of structured prompts for financial analysis and insights"""

    def get_categorization_prompt(self, description: str, amount: float) -> str:
        """Generate prompt for transaction categorization"""
        return f"""
Analyze this financial transaction and categorize it appropriately.

Transaction Details:
- Description: {description}
- Amount: ${amount:.2f}

Available Categories:
Income: salary, freelance, investment, business, other_income
Expenses: food, transport, housing, utilities, healthcare, entertainment, shopping, education, savings, other_expense

Instructions:
1. Analyze the transaction description and amount
2. Choose the most appropriate category
3. Provide a confidence score (0.0 to 1.0)
4. Give a brief reasoning

Response Format:
Category: [category_name]
Confidence: [0.0-1.0]
Reasoning: [brief explanation]

Example:
Category: food
Confidence: 0.95
Reasoning: "McDonald's" clearly indicates a food purchase at a restaurant.
"""

    def get_analysis_prompt(self, transactions: List[Dict], user_profile: Dict) -> str:
        """Generate prompt for spending analysis"""
        transaction_summary = self._summarize_transactions(transactions)
        
        return f"""
Analyze the following spending patterns and provide financial insights.

User Profile:
- Monthly Income: ${user_profile.get('monthly_income', 0):.2f}
- Financial Goals: {user_profile.get('goals', 'Not specified')}
- Risk Tolerance: {user_profile.get('risk_tolerance', 'Medium')}

Recent Transactions Summary:
{transaction_summary}

Provide insights on:
1. Spending patterns and trends
2. Budget adherence
3. Areas of concern or opportunity
4. Actionable recommendations
5. Financial health assessment

Keep responses practical and actionable. Focus on specific, measurable advice.
"""

    def get_chat_prompt(self, user_message: str, context: Dict[str, Any]) -> str:
        """Generate prompt for chat interactions"""
        context_str = self._format_context(context)
        
        return f"""
You are a helpful financial advisor AI. Answer the user's question using their financial data context.

User Question: {user_message}

Available Context:
{context_str}

Guidelines:
- Provide specific, actionable advice
- Reference the user's actual financial data when relevant
- Be encouraging but realistic
- Suggest concrete next steps
- If you don't have enough context, ask clarifying questions

Keep your response concise but helpful.
"""

    def get_recommendation_prompt(self, user_data: Dict[str, Any]) -> str:
        """Generate prompt for financial recommendations"""
        return f"""
Based on the user's financial data, generate 3-5 personalized recommendations.

Financial Summary:
- Total Balance: ${user_data.get('total_balance', 0):.2f}
- Monthly Income: ${user_data.get('monthly_income', 0):.2f}
- Monthly Expenses: ${user_data.get('monthly_expenses', 0):.2f}
- Savings Rate: {user_data.get('savings_rate', 0):.1%}
- Top Spending Categories: {', '.join(user_data.get('top_categories', []))}

Current Goals:
{self._format_goals(user_data.get('goals', []))}

Generate recommendations that are:
1. Specific and actionable
2. Prioritized by impact
3. Realistic for their situation
4. Include target metrics where possible

Format each recommendation with:
- Title: Brief recommendation title
- Description: Detailed explanation
- Impact: Expected benefit
- Timeline: When to implement
"""

    def get_budget_optimization_prompt(self, budget_data: Dict[str, Any]) -> str:
        """Generate prompt for budget optimization suggestions"""
        return f"""
Analyze the current budget allocation and suggest optimizations.

Current Budget:
{self._format_budget_data(budget_data)}

Spending vs Budget:
{self._format_spending_comparison(budget_data)}

Provide optimization suggestions for:
1. Categories that are over-budget
2. Categories with room for improvement
3. Better allocation of funds
4. Emergency fund recommendations
5. Savings opportunities

Focus on practical, implementable changes that align with financial best practices.
"""

    def _summarize_transactions(self, transactions: List[Dict]) -> str:
        """Create a summary of transactions for prompt context"""
        if not transactions:
            return "No recent transactions available."
        
        total_spent = sum(t.get('amount', 0) for t in transactions if t.get('type') == 'expense')
        total_income = sum(t.get('amount', 0) for t in transactions if t.get('type') == 'income')
        
        categories = {}
        for t in transactions:
            if t.get('type') == 'expense':
                category = t.get('category', 'unknown')
                categories[category] = categories.get(category, 0) + t.get('amount', 0)
        
        top_categories = sorted(categories.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return f"""
- Total Income: ${total_income:.2f}
- Total Expenses: ${total_spent:.2f}
- Number of Transactions: {len(transactions)}
- Top Spending Categories: {', '.join([f"{cat}: ${amt:.2f}" for cat, amt in top_categories])}
"""

    def _format_context(self, context: Dict[str, Any]) -> str:
        """Format context data for prompts"""
        formatted = []
        
        if 'recent_transactions' in context:
            formatted.append(f"Recent Transactions: {len(context['recent_transactions'])} transactions")
        
        if 'current_balance' in context:
            formatted.append(f"Current Balance: ${context['current_balance']:.2f}")
        
        if 'monthly_budget' in context:
            formatted.append(f"Monthly Budget: ${context['monthly_budget']:.2f}")
        
        if 'financial_goals' in context:
            formatted.append(f"Active Goals: {len(context['financial_goals'])} goals")
        
        return '\n'.join(formatted) if formatted else "No specific context available."

    def _format_goals(self, goals: List[Dict]) -> str:
        """Format financial goals for prompts"""
        if not goals:
            return "No specific financial goals set."
        
        formatted_goals = []
        for goal in goals:
            formatted_goals.append(
                f"- {goal.get('title', 'Untitled')}: "
                f"${goal.get('current_amount', 0):.2f} / ${goal.get('target_amount', 0):.2f}"
            )
        
        return '\n'.join(formatted_goals)

    def _format_budget_data(self, budget_data: Dict[str, Any]) -> str:
        """Format budget data for prompts"""
        formatted = []
        
        for category, data in budget_data.get('categories', {}).items():
            formatted.append(
                f"- {category.title()}: ${data.get('allocated', 0):.2f} allocated, "
                f"${data.get('spent', 0):.2f} spent"
            )
        
        return '\n'.join(formatted) if formatted else "No budget data available."

    def _format_spending_comparison(self, budget_data: Dict[str, Any]) -> str:
        """Format spending vs budget comparison"""
        comparisons = []
        
        for category, data in budget_data.get('categories', {}).items():
            allocated = data.get('allocated', 0)
            spent = data.get('spent', 0)
            
            if allocated > 0:
                percentage = (spent / allocated) * 100
                status = "Over" if percentage > 100 else "Under" if percentage < 80 else "On Track"
                comparisons.append(f"- {category.title()}: {percentage:.1f}% ({status})")
        
        return '\n'.join(comparisons) if comparisons else "No comparison data available."
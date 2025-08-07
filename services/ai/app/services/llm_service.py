"""LLM service for processing financial data and generating insights"""

import asyncio
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic

from ..config import settings
from ..prompts.financial_prompts import FinancialPrompts


class LLMService:
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        
        if settings.OPENAI_API_KEY:
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        
        self.prompts = FinancialPrompts()

    async def categorize_transactions(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Categorize transactions using LLM"""
        results = []
        
        for transaction in transactions:
            prompt = self.prompts.get_categorization_prompt(
                description=transaction["description"],
                amount=transaction["amount"]
            )
            
            try:
                response = await self._call_llm(prompt, max_tokens=100)
                category_data = self._parse_categorization_response(response)
                
                results.append({
                    "transaction_id": transaction.get("id", "unknown"),
                    "suggested_category": category_data["category"],
                    "confidence": category_data["confidence"],
                    "reasoning": category_data["reasoning"]
                })
            except Exception as e:
                # Fallback to default category
                results.append({
                    "transaction_id": transaction.get("id", "unknown"),
                    "suggested_category": "other_expense",
                    "confidence": 0.1,
                    "reasoning": f"Error in categorization: {str(e)}"
                })
        
        return results

    async def process_chat_message(
        self, 
        user_id: str, 
        message: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Process user chat message and return AI response"""
        
        prompt = self.prompts.get_chat_prompt(
            user_message=message,
            context=context or {}
        )
        
        try:
            response = await self._call_llm(prompt, max_tokens=500)
            
            return {
                "response": response.strip(),
                "sources": self._extract_sources(context or {})
            }
        except Exception as e:
            return {
                "response": "I'm sorry, I encountered an error processing your request. Please try again.",
                "sources": []
            }

    async def generate_financial_insights(
        self, 
        transactions: List[Dict[str, Any]], 
        user_profile: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate financial insights from transaction data"""
        
        prompt = self.prompts.get_analysis_prompt(
            transactions=transactions,
            user_profile=user_profile
        )
        
        try:
            response = await self._call_llm(prompt, max_tokens=1000)
            insights = self._parse_insights_response(response)
            return insights
        except Exception as e:
            return [{
                "type": "error",
                "title": "Analysis Error",
                "description": f"Unable to generate insights: {str(e)}",
                "confidence": 0.0
            }]

    async def _call_llm(self, prompt: str, max_tokens: int = 500) -> str:
        """Call the configured LLM with the given prompt"""
        
        if self.openai_client:
            return await self._call_openai(prompt, max_tokens)
        elif self.anthropic_client:
            return await self._call_anthropic(prompt, max_tokens)
        else:
            raise ValueError("No LLM client configured")

    async def _call_openai(self, prompt: str, max_tokens: int) -> str:
        """Call OpenAI GPT"""
        response = await self.openai_client.chat.completions.create(
            model=settings.DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful financial advisor AI."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=settings.TEMPERATURE
        )
        return response.choices[0].message.content

    async def _call_anthropic(self, prompt: str, max_tokens: int) -> str:
        """Call Anthropic Claude"""
        response = await self.anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=max_tokens,
            temperature=settings.TEMPERATURE,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.content[0].text

    def _parse_categorization_response(self, response: str) -> Dict[str, Any]:
        """Parse LLM response for transaction categorization"""
        # Simple parsing - in production, use more robust parsing
        lines = response.strip().split('\n')
        
        category = "other_expense"
        confidence = 0.5
        reasoning = "Default categorization"
        
        for line in lines:
            if "category:" in line.lower():
                category = line.split(':')[1].strip()
            elif "confidence:" in line.lower():
                try:
                    confidence = float(line.split(':')[1].strip())
                except ValueError:
                    confidence = 0.5
            elif "reasoning:" in line.lower():
                reasoning = line.split(':', 1)[1].strip()
        
        return {
            "category": category,
            "confidence": confidence,
            "reasoning": reasoning
        }

    def _parse_insights_response(self, response: str) -> List[Dict[str, Any]]:
        """Parse LLM response for financial insights"""
        # Simple parsing - in production, use structured output
        insights = []
        
        # Split response into sections
        sections = response.split('\n\n')
        
        for section in sections:
            if section.strip():
                insights.append({
                    "type": "insight",
                    "title": "Financial Insight",
                    "description": section.strip(),
                    "confidence": 0.8
                })
        
        return insights

    def _extract_sources(self, context: Dict[str, Any]) -> List[str]:
        """Extract relevant sources from context"""
        sources = []
        
        if "transactions" in context:
            sources.append("Recent Transactions")
        if "budgets" in context:
            sources.append("Budget Data")
        if "goals" in context:
            sources.append("Financial Goals")
        
        return sources
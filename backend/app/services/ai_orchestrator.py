"""
AI Services Orchestrator for FlowsyAI Backend
Manages AI service calls, rate limiting, and response processing
"""

import asyncio
import aiohttp
import time
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from enum import Enum

from app.core.config import settings
from app.core.logging import get_logger
from app.core.exceptions import AIServiceException

logger = get_logger(__name__)


class AIProvider(str, Enum):
    """AI service providers"""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"


@dataclass
class AIRequest:
    """AI request data structure"""
    provider: AIProvider
    model: str
    prompt: str
    max_tokens: int = 1000
    temperature: float = 0.7
    user_id: int = None
    metadata: Dict[str, Any] = None


@dataclass
class AIResponse:
    """AI response data structure"""
    success: bool
    content: Optional[str] = None
    error: Optional[str] = None
    provider: Optional[AIProvider] = None
    model: Optional[str] = None
    tokens_used: int = 0
    processing_time: float = 0.0
    metadata: Dict[str, Any] = None


class AIOrchestrator:
    """AI Services Orchestrator"""
    
    def __init__(self):
        self.session: Optional[aiohttp.ClientSession] = None
        self.rate_limits = {
            AIProvider.OPENAI: {"requests": 0, "reset_time": 0},
            AIProvider.ANTHROPIC: {"requests": 0, "reset_time": 0},
            AIProvider.GOOGLE: {"requests": 0, "reset_time": 0},
        }
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30)
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    async def process_request(self, request: AIRequest) -> AIResponse:
        """Process AI request with appropriate provider"""
        start_time = time.time()
        
        try:
            # Check rate limits
            await self._check_rate_limit(request.provider)
            
            # Route to appropriate provider
            if request.provider == AIProvider.OPENAI:
                response = await self._process_openai(request)
            elif request.provider == AIProvider.ANTHROPIC:
                response = await self._process_anthropic(request)
            elif request.provider == AIProvider.GOOGLE:
                response = await self._process_google(request)
            else:
                raise AIServiceException("unknown", f"Unsupported provider: {request.provider}")
            
            response.processing_time = time.time() - start_time
            return response
            
        except Exception as e:
            logger.error(f"AI request failed: {str(e)}")
            return AIResponse(
                success=False,
                error=str(e),
                provider=request.provider,
                model=request.model,
                processing_time=time.time() - start_time
            )
    
    async def batch_process(self, requests: List[AIRequest]) -> List[AIResponse]:
        """Process multiple AI requests concurrently with optimization"""
        if not requests:
            return []

        # Group requests by provider for optimization
        provider_groups = {}
        for i, request in enumerate(requests):
            provider = request.provider
            if provider not in provider_groups:
                provider_groups[provider] = []
            provider_groups[provider].append((i, request))

        # Process each provider group with rate limiting
        all_responses = [None] * len(requests)

        for provider, provider_requests in provider_groups.items():
            # Batch size based on provider limits
            batch_size = self._get_batch_size(provider)

            for i in range(0, len(provider_requests), batch_size):
                batch = provider_requests[i:i + batch_size]

                # Process batch concurrently
                tasks = [self.process_request(request) for _, request in batch]
                responses = await asyncio.gather(*tasks, return_exceptions=True)

                # Store responses in correct positions
                for j, (original_index, _) in enumerate(batch):
                    response = responses[j]
                    if isinstance(response, Exception):
                        all_responses[original_index] = AIResponse(
                            success=False,
                            error=str(response),
                            provider=batch[j][1].provider,
                            model=batch[j][1].model
                        )
                    else:
                        all_responses[original_index] = response

                # Add delay between batches to respect rate limits
                if i + batch_size < len(provider_requests):
                    await asyncio.sleep(1)

        return all_responses

    def _get_batch_size(self, provider: AIProvider) -> int:
        """Get optimal batch size for provider"""
        batch_sizes = {
            AIProvider.OPENAI: 5,
            AIProvider.ANTHROPIC: 3,
            AIProvider.GOOGLE: 10,
        }
        return batch_sizes.get(provider, 5)

    async def batch_process_optimized(self, requests: List[AIRequest], priority: str = "normal") -> List[AIResponse]:
        """Advanced batch processing with priority and optimization"""
        if not requests:
            return []

        # Sort requests by priority and estimated processing time
        sorted_requests = self._optimize_request_order(requests, priority)

        # Use smart batching
        return await self.batch_process(sorted_requests)

    def _optimize_request_order(self, requests: List[AIRequest], priority: str) -> List[AIRequest]:
        """Optimize request order for better performance"""
        # Sort by provider to group similar requests
        # Then by estimated complexity (token count)
        def sort_key(request):
            provider_priority = {
                AIProvider.OPENAI: 1,
                AIProvider.ANTHROPIC: 2,
                AIProvider.GOOGLE: 3,
            }

            complexity = len(request.prompt) + (request.max_tokens or 1000)

            return (provider_priority.get(request.provider, 999), complexity)

        return sorted(requests, key=sort_key)

    async def process_with_fallback(self, request: AIRequest, fallback_providers: List[AIProvider] = None) -> AIResponse:
        """Process request with fallback providers"""
        providers_to_try = [request.provider]
        if fallback_providers:
            providers_to_try.extend(fallback_providers)

        last_error = None

        for provider in providers_to_try:
            try:
                fallback_request = AIRequest(
                    provider=provider,
                    model=self._get_fallback_model(provider),
                    prompt=request.prompt,
                    max_tokens=request.max_tokens,
                    temperature=request.temperature,
                    user_id=request.user_id,
                    metadata=request.metadata
                )

                response = await self.process_request(fallback_request)
                if response.success:
                    return response

                last_error = response.error

            except Exception as e:
                last_error = str(e)
                continue

        return AIResponse(
            success=False,
            error=f"All providers failed. Last error: {last_error}",
            provider=request.provider,
            model=request.model
        )

    def _get_fallback_model(self, provider: AIProvider) -> str:
        """Get default model for fallback provider"""
        fallback_models = {
            AIProvider.OPENAI: "gpt-3.5-turbo",
            AIProvider.ANTHROPIC: "claude-3-haiku-20240307",
            AIProvider.GOOGLE: "gemini-pro",
        }
        return fallback_models.get(provider, "gpt-3.5-turbo")

    async def estimate_cost(self, requests: List[AIRequest]) -> Dict[str, Any]:
        """Estimate cost for batch of requests"""
        cost_breakdown = {
            "total_cost": 0.0,
            "provider_costs": {},
            "token_estimates": {},
            "request_count": len(requests)
        }

        for request in requests:
            provider_name = request.provider.value

            # Estimate tokens
            input_tokens = len(request.prompt.split()) * 1.3  # Rough estimate
            output_tokens = request.max_tokens or 1000
            total_tokens = input_tokens + output_tokens

            # Cost per 1K tokens (rough estimates)
            cost_per_1k = self._get_cost_per_1k_tokens(request.provider, request.model)
            request_cost = (total_tokens / 1000) * cost_per_1k

            cost_breakdown["total_cost"] += request_cost

            if provider_name not in cost_breakdown["provider_costs"]:
                cost_breakdown["provider_costs"][provider_name] = 0.0
                cost_breakdown["token_estimates"][provider_name] = 0

            cost_breakdown["provider_costs"][provider_name] += request_cost
            cost_breakdown["token_estimates"][provider_name] += total_tokens

        return cost_breakdown

    def _get_cost_per_1k_tokens(self, provider: AIProvider, model: str) -> float:
        """Get cost per 1K tokens for provider/model"""
        costs = {
            AIProvider.OPENAI: {
                "gpt-4": 0.03,
                "gpt-3.5-turbo": 0.002,
                "default": 0.002
            },
            AIProvider.ANTHROPIC: {
                "claude-3-opus-20240229": 0.015,
                "claude-3-sonnet-20240229": 0.003,
                "claude-3-haiku-20240307": 0.00025,
                "default": 0.003
            },
            AIProvider.GOOGLE: {
                "gemini-pro": 0.001,
                "default": 0.001
            }
        }

        provider_costs = costs.get(provider, {"default": 0.002})
        return provider_costs.get(model, provider_costs["default"])

    async def get_usage_analytics(self) -> Dict[str, Any]:
        """Get usage analytics and performance metrics"""
        return {
            "rate_limits": self.rate_limits,
            "performance_metrics": {
                "avg_response_time": 2.5,  # Would be calculated from actual data
                "success_rate": 0.95,
                "error_rate": 0.05,
                "total_requests": 1000,  # Would come from database
            },
            "cost_metrics": {
                "total_cost_today": 15.50,
                "avg_cost_per_request": 0.015,
                "most_expensive_provider": "openai",
            },
            "provider_health": {
                provider.value: {
                    "status": "healthy",
                    "last_error": None,
                    "avg_response_time": 2.0
                } for provider in AIProvider
            }
        }

    async def _check_rate_limit(self, provider: AIProvider):
        """Check and enforce rate limits"""
        current_time = time.time()
        rate_info = self.rate_limits[provider]
        
        # Reset counter if minute has passed
        if current_time - rate_info["reset_time"] > 60:
            rate_info["requests"] = 0
            rate_info["reset_time"] = current_time
        
        # Check if rate limit exceeded
        if rate_info["requests"] >= settings.RATE_LIMIT_PER_MINUTE:
            raise AIServiceException(
                provider.value, 
                "Rate limit exceeded. Please try again later."
            )
        
        rate_info["requests"] += 1
    
    async def _process_openai(self, request: AIRequest) -> AIResponse:
        """Process OpenAI request"""
        if not settings.OPENAI_API_KEY:
            return self._create_mock_response(request, "OpenAI")
        
        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": request.model,
            "messages": [{"role": "user", "content": request.prompt}],
            "max_tokens": request.max_tokens,
            "temperature": request.temperature
        }
        
        async with self.session.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload
        ) as response:
            if response.status == 200:
                data = await response.json()
                return AIResponse(
                    success=True,
                    content=data["choices"][0]["message"]["content"],
                    provider=AIProvider.OPENAI,
                    model=request.model,
                    tokens_used=data.get("usage", {}).get("total_tokens", 0)
                )
            else:
                error_data = await response.json()
                raise AIServiceException("openai", error_data.get("error", {}).get("message", "Unknown error"))
    
    async def _process_anthropic(self, request: AIRequest) -> AIResponse:
        """Process Anthropic request"""
        if not settings.ANTHROPIC_API_KEY:
            return self._create_mock_response(request, "Anthropic")
        
        headers = {
            "x-api-key": settings.ANTHROPIC_API_KEY,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        
        payload = {
            "model": request.model,
            "max_tokens": request.max_tokens,
            "messages": [{"role": "user", "content": request.prompt}]
        }
        
        async with self.session.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json=payload
        ) as response:
            if response.status == 200:
                data = await response.json()
                return AIResponse(
                    success=True,
                    content=data["content"][0]["text"],
                    provider=AIProvider.ANTHROPIC,
                    model=request.model,
                    tokens_used=data.get("usage", {}).get("output_tokens", 0)
                )
            else:
                error_data = await response.json()
                raise AIServiceException("anthropic", error_data.get("error", {}).get("message", "Unknown error"))
    
    async def _process_google(self, request: AIRequest) -> AIResponse:
        """Process Google request"""
        if not settings.GOOGLE_API_KEY:
            return self._create_mock_response(request, "Google")
        
        # Simplified Google AI implementation
        return self._create_mock_response(request, "Google")
    
    def _create_mock_response(self, request: AIRequest, provider_name: str) -> AIResponse:
        """Create mock response for development/demo"""
        mock_content = f"Mock response from {provider_name} {request.model} for prompt: {request.prompt[:50]}..."
        
        return AIResponse(
            success=True,
            content=mock_content,
            provider=request.provider,
            model=request.model,
            tokens_used=len(mock_content.split()) * 2,  # Rough token estimate
            metadata={"mock": True}
        )


# Global orchestrator instance
orchestrator = AIOrchestrator()

export interface FlowToken {
  id: string;
  name: string;
  symbol: string;
  value: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: PlanFeature[];
  popular?: boolean;
  maxAgents: number;
  tokenAmount: number;
}

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface UserSubscription {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
  tokenBalance: number;
}

export const DEFAULT_TOKEN: FlowToken = {
  id: 'flow-token-1',
  name: 'FlowToken',
  symbol: 'FLW',
  value: 1,
};

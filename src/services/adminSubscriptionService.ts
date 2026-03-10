import { api } from "@/lib/api";

export interface AdminSubscription {
  id: string;
  company_name: string;
  plan_name: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
  end_date: string;
  days_until_expiration: number;
  is_valid: boolean;
}

export async function getAdminSubscriptions(): Promise<AdminSubscription[]> {
  return api(`/subscriptions/plans/`, {
    method: "GET",
    credentials: "include",
  });
}
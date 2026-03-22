import { AdminSubscription } from "@/interfaces/iSubscription";
import { api } from "@/lib/api";


export async function getAdminSubscriptions(): Promise<AdminSubscription[]> {
  return api(`/api/v1/plan/`, {
    method: "GET",
    credentials: "include",
  });
}
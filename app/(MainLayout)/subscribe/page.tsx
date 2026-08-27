import type { Metadata } from "next";
import SubscriptionWizard from "@/components/subscribe/SubscriptionWizard";
import { fetchPlansServer } from "@/services/planServerService";
import { fetchActiveAddonsServer } from "@/services/addonServerService";
import { fetchCoveragesServer } from "@/services/coverageServerService";

export const metadata: Metadata = {
  title: "Subscribe to Monthly Cleaning Plan | Cleanix Bangladesh",
  description:
    "Select your B2C or B2B monthly cleaning subscription package (Basic ৳6,000, Standard ৳14,000, Premium ৳30,000), choose Dhaka area & schedule first visit.",
};

interface SubscribePageProps {
  searchParams: Promise<{
    plan?: string;
  }>;
}

export default async function SubscribePage({ searchParams }: SubscribePageProps) {
  const resolvedParams = await searchParams;
  const planId = resolvedParams?.plan || "standard";

  // Server-Side Parallel Data Fetching for Maximum Performance & SSR
  const [initialPlans, initialAddons, initialCoverages] = await Promise.all([
    fetchPlansServer(true),
    fetchActiveAddonsServer(),
    fetchCoveragesServer(),
  ]);

  return (
    <SubscriptionWizard
      initialPlanId={planId}
      initialPlans={initialPlans}
      initialAddons={initialAddons}
      initialCoverages={initialCoverages}
    />
  );
}

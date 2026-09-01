import SubscriptionClientView from "./SubscriptionClientView";
import { fetchMySubscriptionsServer } from "@/services/subscriptionServerService";

export default async function CustomerSubscriptionPage() {
  const initialSubscriptions = await fetchMySubscriptionsServer();

  return <SubscriptionClientView initialSubscriptions={initialSubscriptions} />;
}

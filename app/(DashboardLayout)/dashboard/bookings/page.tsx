import BookingsClientView from "./BookingsClientView";
import { fetchMyBookingsServer } from "@/services/bookingServerService";

export default async function CustomerBookingsPage() {
  const initialBookings = await fetchMyBookingsServer();

  return <BookingsClientView initialBookings={initialBookings} />;
}

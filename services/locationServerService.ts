import { cookies } from "next/headers";
import { ILocationData } from "./locationService";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchMyLocationsServer = async (): Promise<ILocationData[]> => {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("cleanix_token")?.value ||
      cookieStore.get("accessToken")?.value;

    if (!token) return [];

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/locations/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map((loc: any) => ({
        ...loc,
        id: loc._id || loc.id,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error in fetchMyLocationsServer:", error);
    return [];
  }
};

import { cookies } from "next/headers";
import { ICleanerProfile, mapCleanerProfile } from "./cleanerService";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchCleanersServer = async (): Promise<ICleanerProfile[]> => {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("cleanix_token")?.value ||
      cookieStore.get("accessToken")?.value;

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cleaners`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapCleanerProfile);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchCleanersServer:", error);
    return [];
  }
};

import { cookies } from "next/headers";
import { TeamSquad, RegisteredCleaner, mapTeamSquad, mapRegisteredCleaner } from "./teamService";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchTeamsServer = async (): Promise<TeamSquad[]> => {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("cleanix_token")?.value ||
      cookieStore.get("accessToken")?.value;

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapTeamSquad);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchTeamsServer:", error);
    return [];
  }
};

export const fetchCleanersServer = async (): Promise<RegisteredCleaner[]> => {
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
      return data.data.map(mapRegisteredCleaner);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchCleanersServer:", error);
    return [];
  }
};

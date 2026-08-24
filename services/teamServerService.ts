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

export const fetchTeamByIdOrSlugServer = async (idOrSlug: string): Promise<TeamSquad | null> => {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("cleanix_token")?.value ||
      cookieStore.get("accessToken")?.value;

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/teams/${idOrSlug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && data?.data) {
      return mapTeamSquad(data.data);
    }

    // Fallback: search in all teams list
    const teams = await fetchTeamsServer();
    const found = teams.find(
      (t) =>
        t.id === idOrSlug ||
        t.teamCode.toLowerCase() === idOrSlug.toLowerCase() ||
        t.teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-") === idOrSlug.toLowerCase()
    );
    return found || (teams.length > 0 ? teams[0] : null);
  } catch (error) {
    console.error("Error in fetchTeamByIdOrSlugServer:", error);
    return null;
  }
};

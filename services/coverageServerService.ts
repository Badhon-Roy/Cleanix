import { cookies } from "next/headers";
import { ICoverageArea, mapCoverageArea } from "./coverageService";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchCoveragesServer = async (): Promise<ICoverageArea[]> => {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("cleanix_token")?.value ||
      cookieStore.get("accessToken")?.value;

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/coverage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapCoverageArea);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchCoveragesServer:", error);
    return [];
  }
};

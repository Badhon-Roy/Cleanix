import { cookies } from "next/headers";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchCustomerProfileServer = async () => {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("cleanix_token")?.value ||
      cookieStore.get("accessToken")?.value;

    if (!token) return null;

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/customers/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && data?.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error in fetchCustomerProfileServer:", error);
    return null;
  }
};

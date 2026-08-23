const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const fetchPricingConfigServer = async () => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/pricing`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (data?.success && data?.data) {
      return data.data;
    }
    return { baseFee: 1500, sqftRate: 2.5, bedroomRate: 500, bathroomRate: 400 };
  } catch (error) {
    console.error("Error in fetchPricingConfigServer:", error);
    return { baseFee: 1500, sqftRate: 2.5, bedroomRate: 500, bathroomRate: 400 };
  }
};

import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export interface LeaderAppointmentItem {
  id: string;
  team: {
    id: string;
    teamCode: string;
    teamName: string;
    teamImage: string;
    commissionRate: number;
    cleanerPoolShare: number;
    adminShare: number;
    status: string;
    leaderRequestStatus: string;
    zone?: {
      id: string;
      zoneName: string;
      district?: string;
    };
  };
  cleaner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  commissionRate: number;
  cleanerPoolShare: number;
  adminShare: number;
  createdAt?: string;
}

export const mapLeaderAppointment = (data: any): LeaderAppointmentItem | null => {
  if (!data) return null;
  const teamObj = typeof data.team === "object" && data.team !== null ? data.team : {};
  const cleanerObj = typeof data.cleaner === "object" && data.cleaner !== null ? data.cleaner : {};
  const zoneObj = typeof teamObj.zone === "object" && teamObj.zone !== null ? teamObj.zone : {};

  const commRate = teamObj.commissionRate ?? 10;
  const poolShare = teamObj.cleanerPoolShare ?? 40;
  const admShare = teamObj.adminShare ?? 50;

  return {
    id: data._id || data.id || "",
    team: {
      id: teamObj._id || teamObj.id || "",
      teamCode: teamObj.teamCode || "",
      teamName: teamObj.teamName || "",
      teamImage: teamObj.teamImage || "",
      commissionRate: commRate,
      cleanerPoolShare: poolShare,
      adminShare: admShare,
      status: teamObj.status || "ACTIVE",
      leaderRequestStatus: teamObj.leaderRequestStatus || data.status || "PENDING",
      zone: {
        id: zoneObj._id || zoneObj.id || "",
        zoneName: zoneObj.zoneName || "Coverage Zone",
        district: zoneObj.district || "Dhaka",
      },
    },
    cleaner: {
      id: cleanerObj._id || cleanerObj.id || "",
      name: cleanerObj.name || "",
      email: cleanerObj.email || "",
      phone: cleanerObj.phone || "",
    },
    status: data.status || "PENDING",
    commissionRate: commRate,
    cleanerPoolShare: poolShare,
    adminShare: admShare,
    createdAt: data.createdAt,
  };
};

export const fetchMyPendingAppointmentAPI = async (): Promise<LeaderAppointmentItem | null> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/leader-appointments/my-pending`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && data?.data) {
      return mapLeaderAppointment(data.data);
    }
    return null;
  } catch (error) {
    console.error("Error in fetchMyPendingAppointmentAPI:", error);
    return null;
  }
};

export const fetchMyAppointmentHistoryAPI = async (): Promise<LeaderAppointmentItem[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/leader-appointments/my-history`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data
        .map(mapLeaderAppointment)
        .filter((item: LeaderAppointmentItem | null): item is LeaderAppointmentItem => item !== null);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchMyAppointmentHistoryAPI:", error);
    return [];
  }
};

export const respondAppointmentAPI = async (
  appointmentId: string,
  action: "ACCEPT" | "DECLINE"
) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/leader-appointments/${appointmentId}/respond`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ action }),
  });
  return res.json();
};

import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  role: "TEAM_LEADER" | "CLEANER";
}

export interface RegisteredCleaner {
  id: string;
  userId: string;
  name: string;
  phone: string;
  role: "TEAM_LEADER" | "CLEANER";
  rating: number;
}

export interface TeamSquad {
  id: string;
  teamCode: string;
  teamName: string;
  teamImage: string;
  leader: {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    rating: number;
  };
  members: TeamMember[];
  zone: {
    id: string;
    zoneName: string;
    district?: string;
  };
  zoneId: string; // Required CoverageArea ObjectId
  commissionRate: number; // 10%
  cleanerPoolShare: number; // 40%
  adminShare: number; // 50%
  leaderRequestStatus?: "PENDING" | "ACCEPTED" | "DECLINED";
  status: "ACTIVE" | "INACTIVE";
  completedJobsCount: number;
}

export interface CreateTeamPayload {
  teamCode: string;
  teamName: string;
  teamImage: string;
  leader: string;
  members: string[];
  zone: string; // Required CoverageArea ObjectId reference
  commissionRate: number;
  cleanerPoolShare: number;
  adminShare: number;
  status?: "ACTIVE" | "INACTIVE";
}

export const mapTeamSquad = (t: any): TeamSquad => {
  const zoneObj = typeof t.zone === "object" && t.zone !== null ? t.zone : null;
  const zoneId = zoneObj?._id || zoneObj?.id || (typeof t.zone === "string" ? t.zone : "");
  const zoneName = zoneObj?.zoneName || (typeof t.zone === "string" ? t.zone : "Coverage Zone");

  const leaderObj = typeof t.leader === "object" && t.leader !== null ? t.leader : null;

  return {
    id: t._id || t.id || "",
    teamCode: t.teamCode || "",
    teamName: t.teamName || "",
    teamImage: t.teamImage || "",
    leader: {
      id: leaderObj?._id || leaderObj?.id || (typeof t.leader === "string" ? t.leader : ""),
      userId: leaderObj?.user?._id || leaderObj?.user?.id || leaderObj?._id || leaderObj?.id || (typeof t.leader === "string" ? t.leader : ""),
      name: leaderObj?.name || leaderObj?.user?.name || "",
      email: leaderObj?.email || leaderObj?.user?.email || "",
      phone: leaderObj?.phone || leaderObj?.user?.phone || "",
      rating: leaderObj?.rating ?? 5.0,
    },
    members: Array.isArray(t.members)
      ? t.members.map((m: any) => ({
          id: m._id || m.id || "",
          name: m.name || "",
          phone: m.phone || "",
          role: (m.role || "CLEANER") as "CLEANER" | "TEAM_LEADER",
        }))
      : [],
    zone: {
      id: zoneId,
      zoneName: zoneName,
      district: zoneObj?.district || "Dhaka",
    },
    zoneId: zoneId,
    commissionRate: t.commissionRate ?? 10,
    cleanerPoolShare: t.cleanerPoolShare ?? 40,
    adminShare: t.adminShare ?? 50,
    leaderRequestStatus: (t.leaderRequestStatus || "PENDING") as "PENDING" | "ACCEPTED" | "DECLINED",
    status: (t.status || "ACTIVE") as "ACTIVE" | "INACTIVE",
    completedJobsCount: t.completedJobsCount ?? 0,
  };
};
export const mapRegisteredCleaner = (c: any): RegisteredCleaner => ({
  id: c._id || c.id || "",
  userId: c.user?._id || c.user?.id || c._id || c.id || "",
  name: c.user?.name || c.name || "",
  phone: c.user?.phone || c.phone || "",
  role: (c.user?.role || "CLEANER") as "CLEANER" | "TEAM_LEADER",
  rating: c.rating ?? 5.0,
});

// Client-side API Calls
export const fetchAllTeamsAPI = async (): Promise<TeamSquad[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/teams`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapTeamSquad);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchAllTeamsAPI:", error);
    return [];
  }
};

export const fetchAllCleanersAPI = async (): Promise<RegisteredCleaner[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/cleaners`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    if (data?.success && Array.isArray(data?.data)) {
      return data.data.map(mapRegisteredCleaner);
    }
    return [];
  } catch (error) {
    console.error("Error in fetchAllCleanersAPI:", error);
    return [];
  }
};

export const createTeamAPI = async (payload: CreateTeamPayload) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/teams`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateTeamAPI = async (id: string, payload: Partial<CreateTeamPayload>) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/teams/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const respondLeaderRequestAPI = async (teamId: string, action: "ACCEPT" | "DECLINE") => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/teams/${teamId}/leader-request`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ action }),
  });
  return res.json();
};

export const deleteTeamAPI = async (id: string) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/teams/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
};

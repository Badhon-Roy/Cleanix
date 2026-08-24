export interface IGoogleLoginPayload {
  email: string;
  name?: string;
  avatar?: string;
  role?: "CUSTOMER" | "CLEANER" | "ADMIN" | "TEAM_LEADER";
  phone?: string;
}

export interface ILoginPayload {
  email: string;
  password?: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: "CUSTOMER" | "CLEANER" | "ADMIN" | "TEAM_LEADER";
  avatar?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
}

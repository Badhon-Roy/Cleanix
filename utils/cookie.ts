// Cookie Helper Utilities for Authentication Tokens and User State

export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window !== "undefined") {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }
};

export const getCookie = (name: string): string => {
  if (typeof window !== "undefined") {
    const prefix = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(prefix) === 0) {
        return c.substring(prefix.length, c.length);
      }
    }
  }
  return "";
};

export const removeCookie = (name: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  }
};

// Auth specific cookie helpers
export const setAuthToken = (token: string, days = 7) => {
  setCookie("cleanix_token", token, days);
};

export const getAuthToken = () => {
  return getCookie("cleanix_token");
};

export const removeAuthToken = () => {
  removeCookie("cleanix_token");
};

export const setAuthUser = (user: any, days = 7) => {
  if (!user) return;
  const cleanUser = { ...user };
  if (cleanUser.avatar && typeof cleanUser.avatar === "string" && cleanUser.avatar.startsWith("data:")) {
    delete cleanUser.avatar;
  }
  setCookie("cleanix_user", JSON.stringify(cleanUser), days);
};

export const getAuthUser = () => {
  const data = getCookie("cleanix_user");
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
};

export const removeAuthUser = () => {
  removeCookie("cleanix_user");
};

export const setAuthRole = (role: string, days = 7) => {
  setCookie("cleanix_role", role, days);
};

export const getAuthRole = () => {
  return getCookie("cleanix_role");
};

export const removeAuthRole = () => {
  removeCookie("cleanix_role");
};

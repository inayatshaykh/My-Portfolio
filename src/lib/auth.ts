// Simple client-side auth — credentials checked against env vars with hardcoded fallback
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@gmail.com";
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Vapix.Shaykh";

const SESSION_KEY = "admin_session";

export function login(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export const DUMMY_ID = "user1";
export const DUMMY_PW = "1234";

const KEY = "dtv_auth_v1";

export function isLoggedIn(): boolean {
  return localStorage.getItem(KEY) === "1";
}

export function loginDummy(id: string, pw: string): boolean {
  if (id === DUMMY_ID && pw === DUMMY_PW) {
    localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(KEY);
}

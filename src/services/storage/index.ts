export const STORAGE_KEY = {
  accessToken: "YWNjZXNzLXRva2Vu",
  refreshToken: "cmVmcmVzaC10b2tlbg==",
  isLoggedIn: "aXMtbG9nZ2VkLWlu",
};

export const authStorage = {
  getAccessToken() {
    return localStorage.getItem(STORAGE_KEY.accessToken);
  },
  setAccessToken(t: string) {
    localStorage.setItem(STORAGE_KEY.accessToken, t);
  },
  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEY.refreshToken);
  },
  setRefreshToken(t: string) {
    localStorage.setItem(STORAGE_KEY.refreshToken, t);
  },
  setIsLoggedIn(v?: boolean) {
    localStorage.setItem(STORAGE_KEY.isLoggedIn, v ? "true" : "false");
  },
  getIsLoggedIn() {
    return localStorage.getItem(STORAGE_KEY.isLoggedIn) === "true";
  },
};

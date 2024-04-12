export const STORAGE_KEY = {
  accessToken: "_act",
};

export const authStorage = {
  getAccessToken() {
    return localStorage.getItem(STORAGE_KEY.accessToken);
  },
  setAccessToken(t: string) {
    localStorage.setItem(STORAGE_KEY.accessToken, t);
  },
};

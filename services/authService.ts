import api from "@/lib/axiosInstance";

export const authService = {
  localSignUp: (payload: {
    email: string;
    password: string;
  }): Promise<void> => {
    return api.post("/auth/signup", payload, {
      _retry: true,
      public: true, //public methods never performs an auto auth refresh
    });
  },

  localLogin: (payload: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> => {
    return api.post("/auth/login", payload, {
      _retry: true,
      public: true,
    });
  },

  refresh: (): Promise<{ accessToken: string }> => {
    return api.get("/auth/refresh", {
      withCredentials: true,
      _retry: true,
      public: true,
    });
  },

  logout: () => {
    return api.post("/auth/logout");
  },

  exchangeAuthCode: (payload: { code: string }) => {
    return api.post("/auth/exchange", payload, {
      _retry: true,
      public: true,
    });
  },
};

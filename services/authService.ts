import api from "@/lib/axiosInstance";
import { useAuthStore } from "@/store/authStore";

class AuthService {
    async refresh(): Promise<string> {
        const { data } = await api.post<{ accessToken: string }>(
          "/auth/refresh",
          {},
          { withCredentials: true, _retry: true }
        );
    
        if (!data?.accessToken) throw new Error("Invalid refresh response");
    
        useAuthStore.getState().updateToken(data.accessToken);
        return data.accessToken;
      }
}
export const authService = new AuthService();
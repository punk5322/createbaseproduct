import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { UserResponse, User } from "@shared/schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await axios.get<User>("/api/user");
        return response.data;
      } catch (error) {
        // If 401 unauthorized, this is expected when not logged in
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null as unknown as User;
        }
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: false
  });

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<User>("/api/login", {
        username,
        password
      });
      setIsLoading(false);
      queryClient.setQueryData(["user"], response.data);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      const err = error instanceof Error ? error : new Error("An error occurred during login");
      setError(err);
      throw err;
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<User>("/api/register", userData);
      setIsLoading(false);
      queryClient.setQueryData(["user"], response.data);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      const err = error instanceof Error ? error : new Error("An error occurred during registration");
      setError(err);
      throw err;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post("/api/logout");
      queryClient.setQueryData(["user"], null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const err = error instanceof Error ? error : new Error("An error occurred during logout");
      setError(err);
      throw err;
    }
  };

  const value = {
    user: user || null,
    isLoading: isLoading || isUserLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
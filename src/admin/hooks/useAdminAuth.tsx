// src/admin/hooks/useAdminAuth.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { adminApi } from "../services/adminApi";
import { AdminUser } from "../types";

interface AdminAuthContextType {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: any) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Initial verification from localStorage
    const savedToken = localStorage.getItem("bookworm_admin_token");
    const savedUser = localStorage.getItem("bookworm_admin_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      
      // Optionally verify token validity with backend
      adminApi.verifyToken()
        .then((res) => {
          if (!res.valid) {
            handleLogout();
          }
        })
        .catch(() => {
          // In case of error (e.g. backend offline), we keep the local session or log out
          // For now, let's log out if backend active rejects it
          handleLogout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      // If we are on an admin page that isn't login, redirect to login
      if (router.pathname.startsWith("/admin") && router.pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bookworm_admin_token");
    localStorage.removeItem("bookworm_admin_user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  const login = async (payload: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await adminApi.login(payload);
      if (res.status === "success" && res.token) {
        localStorage.setItem("bookworm_admin_token", res.token);
        localStorage.setItem("bookworm_admin_user", JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        setIsAuthenticated(true);
        router.push("/admin/dashboard");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Admin login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    handleLogout();
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

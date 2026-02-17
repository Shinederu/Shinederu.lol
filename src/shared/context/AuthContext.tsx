import { createContext, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useAuth } from "@shinederu/auth-react";
import { AuthUser } from "@shinederu/auth-core";

type AuthDataType = {
  isLoggedIn: boolean;
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  role: string;
  created_at: string;
};

interface AuthContextType extends AuthDataType {
  setAuthData: (authData: Partial<AuthDataType>) => void;
  reload: () => Promise<boolean>;
}

const EMPTY_AUTH: AuthDataType = {
  isLoggedIn: false,
  id: 0,
  username: "",
  email: "",
  avatar_url: "",
  role: "",
  created_at: "",
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
};

const mapUserToAuthData = (isLoggedIn: boolean, user: AuthUser | null | undefined): AuthDataType => {
  if (!isLoggedIn || !user) return EMPTY_AUTH;

  return {
    isLoggedIn: true,
    id: toNumber(user.id),
    username: String(user.username ?? ""),
    email: String(user.email ?? ""),
    avatar_url: String(user.avatar_url ?? ""),
    role: String(user.role ?? ""),
    created_at: String(user.created_at ?? ""),
  };
};

export const AuthContext = createContext<AuthContextType>({
  ...EMPTY_AUTH,
  setAuthData: () => {
    // no-op
  },
  reload: async () => false,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuth();
  const [overrideData, setOverrideData] = useState<Partial<AuthDataType>>({});

  const setAuthData = useCallback((newData: Partial<AuthDataType>) => {
    setOverrideData((prev) => ({ ...prev, ...newData }));
  }, []);

  const reload = useCallback(async (): Promise<boolean> => {
    if (import.meta.env.VITE_DEV_MODE === "true") {
      setOverrideData({
        isLoggedIn: true,
        id: 1,
        username: "Administrator",
        email: "Thing@Shinederu.lol",
        avatar_url: "",
        role: "user",
        created_at: "2024-01-01T00:00:00Z",
      });
      return true;
    }

    const response = await auth.me();

    if (response.ok) {
      setOverrideData({});
      return true;
    }

    setOverrideData(EMPTY_AUTH);
    return false;
  }, [auth]);

  const baseData = useMemo(() => mapUserToAuthData(auth.isAuthenticated, auth.user), [auth.isAuthenticated, auth.user]);

  const contextValue: AuthContextType = {
    ...baseData,
    ...overrideData,
    setAuthData,
    reload,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

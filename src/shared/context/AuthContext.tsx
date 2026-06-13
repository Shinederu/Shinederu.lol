import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@shinederu/auth-react";
import { AuthUser } from "@shinederu/auth-core";

type AuthDataType = {
  isLoggedIn: boolean;
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  role: string;
  is_admin: boolean;
  can_manage_users: boolean;
  can_manage_announcements: boolean;
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
  is_admin: false,
  can_manage_users: false,
  can_manage_announcements: false,
  created_at: "",
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
};

const toBool = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  const v = String(value).trim().toLowerCase();
  return ["1", "true", "yes", "on", "admin"].includes(v);
};

const hasProjectPermission = (user: AuthUser, project: string, permission: string): boolean => {
  const access = user.project_access;
  const permissions = access?.permissions;
  const projectPermissions = permissions?.[project];

  if (!projectPermissions || typeof projectPermissions !== "object") {
    return false;
  }

  return toBool(projectPermissions[permission]);
};

const mapUserToAuthData = (isLoggedIn: boolean, user: AuthUser | null | undefined): AuthDataType => {
  if (!isLoggedIn || !user) return EMPTY_AUTH;

  const role = String(user.role ?? "").toLowerCase();
  const isGlobalAdmin = toBool(user.is_admin) || role === "admin" || toBool(user.project_access?.is_global_admin);

  return {
    isLoggedIn: true,
    id: toNumber(user.id),
    username: String(user.username ?? ""),
    email: String(user.email ?? ""),
    avatar_url: String(user.avatar_url ?? ""),
    role,
    is_admin: isGlobalAdmin,
    can_manage_users: isGlobalAdmin || hasProjectPermission(user, "auth", "users_manage"),
    can_manage_announcements: isGlobalAdmin || hasProjectPermission(user, "main", "announcements_manage"),
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
  const authRef = useRef(auth);
  const [overrideData, setOverrideData] = useState<Partial<AuthDataType>>({});

  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  const setAuthData = useCallback((newData: Partial<AuthDataType>) => {
    setOverrideData((prev) => ({ ...prev, ...newData }));
  }, []);

  const reload = useCallback(async (): Promise<boolean> => {
    if (import.meta.env.VITE_DEV_MODE === "true") {
      setOverrideData({
        isLoggedIn: true,
        id: 1,
        username: "Administrator",
        email: "Thing@Shinederu.ch",
        avatar_url: "",
        role: "user",
        is_admin: false,
        can_manage_users: false,
        can_manage_announcements: false,
        created_at: "2024-01-01T00:00:00Z",
      });
      return true;
    }

    const response = await authRef.current.me();

    if (response.ok) {
      setOverrideData({});
      return true;
    }

    setOverrideData(EMPTY_AUTH);
    return false;
  }, []);

  const baseData = useMemo(() => mapUserToAuthData(auth.isAuthenticated, auth.user), [auth.isAuthenticated, auth.user]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      ...baseData,
      ...overrideData,
      setAuthData,
      reload,
    }),
    [baseData, overrideData, setAuthData, reload]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

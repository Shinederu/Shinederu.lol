import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { useHttpClient } from '@/shared/hooks/http-hook';

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

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    id: 0,
    username: '',
    email: '',
    avatar_url: '',
    role: '',
    created_at: '',
    setAuthData: () => { },
    reload: async () => false,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const { sendRequest } = useHttpClient();
    const [authData, setAuthData] = useState<AuthDataType>({
        isLoggedIn: false,
        id: 0,
        username: '',
        email: '',
        avatar_url: '',
        role: '',
        created_at: '',
    });

    const updateAuthData = useCallback((newData: Partial<AuthDataType>) => {
        setAuthData(prev => ({ ...prev, ...newData }));
    }, []);

    const reload = useCallback(async (): Promise<boolean> => {
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            updateAuthData({
                isLoggedIn: true,
                id: 1,
                username: "Administrator",
                email: "Thing@Shinederu.lol",
                avatar_url: "",
                role: "user",
                created_at: "2024-01-01T00:00:00Z",
            });
            return true;
        } else {
            let ok = true;
            await sendRequest({
                key: 3,
                url: import.meta.env.VITE_SHINEDERU_API_AUTH_URL,
                method: 'GET',
                body: { action: 'me' },
                onSuccess: (response) => {
                    console.log("Auth data reloaded:", response.data);
                    updateAuthData({
                        isLoggedIn: true,
                        id: response.data.user.id,
                        username: response.data.user.username,
                        email: response.data.user.email,
                        avatar_url: response.data.user.avatar_url,
                        role: response.data.user.role,
                        created_at: response.data.user.created_at,
                    });
                },
                onError: () => {
                    ok = false;
                    updateAuthData({
                        isLoggedIn: false,
                        id: 0,
                        username: '',
                        email: '',
                        avatar_url: '',
                        role: '',
                        created_at: '',
                    });
                },
            });

            return ok;
        }
    }, [sendRequest, updateAuthData]);

    const contextValue: AuthContextType = {
        ...authData,
        setAuthData: updateAuthData,
        reload,
    };

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

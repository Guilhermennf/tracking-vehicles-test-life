"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface User {
    id: string;
    name: string;
    username: string;
}

// Helper function to decode JWT
const decodeJWT = (token: string): any => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};

interface AuthContextType {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    // Check token synchronously before any rendering
    const hasValidToken = () => {
        if (typeof window === "undefined") return false; // Handle SSR
        return !!localStorage.getItem("token");
    };

    // Enhanced protection check
    const isProtectedRoute = () => {
        return ["/dashboard", "/tracking", "/vehicles", "/settings"].some(
            (route) => pathname?.startsWith(route)
        );
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        const isCurrentRouteProtected = isProtectedRoute();
        const isLoginPage = pathname === "/";

        if (storedToken) {
            setToken(storedToken);
            if (storedRefreshToken) {
                setRefreshToken(storedRefreshToken);
            }

            if (isLoginPage) {
                router.push("/dashboard");
            }

            fetchUserData(storedToken);
        } else {
            if (isCurrentRouteProtected) {
                // Redirect immediately if token is missing
                router.replace("/");
                toast({
                    title: "Acesso restrito",
                    description:
                        "Você precisa estar logado para acessar esta página",
                    variant: "destructive",
                });
            }
            setIsLoading(false);
        }
    }, [router, pathname]);

    const fetchUserData = async (token: string) => {
        try {
            const response = await fetch("/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();

                if (data.access) {
                    localStorage.setItem("token", data.access);
                    setToken(data.access);

                    const decodedToken = decodeJWT(data.access);
                    if (decodedToken && decodedToken.user_id) {
                        setUser({
                            id: decodedToken.user_id.toString(),
                            name: decodedToken.name || "User",
                            username: decodedToken.username || "username",
                        });
                    }
                }

                if (data.refresh) {
                    localStorage.setItem("refreshToken", data.refresh);
                    setRefreshToken(data.refresh);
                }
            } else {
                logout();
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast({
                    title: "Erro de autenticação",
                    description: data.message || "Credenciais inválidas",
                    variant: "destructive",
                });
                return;
            }

            localStorage.setItem("token", data.access);
            setToken(data.access);

            if (data.refresh) {
                localStorage.setItem("refreshToken", data.refresh);
                setRefreshToken(data.refresh);
            }

            // Decode token to get user info
            const decodedToken = decodeJWT(data.access);
            if (decodedToken && decodedToken.user_id) {
                setUser({
                    id: decodedToken.user_id.toString(),
                    name: decodedToken.name || "User",
                    username: decodedToken.username || "username",
                });
            } else if (data.user) {
                setUser(data.user);
            }
            toast({
                title: "Sucesso",
                description: "Login realizado com sucesso",
            });
            router.push("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider
            value={{ user, token, refreshToken, isLoading, login, logout }}
        >
            {isProtectedRoute()
                ? hasValidToken() && (!isLoading || user)
                    ? children
                    : null
                : children}
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

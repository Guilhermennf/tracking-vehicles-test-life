"use client";

import type React from "react";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";

interface LoginFormState {
    username: string;
    password: string;
    errors: {
        username?: string;
        password?: string;
    };
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    validate: () => boolean;
    reset: () => void;
}

const useLoginFormStore = create<LoginFormState>((set, get) => ({
    username: "",
    password: "",
    errors: {},

    setUsername: (username) =>
        set({
            username,
            errors: { ...get().errors, username: undefined },
        }),

    setPassword: (password) =>
        set({
            password,
            errors: { ...get().errors, password: undefined },
        }),

    validate: () => {
        const { username, password } = get();
        const errors: { username?: string; password?: string } = {};
        let isValid = true;

        if (!username.trim()) {
            errors.username = "Usuário é obrigatório";
            isValid = false;
        }

        if (!password.trim()) {
            errors.password = "Senha é obrigatória";
            isValid = false;
        }

        set({ errors });
        return isValid;
    },

    reset: () => set({ username: "", password: "", errors: {} }),
}));

export function LoginForm() {
    const {
        username,
        password,
        errors,
        setUsername,
        setPassword,
        validate,
        reset,
    } = useLoginFormStore();
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            await login(username, password);
        }
    };

    return (
        <Card className="w-full max-w-md border-gray-200 dark:border-gray-800">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                    Rastreador de Veículos
                </CardTitle>
                <CardDescription>
                    Digite suas credenciais para acessar sua conta
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Usuário</Label>
                        <Input
                            id="username"
                            placeholder="Digite seu usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            required
                            className={errors.username ? "border-red-500" : ""}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">
                                {errors.username}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

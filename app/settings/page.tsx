"use client";

import { useTheme } from "next-themes";
import { Check } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Tema"
                text="Escolha o tema da interface do usuário"
            />

            <div className="grid grid-cols-2 gap-4 max-w-lg">
                <div
                    className={`cursor-pointer ${
                        theme === "light" ? "ring-2 ring-white" : ""
                    }`}
                    onClick={() => setTheme("light")}
                >
                    <div className="border border-gray-700 rounded-md p-4 bg-white">
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded-md w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                        </div>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                <div className="h-3 bg-gray-200 rounded-md w-3/4"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                <div className="h-3 bg-gray-200 rounded-md w-2/3"></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-2">Claro</div>
                </div>

                <div
                    className={`cursor-pointer relative ${
                        theme === "dark" ? "ring-2 ring-white" : ""
                    }`}
                    onClick={() => setTheme("dark")}
                >
                    <div className="border border-gray-700 rounded-md p-4 bg-[#1e2b3f]">
                        <div className="space-y-2">
                            <div className="h-3 bg-[#3a4a63] rounded-md w-3/4"></div>
                            <div className="h-3 bg-[#3a4a63] rounded-md w-1/2"></div>
                        </div>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-[#5a6a83]"></div>
                                <div className="h-3 bg-[#3a4a63] rounded-md w-3/4"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-[#5a6a83]"></div>
                                <div className="h-3 bg-[#3a4a63] rounded-md w-2/3"></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-2">Escuro</div>
                    {theme === "dark" && (
                        <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                            <Check className="h-4 w-4 text-black" />
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}

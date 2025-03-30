import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "Rastreamento de Veículos",
    description: "Rastreie seus veículos em tempo real",
    icons: {
        icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhci1mcm9udC1pY29uIGx1Y2lkZS1jYXItZnJvbnQiPjxwYXRoIGQ9Im0yMSA4LTIgMi0xLjUtMy43QTIgMiAwIDAgMCAxNS42NDYgNUg4LjRhMiAyIDAgMCAwLTEuOTAzIDEuMjU3TDUgMTAgMyA4Ii8+PHBhdGggZD0iTTcgMTRoLjAxIi8+PHBhdGggZD0iTTE3IDE0aC4wMSIvPjxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSI4IiB4PSIzIiB5PSIxMCIgcng9IjIiLz48cGF0aCBkPSJNNSAxOHYyIi8+PHBhdGggZD0iTTE5IDE4djIiLz48L3N2Zz4=",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                >
                    <AuthProvider>{children}</AuthProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}

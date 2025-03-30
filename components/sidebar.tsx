"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Home, MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: Home,
        },
        {
            name: "Veículos",
            href: "/vehicles",
            icon: Car,
        },
        {
            name: "Rastreamento",
            href: "/tracking",
            icon: MapPin,
        },
    ];

    return (
        <div className={cn("flex h-full w-full flex-col", className)}>
            <div className="flex h-14 items-center border-b px-4">
                <Link
                    href="/dashboard"
                    className="flex items-center font-semibold"
                >
                    <span className="text-xl">Rastreador de Veículos</span>
                </Link>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            pathname === item.href ||
                                pathname.startsWith(`${item.href}/`)
                                ? "bg-muted text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-primary"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>
            <div className="border-t p-4">
                <UserNav />
            </div>
        </div>
    );
}

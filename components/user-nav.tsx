"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth";
import { LogOut, Settings } from "lucide-react";

export function UserNav() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const initials = user ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex justify-start items-center w-full gap-2 px-2"
                >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-left">{user?.name || "Usuário"}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user?.name || "Usuário"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            usuario@exemplo.com
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings /> Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

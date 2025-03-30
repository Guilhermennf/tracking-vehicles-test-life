import type React from "react";
import { UserNav } from "@/components/user-nav";
import { Sidebar } from "@/components/sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50 md:border-r md:bg-background">
                <Sidebar />
            </div>

            <header className="sticky top-0 z-40 bg-background md:pl-64 md:hidden">
                <div className="flex h-14 items-center p-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Abrir menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <main className="flex-1 space-y-4 p-4 pt-6 md:pl-64 md:ml-4">
                {children}
            </main>
        </div>
    );
}

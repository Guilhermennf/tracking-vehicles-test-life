import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Rastreamento de Veículos"
                text="Rastreie seus veículos em tempo real"
            />
            <div className="grid gap-4 grid-cols-1">
                <Skeleton className="h-[600px] w-full" />
            </div>
        </DashboardShell>
    );
}

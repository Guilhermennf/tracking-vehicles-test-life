import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardKpis } from "@/components/dashboard/dashboard-kpis";

export default function DashboardPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Dashboard"
                text="Visão geral da sua frota de veículos"
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardKpis />
            </div>
        </DashboardShell>
    );
}

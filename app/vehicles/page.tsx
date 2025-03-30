"use client";

import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { VehiclesList } from "@/components/vehicles/vehicles-list";
import { VehicleDialog } from "@/components/vehicles/vehicle-dialog";
import { useVehicleStore } from "@/lib/store/vehicleStore";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function VehiclesPage() {
    const { isAddDialogOpen, setAddDialogOpen, toastMessage, clearToast } =
        useVehicleStore();

    const { toast } = useToast();

    useEffect(() => {
        if (toastMessage) {
            toast({
                title: toastMessage.title,
                description: toastMessage.description,
                variant: toastMessage.variant,
            });
            clearToast();
        }
    }, [toastMessage, toast, clearToast]);

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Veículos"
                text="Gerencie sua frota de veículos"
            >
                <Button onClick={() => setAddDialogOpen(true)}>
                    Adicionar Veículo
                </Button>
            </DashboardHeader>
            <VehiclesList />
            <VehicleDialog
                open={isAddDialogOpen}
                onOpenChange={setAddDialogOpen}
                isCreating={true}
            />
        </DashboardShell>
    );
}

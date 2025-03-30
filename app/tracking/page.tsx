"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleTrackingMap } from "@/components/tracking/vehicle-tracking-map";
import { VehicleSelector } from "@/components/tracking/vehicle-selector";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TrackingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
        null
    );
    const searchParams = useSearchParams();

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Rastreamento de Veículos"
                text="Rastreie seus veículos em tempo real"
            />

            <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Funcionalidade não desenvolvida</AlertTitle>
                <AlertDescription>
                    O rastreamento em tempo real está temporariamente
                    indisponível porque a API não fornece as coordenadas
                    geográficas (latitude e longitude) necessárias para exibir
                    os veículos no mapa.
                </AlertDescription>
            </Alert>

            {/* <div className="grid gap-4 grid-cols-1">
                {isLoading ? (
                    <Skeleton className="h-[600px] w-full" />
                ) : (
                    <Card className="p-0 overflow-hidden">
                        <div className="p-4 border-b">
                            <VehicleSelector
                                vehicles={[]}
                                selectedVehicleId={selectedVehicleId}
                                onSelect={setSelectedVehicleId}
                            />
                        </div>
                        <VehicleTrackingMap
                            vehicles={[]}
                            selectedVehicleId={selectedVehicleId}
                        />
                    </Card>
                )}
            </div> */}
        </DashboardShell>
    );
}

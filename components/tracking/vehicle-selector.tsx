"use client";

import type { Vehicle } from "@/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface VehicleSelectorProps {
    vehicles: Vehicle[];
    selectedVehicleId: string | null;
    onSelect: (id: string) => void;
}

export function VehicleSelector({
    vehicles,
    selectedVehicleId,
    onSelect,
}: VehicleSelectorProps) {
    if (vehicles.length === 0) {
        return <div>Nenhum veículo disponível para rastreamento</div>;
    }

    return (
        <div className="flex flex-col space-y-1.5">
            <label htmlFor="vehicle-select" className="text-sm font-medium">
                Selecionar Veículo
            </label>
            <Select
                value={selectedVehicleId || undefined}
                onValueChange={onSelect}
            >
                <SelectTrigger id="vehicle-select">
                    <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                    {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.licensePlate} - {vehicle.model}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

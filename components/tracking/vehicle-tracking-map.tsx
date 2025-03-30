"use client";

import { useEffect, useState } from "react";
import type { Vehicle } from "@/lib/types";

interface VehicleTrackingMapProps {
    vehicles: Vehicle[];
    selectedVehicleId: string | null;
}

export function VehicleTrackingMap({
    vehicles,
    selectedVehicleId,
}: VehicleTrackingMapProps) {
    const [mapUrl, setMapUrl] = useState("");

    useEffect(() => {
        if (selectedVehicleId) {
            const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
            if (vehicle && vehicle.location) {
                const { lat, lng } = vehicle.location;
                setMapUrl(
                    `https://www.google.com/maps/embed/v1/place?key=DEMO_KEY&q=${lat},${lng}&zoom=14`
                );
            }
        } else {
            setMapUrl(
                "https://www.google.com/maps/embed/v1/place?key=DEMO_KEY&q=New+York&zoom=10"
            );
        }
    }, [selectedVehicleId, vehicles]);

    return (
        <div className="w-full h-[600px] bg-gray-100">
            {mapUrl ? (
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização do Veículo"
                />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p>Selecione um veículo para ver sua localização</p>
                </div>
            )}
        </div>
    );
}

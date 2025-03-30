export interface Vehicle {
    id: string;
    licensePlate: string;
    model: string;
    year: number;
    color: string;
    status: "online" | "offline" | "maintenance";
    lastUpdated: string;
    location: {
        lat: number;
        lng: number;
    };
}

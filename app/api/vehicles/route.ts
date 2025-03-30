import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
    try {
        const headersList = await headers();
        const authorization = headersList.get("authorization");

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authorization.split(" ")[1];

        const response = await fetch(
            "http://ws.lifeonline.com.br:7060/api/vehicles/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.detail || "Failed to get vehicles" },
                { status: response.status }
            );
        }

        const transformedData = data.map((vehicle: any) => ({
            id: vehicle.id.toString(),
            codigo: vehicle.codigo,
            placa: vehicle.placa,
            status: vehicle.is_online ? "online" : "offline",
            lastUpdate: vehicle.ultimo_rastreamento || new Date().toISOString(),
            latitude: vehicle.ultima_latitude,
            longitude: vehicle.ultima_longitude,
            isActive: vehicle.is_active,
        }));

        return NextResponse.json(transformedData);
    } catch (error) {
        console.error("Vehicles API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const authorization = headersList.get("authorization");

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authorization.split(" ")[1];
        const body = await request.json();

        const transformedBody = {
            codigo: body.codigo,
            placa: body.placa,
            is_active: true,
            user: body.user || 1,
        };

        const response = await fetch(
            "http://ws.lifeonline.com.br:7060/api/vehicles/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(transformedBody),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.detail || "Failed to create vehicle" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Create vehicle API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

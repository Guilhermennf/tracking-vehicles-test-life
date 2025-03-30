import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
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
        const id = params.id;

        const response = await fetch(
            `http://ws.lifeonline.com.br:7060/api/vehicles/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.detail || "Failed to get vehicle location" },
                { status: response.status }
            );
        }

        const transformedData = {
            id: data.id.toString(),
            latitude: data.ultima_latitude,
            longitude: data.ultima_longitude,
            lastUpdate: data.ultimo_rastreamento || new Date().toISOString(),
        };

        return NextResponse.json(transformedData);
    } catch (error) {
        console.error("Tracking API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

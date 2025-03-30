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
                { message: data.detail || "Failed to get vehicle" },
                { status: response.status }
            );
        }

        const transformedData = {
            id: data.id.toString(),
            codigo: data.codigo,
            placa: data.placa,
            status: data.is_online ? "online" : "offline",
            lastUpdate: data.ultimo_rastreamento || new Date().toISOString(),
            latitude: data.ultima_latitude,
            longitude: data.ultima_longitude,
            isActive: data.is_active,
        };

        return NextResponse.json(transformedData);
    } catch (error) {
        console.error("Get vehicle API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
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
        const body = await request.json();

        const transformedBody = {
            codigo: body.codigo,
            placa: body.placa,
            is_active: body.isActive !== undefined ? body.isActive : true,
            user: body.user || 1,
        };

        const response = await fetch(
            `http://ws.lifeonline.com.br:7060/api/vehicles/${id}/`,
            {
                method: "PUT",
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
                { message: data.detail || "Failed to update vehicle" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Update vehicle API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
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
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const data = await response.json();
            return NextResponse.json(
                { message: data.detail || "Failed to delete vehicle" },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete vehicle API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

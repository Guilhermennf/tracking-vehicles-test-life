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

        const [totalAtivosResponse, veiculosOnlineResponse] = await Promise.all(
            [
                fetch(
                    "http://ws.lifeonline.com.br:7060/api/dashboard/total_ativos/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),
                fetch(
                    "http://ws.lifeonline.com.br:7060/api/dashboard/veiculos_online/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),
            ]
        );

        if (!totalAtivosResponse.ok || !veiculosOnlineResponse.ok) {
            return NextResponse.json(
                { message: "Failed to get dashboard data" },
                { status: 500 }
            );
        }

        const totalAtivos = await totalAtivosResponse.json();
        const veiculosOnline = await veiculosOnlineResponse.json();

        return NextResponse.json({
            totalVehicles: totalAtivos.total_ativos || 0,
            onlineVehicles: veiculosOnline.veiculos_online || 0,
        });
    } catch (error) {
        console.error("Dashboard API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

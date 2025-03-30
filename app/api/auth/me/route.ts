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
            "http://ws.lifeonline.com.br:7060/api/auth/me/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.detail || "Failed to get user data" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("User data API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

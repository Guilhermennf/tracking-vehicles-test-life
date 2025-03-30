import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const response = await fetch(
            "http://ws.lifeonline.com.br:7060/api/auth/login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.detail || "Authentication failed" },
                { status: response.status }
            );
        }

        return NextResponse.json({
            access: data.access,
            refresh: data.refresh,
        });
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
    totalVehicles: number;
    onlineVehicles: number;
}

export function DashboardKpis() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DashboardData>({
        totalVehicles: 0,
        onlineVehicles: 0,
    });

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch("/api/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard data");
                }

                const dashboardData = await response.json();
                setData(dashboardData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </>
        );
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total de Veículos Ativos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data.totalVehicles}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Total de veículos ativos na sua frota
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Veículos Online
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data.onlineVehicles}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {data.totalVehicles > 0
                            ? `${(
                                  (data.onlineVehicles / data.totalVehicles) *
                                  100
                              ).toFixed(1)}% da frota total`
                            : "0% da frota total"}
                    </p>
                </CardContent>
            </Card>
        </>
    );
}

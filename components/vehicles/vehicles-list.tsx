"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, MapPin, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleDialog } from "@/components/vehicles/vehicle-dialog";
import { DeleteConfirmationDialog } from "@/components/vehicles/delete-confirmation-dialog";
import { useVehicleStore } from "@/lib/store/vehicleStore";

export function VehiclesList() {
    const {
        vehicles,
        isLoading,
        isEditDialogOpen,
        isDeleteDialogOpen,
        fetchVehicles,
        setEditDialogOpen,
        setDeleteDialogOpen,
    } = useVehicleStore();

    const router = useRouter();

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "online":
                return <Badge className="bg-green-500">Online</Badge>;
            case "offline":
                return <Badge variant="outline">Offline</Badge>;
            case "maintenance":
                return <Badge variant="secondary">Manutenção</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Placa</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Última Atualização</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    Nenhum veículo encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            vehicles.map((vehicle) => (
                                <TableRow key={vehicle.id}>
                                    <TableCell className="font-medium">
                                        {vehicle.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>{vehicle.codigo}</TableCell>
                                    <TableCell>{vehicle.placa}</TableCell>
                                    <TableCell>
                                        {getStatusBadge(vehicle.status)}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            vehicle.lastUpdate
                                        ).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Abrir menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Ações
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(
                                                            `/tracking?id=${vehicle.id}`
                                                        )
                                                    }
                                                >
                                                    <MapPin className="mr-2 h-4 w-4" />
                                                    <span>Rastrear</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setEditDialogOpen(
                                                            true,
                                                            vehicle.id,
                                                            vehicle.placa
                                                        )
                                                    }
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Editar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeleteDialogOpen(
                                                            true,
                                                            vehicle.id,
                                                            vehicle.placa
                                                        )
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    <span>Excluir</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <VehicleDialog
                open={isEditDialogOpen}
                onOpenChange={(open) => setEditDialogOpen(open)}
                isCreating={false}
            />

            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => setDeleteDialogOpen(open)}
            />
        </>
    );
}

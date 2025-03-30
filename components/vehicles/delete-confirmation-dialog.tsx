"use client";

import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useVehicleStore } from "@/lib/store/vehicleStore";

interface DeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteConfirmationDialog({
    open,
    onOpenChange,
}: DeleteConfirmationDialogProps) {
    const {
        selectedVehicleId,
        selectedVehicleName,
        isLoadingDialog,
        deleteVehicle,
    } = useVehicleStore();

    const router = useRouter();

    const handleDelete = async () => {
        await deleteVehicle();
        router.refresh();
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir o veículo{" "}
                        {selectedVehicleName || selectedVehicleId}? Esta ação
                        não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoadingDialog}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isLoadingDialog}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoadingDialog ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

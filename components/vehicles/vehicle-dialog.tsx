"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useVehicleStore } from "@/lib/store/vehicleStore";

interface VehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isCreating?: boolean;
}

export function VehicleDialog({
    open,
    onOpenChange,
    isCreating = false,
}: VehicleDialogProps) {
    const {
        vehicleForm,
        isLoadingDialog,
        selectedVehicleId,
        setFormField,
        saveVehicle,
    } = useVehicleStore();

    const router = useRouter();
    const isEditing = !isCreating && !!selectedVehicleId;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormField(name as keyof typeof vehicleForm, value);
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormField("isActive", checked);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveVehicle();
        router.refresh();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Editar Veículo" : "Adicionar Veículo"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? "Faça alterações nos detalhes do veículo abaixo."
                                : "Preencha os detalhes do novo veículo abaixo."}
                        </DialogDescription>
                    </DialogHeader>
                    {isLoadingDialog ? (
                        <div className="py-6 text-center">
                            Carregando detalhes do veículo...
                        </div>
                    ) : (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="codigo">Código *</Label>
                                    <Input
                                        id="codigo"
                                        name="codigo"
                                        placeholder="ABC123"
                                        value={vehicleForm.codigo || ""}
                                        onChange={handleChange}
                                        disabled={isLoadingDialog}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="placa">Placa *</Label>
                                    <Input
                                        id="placa"
                                        name="placa"
                                        placeholder="ABC1234"
                                        value={vehicleForm.placa || ""}
                                        onChange={handleChange}
                                        disabled={isLoadingDialog}
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isActive"
                                        checked={vehicleForm.isActive}
                                        onCheckedChange={handleCheckboxChange}
                                        disabled={isLoadingDialog}
                                    />
                                    <Label htmlFor="isActive">Ativo</Label>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoadingDialog}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoadingDialog}>
                            {isLoadingDialog
                                ? "Salvando..."
                                : isEditing
                                ? "Atualizar"
                                : "Adicionar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

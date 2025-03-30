import { create } from "zustand";

interface Vehicle {
    id: string;
    codigo: string;
    placa: string;
    status: string;
    lastUpdate: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
}

interface VehicleForm {
    codigo: string;
    placa: string;
    isActive: boolean;
}

interface ToastMessage {
    title: string;
    description: string;
    variant?: "default" | "destructive";
}

interface VehicleStore {
    vehicles: Vehicle[];
    vehicleForm: VehicleForm;

    isLoading: boolean;
    isLoadingDialog: boolean;
    isAddDialogOpen: boolean;
    isEditDialogOpen: boolean;
    isDeleteDialogOpen: boolean;
    selectedVehicleId: string | null;
    selectedVehicleName: string;
    toastMessage: ToastMessage | null;

    fetchVehicles: () => Promise<void>;
    setAddDialogOpen: (open: boolean) => void;
    setEditDialogOpen: (
        open: boolean,
        vehicleId?: string,
        vehicleName?: string
    ) => void;
    setDeleteDialogOpen: (
        open: boolean,
        vehicleId?: string,
        vehicleName?: string
    ) => void;
    setFormField: (field: keyof VehicleForm, value: string | boolean) => void;
    resetForm: () => void;
    fetchVehicleDetails: (id: string) => Promise<void>;
    saveVehicle: () => Promise<void>;
    deleteVehicle: () => Promise<void>;
    clearToast: () => void;
}

const defaultForm: VehicleForm = {
    codigo: "",
    placa: "",
    isActive: true,
};

export const useVehicleStore = create<VehicleStore>((set, get) => ({
    vehicles: [],
    vehicleForm: { ...defaultForm },

    isLoading: false,
    isLoadingDialog: false,
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
    selectedVehicleId: null,
    selectedVehicleName: "",
    toastMessage: null,

    clearToast: () => set({ toastMessage: null }),

    fetchVehicles: async () => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch("/api/vehicles", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to fetch vehicles");
            }

            const data = await response.json();
            set({ vehicles: data });
        } catch (error) {
            set({
                vehicles: [],
                toastMessage: {
                    title: "Erro ao carregar veículos",
                    description:
                        error instanceof Error
                            ? error.message
                            : "Ocorreu um erro ao carregar os veículos",
                    variant: "destructive",
                },
            });
        } finally {
            set({ isLoading: false });
        }
    },

    setAddDialogOpen: (open) => {
        if (open) {
            set({
                isAddDialogOpen: true,
                selectedVehicleId: null,
                vehicleForm: { ...defaultForm },
            });
        } else {
            set({ isAddDialogOpen: false });
        }
    },

    setEditDialogOpen: (open, vehicleId, vehicleName = "") => {
        if (open && vehicleId) {
            set({
                isEditDialogOpen: true,
                selectedVehicleId: vehicleId,
                selectedVehicleName: vehicleName,
            });
            get().fetchVehicleDetails(vehicleId);
        } else {
            set({ isEditDialogOpen: false });
        }
    },

    setDeleteDialogOpen: (open, vehicleId, vehicleName = "") => {
        set({
            isDeleteDialogOpen: open,
            selectedVehicleId: open ? vehicleId : null,
            selectedVehicleName: open ? vehicleName : "",
        });
    },

    setFormField: (field, value) => {
        set((state) => ({
            vehicleForm: {
                ...state.vehicleForm,
                [field]: value,
            },
        }));
    },

    resetForm: () => {
        set({ vehicleForm: { ...defaultForm } });
    },

    fetchVehicleDetails: async (id) => {
        set({ isLoadingDialog: true });
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch(`/api/vehicles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(
                    data.message || "Failed to fetch vehicle details"
                );
            }

            const data = await response.json();
            set({
                vehicleForm: {
                    codigo: data.codigo,
                    placa: data.placa,
                    isActive: data.isActive,
                },
            });
        } catch (error) {
            set({
                isEditDialogOpen: false,
                toastMessage: {
                    title: "Erro ao carregar detalhes",
                    description:
                        error instanceof Error
                            ? error.message
                            : "Ocorreu um erro ao carregar os detalhes do veículo",
                    variant: "destructive",
                },
            });
        } finally {
            set({ isLoadingDialog: false });
        }
    },

    saveVehicle: async () => {
        set({ isLoadingDialog: true });

        try {
            const { vehicleForm, selectedVehicleId } = get();

            if (!vehicleForm.codigo || !vehicleForm.placa) {
                throw new Error(
                    "Por favor, preencha todos os campos obrigatórios"
                );
            }

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const isEditing = !!selectedVehicleId;
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing
                ? `/api/vehicles/${selectedVehicleId}`
                : "/api/vehicles";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(vehicleForm),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to save vehicle");
            }

            set({
                isAddDialogOpen: false,
                isEditDialogOpen: false,
                toastMessage: {
                    title: isEditing
                        ? "Veículo atualizado"
                        : "Veículo adicionado",
                    description: isEditing
                        ? "O veículo foi atualizado com sucesso"
                        : "O veículo foi adicionado com sucesso",
                },
            });

            get().fetchVehicles();
        } catch (error) {
            set({
                toastMessage: {
                    title: "Erro",
                    description:
                        error instanceof Error
                            ? error.message
                            : "Ocorreu um erro",
                    variant: "destructive",
                },
            });
        } finally {
            set({ isLoadingDialog: false });
        }
    },

    deleteVehicle: async () => {
        set({ isLoadingDialog: true });

        try {
            const { selectedVehicleId } = get();

            if (!selectedVehicleId) {
                throw new Error("Vehicle ID is missing");
            }

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch(`/api/vehicles/${selectedVehicleId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to delete vehicle");
            }

            set({
                isDeleteDialogOpen: false,
                toastMessage: {
                    title: "Veículo excluído",
                    description: "O veículo foi excluído com sucesso",
                },
            });

            get().fetchVehicles();
        } catch (error) {
            set({
                toastMessage: {
                    title: "Erro ao excluir",
                    description:
                        error instanceof Error
                            ? error.message
                            : "Ocorreu um erro ao excluir o veículo",
                    variant: "destructive",
                },
            });
        } finally {
            set({ isLoadingDialog: false });
        }
    },
}));

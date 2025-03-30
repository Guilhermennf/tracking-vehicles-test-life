"use client";

import type React from "react";

import { useEffect, useState } from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

type ToastActionElement = React.ReactElement<{
    altText: string;
}>;

export type Toast = {
    id: string;
    title?: string;
    description?: string;
    action?: ToastActionElement;
    variant?: "default" | "destructive";
};

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function generateId() {
    return `${count++}`;
}

type ActionType = typeof actionTypes;

type Action =
    | {
          type: ActionType["ADD_TOAST"];
          toast: Omit<Toast, "id">;
      }
    | {
          type: ActionType["UPDATE_TOAST"];
          toast: Partial<Omit<Toast, "id">> & Pick<Toast, "id">;
      }
    | {
          type: ActionType["DISMISS_TOAST"];
          toastId: string;
      }
    | {
          type: ActionType["REMOVE_TOAST"];
          toastId: string;
      };

interface State {
    toasts: Toast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [
                    ...state.toasts,
                    { id: generateId(), ...action.toast },
                ].slice(-TOAST_LIMIT),
            };

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action;

            if (toastTimeouts.has(toastId)) {
                clearTimeout(toastTimeouts.get(toastId));
                toastTimeouts.delete(toastId);
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId
                        ? {
                              ...t,
                              open: false,
                          }
                        : t
                ),
            };
        }

        case actionTypes.REMOVE_TOAST:
            if (toastTimeouts.has(action.toastId)) {
                clearTimeout(toastTimeouts.get(action.toastId));
                toastTimeouts.delete(action.toastId);
            }

            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };

        default:
            return state;
    }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

type ToastProps = {
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    variant?: "default" | "destructive";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function useToast() {
    const [state, setState] = useState<State>(memoryState);

    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);

    return {
        toasts: state.toasts,
        toast: (props: Omit<ToastProps, "id">) => {
            const id = generateId();

            const update = (props: Partial<Omit<ToastProps, "id">>) =>
                dispatch({
                    type: actionTypes.UPDATE_TOAST,
                    toast: { ...props, id },
                });

            const dismiss = () =>
                dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

            dispatch({
                type: actionTypes.ADD_TOAST,
                toast: {
                    ...props,
                    id,
                    open: true,
                    onOpenChange: (open: boolean) => {
                        if (!open) dismiss();
                    },
                },
            });

            toastTimeouts.set(
                id,
                setTimeout(() => {
                    dismiss();
                    dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
                }, TOAST_REMOVE_DELAY)
            );

            return {
                id,
                dismiss,
                update,
            };
        },
        dismiss: (toastId: string) =>
            dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    };
}

/**
 * UI store — Zustand
 *
 * Manages lightweight, cross-cutting UI state (sidebar, alerts, modals)
 * so individual components no longer have to thread these props manually.
 *
 * Usage:
 *   const { sidebarOpen, setSidebarOpen, openModal, closeModal } = useUIStore();
 */
import { create } from 'zustand';
import type { WorkflowAction } from '../types/workflow';

interface UIState {
    sidebarOpen: boolean;
    alertVisible: boolean;
    modalOpen: boolean;
    activeModal: WorkflowAction | null;
    modalObject: unknown;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    setAlertVisible: (visible: boolean) => void;
    openModal: (obj: unknown, key: WorkflowAction) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
    sidebarOpen: false,
    alertVisible: true,
    modalOpen: false,
    activeModal: null,
    modalObject: {},
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setAlertVisible: (visible) => set({ alertVisible: visible }),
    openModal: (obj, key) => set({ modalOpen: true, activeModal: key, modalObject: obj }),
    closeModal: () => set({ modalOpen: false, activeModal: null, modalObject: null }),
}));

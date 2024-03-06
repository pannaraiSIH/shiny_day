import { create } from "zustand";

interface AlertDetails {
  title: string;
  description?: string;
  style: "default" | "destructive";
}

interface Alert {
  showAlert: boolean;
  alertDetails: AlertDetails;
  setShowAlert: (by: boolean) => void;
  setAlertDetails: (by: AlertDetails) => void;
}

export const useAlertStore = create<Alert>((set) => ({
  showAlert: false,
  alertDetails: { title: "", description: "", style: "default" },
  setShowAlert: (by: boolean) => set((state) => ({ showAlert: by })),
  setAlertDetails: (by: AlertDetails) => set((state) => ({ alertDetails: by })),
}));

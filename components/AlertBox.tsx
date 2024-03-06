"use client";

import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useAlertStore } from "@/stores/useAlertStore";

interface AlertBox {
  title: string;
  description?: string;
  style: "default" | "destructive";
}

const AlertBox = () => {
  const showAlert = useAlertStore((state) => state.showAlert);
  const setShowAlert = useAlertStore((state) => state.setShowAlert);
  const alertDetails = useAlertStore((state) => state.alertDetails);

  useEffect(() => {
    function closeAlert() {
      setTimeout(() => {
        setShowAlert(false);
      }, 4000);
    }

    closeAlert();
  }, [showAlert, setShowAlert]);

  return (
    <>
      {showAlert && (
        <Alert
          variant={alertDetails.style}
          className='fixed top-10 right-[5rem] z-40 w-[25rem] bg-white'
        >
          <Terminal className='h-4 w-4' />
          <AlertTitle>{alertDetails.title}</AlertTitle>
          <AlertDescription>{alertDetails.description}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AlertBox;

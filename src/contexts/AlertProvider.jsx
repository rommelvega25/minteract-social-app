import { createContext, useContext, useState } from "react";

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type = "info", timeout = 3000) => {
        setAlert({
            message,
            type,
            mode: "alert",
        });

        if (timeout) {
            setTimeout(() => setAlert(null), timeout);
        }
    };
    
    const showPrompt = ({
        message,
        confirmText = "Confirm",
        cancelText = "Cancel",
        onConfirm,
        onCancel,
    }) => {
        setAlert({
            message,
            type: "prompt",
            mode: "prompt",
            confirmText,
            cancelText,
            onConfirm,
            onCancel,
        });
    };

    const hideAlert = () => setAlert(null);

    return (
        <AlertContext.Provider value={{ alert, showAlert, showPrompt, hideAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);
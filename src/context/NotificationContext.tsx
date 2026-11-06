import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Snackbar, Alert, useTheme } from "@mui/material";

interface NotificationContextType {
    showNotification: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType>({
    showNotification: () => { },
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

    const showNotification = useCallback((msg: string, sev: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar 
                open={open} 
                autoHideDuration={3000} 
                onClose={handleClose} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleClose} 
                    severity={severity} 
                    variant="filled"
                    sx={{ 
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        boxShadow: isDark
                            ? '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(99, 102, 241, 0.2)'
                            : '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                        backdropFilter: 'blur(8px)',
                        alignItems: 'center',
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

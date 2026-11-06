import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ThemeProvider, createTheme, responsiveFontSizes, alpha } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => { },
    mode: 'dark',
});

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('flowboard_theme');
        return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    });

    useEffect(() => {
        localStorage.setItem('flowboard_theme', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode,
        }),
        [mode]
    );

    const theme = useMemo(() => {
        const isDark = mode === 'dark';

        const baseTheme = createTheme({
            palette: {
                mode,
                background: {
                    default: isDark ? '#080C14' : '#F8FAFC',
                    paper: isDark ? '#111726' : '#FFFFFF',
                },
                primary: {
                    main: isDark ? '#6366F1' : '#4F46E5',
                    light: isDark ? '#818CF8' : '#6366F1',
                    dark: isDark ? '#4F46E5' : '#3730A3',
                    contrastText: '#FFFFFF',
                },
                secondary: {
                    main: isDark ? '#A855F7' : '#9333EA',
                    light: isDark ? '#C084FC' : '#A855F7',
                    dark: isDark ? '#7E22CE' : '#6B21A8',
                },
                info: {
                    main: '#06B6D4',
                },
                success: {
                    main: '#10B981',
                },
                warning: {
                    main: '#F59E0B',
                },
                error: {
                    main: '#F43F5E',
                },
                text: {
                    primary: isDark ? '#F8FAFC' : '#0F172A',
                    secondary: isDark ? '#94A3B8' : '#64748B',
                },
                divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            },
            typography: {
                fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 800 },
                h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
                h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
                h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
                h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
                h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
                subtitle1: { fontWeight: 600 },
                subtitle2: { fontWeight: 600, letterSpacing: '0.02em' },
                body1: { fontSize: '0.925rem', lineHeight: 1.55 },
                body2: { fontSize: '0.85rem', lineHeight: 1.5 },
                button: {
                    textTransform: 'none',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                },
            },
            shape: {
                borderRadius: 12,
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        body: {
                            scrollbarColor: isDark ? 'rgba(148, 163, 184, 0.2) transparent' : 'rgba(100, 116, 139, 0.2) transparent',
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundImage: 'none',
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 10,
                            padding: '8px 18px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                        contained: {
                            boxShadow: isDark
                                ? '0 4px 14px 0 rgba(99, 102, 241, 0.35)'
                                : '0 4px 14px 0 rgba(79, 70, 229, 0.25)',
                            '&:hover': {
                                boxShadow: isDark
                                    ? '0 6px 20px 0 rgba(99, 102, 241, 0.5)'
                                    : '0 6px 20px 0 rgba(79, 70, 229, 0.4)',
                                transform: 'translateY(-1px)',
                            },
                        },
                    },
                },
                MuiDialog: {
                    styleOverrides: {
                        paper: {
                            borderRadius: 16,
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                            backgroundColor: isDark ? '#121826' : '#FFFFFF',
                            boxShadow: isDark
                                ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15)'
                                : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                        },
                    },
                },
                MuiTooltip: {
                    styleOverrides: {
                        tooltip: {
                            backgroundColor: isDark ? '#1E293B' : '#0F172A',
                            borderRadius: 8,
                            fontSize: '0.78rem',
                            padding: '6px 12px',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'transparent'}`,
                        },
                    },
                },
                MuiOutlinedInput: {
                    styleOverrides: {
                        root: {
                            borderRadius: 10,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: isDark ? alpha('#818CF8', 0.6) : alpha('#6366F1', 0.6),
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderWidth: 1.5,
                                borderColor: isDark ? '#818CF8' : '#6366F1',
                                boxShadow: isDark ? '0 0 12px rgba(99, 102, 241, 0.35)' : '0 0 10px rgba(79, 70, 229, 0.2)',
                            },
                        },
                    },
                },
            },
        });

        return responsiveFontSizes(baseTheme);
    }, [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

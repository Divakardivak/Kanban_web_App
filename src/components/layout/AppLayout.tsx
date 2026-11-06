import { 
    Box, 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    useTheme, 
    InputBase, 
    Tooltip,
    Chip,
    Avatar,
    CircularProgress
} from "@mui/material";
import { Outlet } from "react-router-dom";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import LogoutIcon from "@mui/icons-material/Logout";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ClearIcon from "@mui/icons-material/Clear";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useColorMode } from "../../context/ColorModeContext";
import { useStore } from "../../hooks/useStore";
import { useFirestoreSync } from "../../hooks/useFirestoreSync";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import ConfirmModal from "../modals/ConfirmModal";
import { useNotification } from "../../context/NotificationContext";

const SearchContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.04)' 
        : 'rgba(0, 0, 0, 0.03)',
    border: `1px solid ${
        theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.08)'
    }`,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.07)' 
            : 'rgba(0, 0, 0, 0.05)',
        borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(99, 102, 241, 0.4)' 
            : 'rgba(99, 102, 241, 0.3)',
    },
    '&:focus-within': {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.palette.mode === 'dark' 
            ? '0 0 16px rgba(99, 102, 241, 0.3)' 
            : '0 0 12px rgba(79, 70, 229, 0.15)',
        backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(18, 24, 38, 0.8)' 
            : '#FFFFFF',
    },
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    marginLeft: theme.spacing(2),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    pointerEvents: 'none',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(0.9, 1, 0.9, 0),
        fontSize: '0.875rem',
        width: '100%',
    },
}));

const AppLayout = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const colorMode = useColorMode();
    const { searchQuery, setSearchQuery, clearBoard, tasks, columnOrder } = useStore();
    const { syncStatus, triggerManualSave } = useFirestoreSync();
    const [confirmResetOpen, setConfirmResetOpen] = useState(false);
    const { showNotification } = useNotification();

    const totalTasks = Object.keys(tasks).length;
    const totalColumns = columnOrder.length;
    const currentUserEmail = auth.currentUser?.email || "User";
    const userInitial = currentUserEmail.charAt(0).toUpperCase();

    const handleLogout = () => {
        signOut(auth).catch(err => console.error("Logout error", err));
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh', 
            overflow: 'hidden',
            bgcolor: 'background.default',
            position: 'relative',
        }}>
            {/* Futuristic ambient background mesh */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 0,
                    background: isDark
                        ? `radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
                           radial-gradient(circle at 90% 85%, rgba(168, 85, 247, 0.07) 0%, transparent 40%),
                           radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)`
                        : `radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.04) 0%, transparent 40%),
                           radial-gradient(circle at 90% 85%, rgba(168, 85, 247, 0.03) 0%, transparent 40%)`,
                }}
            />

            {/* Futuristic Glassmorphic Header */}
            <AppBar 
                position="static" 
                elevation={0} 
                sx={{ 
                    position: 'relative',
                    zIndex: 1,
                    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)'}`,
                    bgcolor: isDark ? 'rgba(10, 14, 23, 0.82)' : 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(16px)',
                    color: 'text.primary',
                }}
            >
                <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, sm: 3 } }}>
                    {/* Brand Logo & Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mr: 2 }}>
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isDark ? '0 0 16px rgba(99, 102, 241, 0.5)' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                                mr: 1.5,
                            }}
                        >
                            <ViewKanbanIcon sx={{ color: '#FFFFFF', fontSize: 22 }} />
                        </Box>
                        <Box>
                            <Typography 
                                variant="h6" 
                                component="div" 
                                sx={{ 
                                    fontFamily: '"Outfit", sans-serif',
                                    fontWeight: 800, 
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.1,
                                    background: isDark 
                                        ? 'linear-gradient(135deg, #FFFFFF 30%, #CBD5E1 100%)' 
                                        : 'linear-gradient(135deg, #0F172A 30%, #334155 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                Flow<Box component="span" sx={{
                                    background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>Board</Box>
                            </Typography>
                        </Box>
                    </Box>

                    {/* Real-time Cloud Sync Pill */}
                    <Tooltip title={
                        syncStatus === 'synced' ? "Connected to Cloud Firestore (Real-time Sync Active). Click to re-sync." :
                        syncStatus === 'syncing' ? "Saving changes to Cloud Firestore..." :
                        syncStatus === 'error' ? "Cloud sync offline. Data is saved locally in your browser." :
                        "Connecting to Cloud..."
                    }>
                        <Chip
                            icon={
                                syncStatus === 'syncing' ? (
                                    <CircularProgress size={12} sx={{ color: '#818CF8 !important' }} />
                                ) : syncStatus === 'error' ? (
                                    <CloudOffIcon sx={{ fontSize: '13px !important', color: '#F43F5E !important' }} />
                                ) : (
                                    <CloudDoneIcon sx={{ fontSize: '13px !important', color: '#10B981 !important' }} />
                                )
                            }
                            label={
                                syncStatus === 'syncing' ? "SYNCING..." :
                                syncStatus === 'error' ? "OFFLINE" :
                                "CLOUD SYNCED"
                            }
                            size="small"
                            onClick={triggerManualSave}
                            sx={{
                                display: { xs: 'none', md: 'inline-flex' },
                                height: 24,
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                cursor: 'pointer',
                                bgcolor: 
                                    syncStatus === 'syncing' ? (isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)') :
                                    syncStatus === 'error' ? (isDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(244, 63, 94, 0.1)') :
                                    (isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.1)'),
                                color: 
                                    syncStatus === 'syncing' ? '#818CF8' :
                                    syncStatus === 'error' ? '#F43F5E' :
                                    '#10B981',
                                border: `1px solid ${
                                    syncStatus === 'syncing' ? 'rgba(99, 102, 241, 0.3)' :
                                    syncStatus === 'error' ? 'rgba(244, 63, 94, 0.3)' :
                                    'rgba(16, 185, 129, 0.25)'
                                }`,
                                mr: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                }
                            }}
                        />
                    </Tooltip>

                    {/* Futuristic Search Box */}
                    <SearchContainer>
                        <SearchIconWrapper>
                            <SearchIcon sx={{ fontSize: 19 }} />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search tasks..."
                            inputProps={{ 'aria-label': 'search tasks' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <IconButton 
                                size="small" 
                                onClick={() => setSearchQuery("")}
                                sx={{ mr: 0.5, p: 0.5, color: 'text.secondary' }}
                            >
                                <ClearIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        )}
                    </SearchContainer>

                    {/* Quick Stats Pill */}
                    <Chip
                        label={`${totalTasks} Tasks • ${totalColumns} Columns`}
                        size="small"
                        sx={{
                            display: { xs: 'none', lg: 'inline-flex' },
                            ml: 2,
                            height: 26,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                            color: 'text.secondary',
                        }}
                    />

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Action Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Reset Board">
                            <IconButton 
                                onClick={() => setConfirmResetOpen(true)} 
                                sx={{ 
                                    color: 'text.secondary',
                                    borderRadius: '10px',
                                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                                    p: 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: '#F43F5E',
                                        bgcolor: isDark ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.08)',
                                        borderColor: 'rgba(244, 63, 94, 0.3)',
                                    }
                                }}
                            >
                                <DeleteSweepIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
                            <IconButton 
                                onClick={colorMode.toggleColorMode} 
                                sx={{ 
                                    color: 'text.secondary',
                                    borderRadius: '10px',
                                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                                    p: 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: isDark ? '#F59E0B' : '#6366F1',
                                        bgcolor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.08)',
                                        borderColor: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                                    }
                                }}
                            >
                                {isDark ? (
                                    <LightModeIcon sx={{ fontSize: 20 }} />
                                ) : (
                                    <DarkModeIcon sx={{ fontSize: 20 }} />
                                )}
                            </IconButton>
                        </Tooltip>

                        {/* User Identity Chip & Logout */}
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                ml: 1,
                                pl: 1.5,
                                borderLeft: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`
                            }}
                        >
                            <Tooltip title={currentUserEmail}>
                                <Avatar 
                                    sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        bgcolor: 'primary.main',
                                        color: '#FFFFFF',
                                        border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}`,
                                        boxShadow: isDark ? '0 0 10px rgba(99, 102, 241, 0.35)' : 'none',
                                    }}
                                >
                                    {userInitial}
                                </Avatar>
                            </Tooltip>

                            <Tooltip title="Sign Out">
                                <IconButton 
                                    onClick={handleLogout}
                                    sx={{ 
                                        color: 'text.secondary',
                                        borderRadius: '10px',
                                        p: 1,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: 'text.primary',
                                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                                        }
                                    }}
                                >
                                    <LogoutIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Board Container */}
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    overflow: 'hidden', 
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Outlet />
            </Box>

            <ConfirmModal
                open={confirmResetOpen}
                title="Reset FlowBoard"
                content="Are you sure you want to delete ALL columns and tasks? This action cannot be undone."
                onClose={() => setConfirmResetOpen(false)}
                onConfirm={() => {
                    clearBoard();
                    showNotification("Board has been completely reset", "warning");
                    setConfirmResetOpen(false);
                }}
            />
        </Box>
    );
};

export default AppLayout;

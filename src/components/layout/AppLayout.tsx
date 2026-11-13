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
    CircularProgress,
    Button,
    Badge
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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useColorMode } from "../../context/ColorModeContext";
import { useStore } from "../../hooks/useStore";
import { useFirestoreSync } from "../../hooks/useFirestoreSync";
import { styled } from "@mui/material/styles";
import { useState, useRef, useEffect } from "react";
import ConfirmModal from "../modals/ConfirmModal";
import AiPlannerModal from "../modals/AiPlannerModal";
import { ExportImportModal } from "../modals/ExportImportModal";
import { ActivityDrawer } from "../activity/ActivityDrawer";
import { useNotification } from "../../context/NotificationContext";

const SearchContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.03)',
    border: `1px solid ${theme.palette.mode === 'dark'
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
    maxWidth: 260,
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(1),
    flexShrink: 1,
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
    // Atomic Zustand selectors to prevent unnecessary re-renders of the entire layout
    const totalTasks = useStore((state) => Object.keys(state.tasks).length);
    const totalColumns = useStore((state) => state.columnOrder.length);
    const activitiesCount = useStore((state) => state.activities.length);
    const searchQuery = useStore((state) => state.searchQuery);
    const setSearchQuery = useStore((state) => state.setSearchQuery);
    const clearBoard = useStore((state) => state.clearBoard);

    const { syncStatus, syncError, triggerManualSave } = useFirestoreSync();
    const [confirmResetOpen, setConfirmResetOpen] = useState(false);
    const [aiPlannerOpen, setAiPlannerOpen] = useState(false);
    const [exportImportOpen, setExportImportOpen] = useState(false);
    const [activityDrawerOpen, setActivityDrawerOpen] = useState(false);
    const { showNotification } = useNotification();

    // Debounced search state for 120 FPS typing responsiveness
    const [localSearch, setLocalSearch] = useState(searchQuery);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalSearch(val);
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            setSearchQuery(val);
        }, 120);
    };

    const handleClearSearch = () => {
        setLocalSearch("");
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        setSearchQuery("");
    };

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

            {/* Futuristic Header */}
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)'}`,
                    bgcolor: isDark ? '#0A0E17' : '#FFFFFF',
                    color: 'text.primary',
                }}
            >
                <Toolbar sx={{ minHeight: { xs: '56px !important', sm: '64px !important' }, px: { xs: 1.5, sm: 3 } }}>
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
                        syncStatus === 'synced' ? "Connected to Cloud Firestore (Real-time Sync Active)" :
                            syncStatus === 'syncing' ? "Saving changes to Cloud Firestore..." :
                                syncStatus === 'error' ? (syncError || "Cloud sync offline. Check Firestore rules in Firebase Console.") :
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
                                border: `1px solid ${syncStatus === 'syncing' ? 'rgba(99, 102, 241, 0.3)' :
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
                            value={localSearch}
                            onChange={handleSearchChange}
                        />
                        {localSearch && (
                            <IconButton
                                size="small"
                                onClick={handleClearSearch}
                                sx={{ mr: 0.5, p: 0.5, color: 'text.secondary' }}
                            >
                                <ClearIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        )}
                    </SearchContainer>

                    {/* AI Project Planner Button */}
                    <Tooltip title="Generate project workflow & tasks with AI">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setAiPlannerOpen(true)}
                            startIcon={<AutoAwesomeIcon sx={{ fontSize: '16px !important', color: '#F59E0B' }} />}
                            sx={{
                                display: { xs: 'none', sm: 'inline-flex' },
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                ml: 1,
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                py: 0.6,
                                px: 1.4,
                                height: 34,
                                bgcolor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.06)',
                                color: isDark ? '#FDE68A' : '#D97706',
                                borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.35)',
                                boxShadow: isDark ? '0 0 12px rgba(245, 158, 11, 0.15)' : 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(245, 158, 11, 0.16)' : 'rgba(245, 158, 11, 0.12)',
                                    borderColor: '#F59E0B',
                                    transform: 'translateY(-1px)',
                                    boxShadow: isDark ? '0 0 16px rgba(245, 158, 11, 0.35)' : '0 2px 8px rgba(245, 158, 11, 0.25)',
                                }
                            }}
                        >
                            AI Plan
                        </Button>
                    </Tooltip>

                    {/* Export & Import Button */}
                    <Tooltip title="Backup or restore your board (JSON & CSV)">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setExportImportOpen(true)}
                            startIcon={<ImportExportIcon sx={{ fontSize: '18px !important', color: '#06B6D4' }} />}
                            sx={{
                                display: { xs: 'none', md: 'inline-flex' },
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                ml: 1,
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                py: 0.6,
                                px: 1.4,
                                height: 34,
                                bgcolor: isDark ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.06)',
                                color: isDark ? '#67E8F9' : '#0891B2',
                                borderColor: isDark ? 'rgba(6, 182, 212, 0.35)' : 'rgba(6, 182, 212, 0.35)',
                                boxShadow: isDark ? '0 0 12px rgba(6, 182, 212, 0.15)' : 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    bgcolor: isDark ? 'rgba(6, 182, 212, 0.16)' : 'rgba(6, 182, 212, 0.12)',
                                    borderColor: '#06B6D4',
                                    transform: 'translateY(-1px)',
                                    boxShadow: isDark ? '0 0 16px rgba(6, 182, 212, 0.35)' : '0 2px 8px rgba(6, 182, 212, 0.25)',
                                }
                            }}
                        >
                            Transfer
                        </Button>
                    </Tooltip>

                    {/* Quick Stats Pill (Large desktop only) */}
                    <Chip
                        label={`${totalTasks} Tasks • ${totalColumns} Columns`}
                        size="small"
                        sx={{
                            display: { xs: 'none', xl: 'inline-flex' },
                            ml: 1.5,
                            height: 26,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                            color: 'text.secondary',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                        }}
                    />

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Action Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.8 }, flexShrink: 0 }}>
                        {/* Mobile AI Plan Button */}
                        <Tooltip title="AI Project Planner">
                            <IconButton
                                onClick={() => setAiPlannerOpen(true)}
                                sx={{
                                    display: { xs: 'inline-flex', sm: 'none' },
                                    color: 'text.secondary',
                                    borderRadius: '10px',
                                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                                    p: 0.8,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: '#F59E0B',
                                        bgcolor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.08)',
                                        borderColor: 'rgba(245, 158, 11, 0.3)',
                                    }
                                }}
                            >
                                <AutoAwesomeIcon sx={{ fontSize: 19, color: '#F59E0B' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Backup, Export & Import (JSON / CSV)">
                            <IconButton
                                onClick={() => setExportImportOpen(true)}
                                sx={{
                                    display: { xs: 'inline-flex', md: 'none' },
                                    color: 'text.secondary',
                                    borderRadius: '10px',
                                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                                    p: { xs: 0.8, sm: 1 },
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: '#06B6D4',
                                        bgcolor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(6, 182, 212, 0.08)',
                                        borderColor: 'rgba(6, 182, 212, 0.3)',
                                    }
                                }}
                            >
                                <ImportExportIcon sx={{ fontSize: 19 }} />
                            </IconButton>
                        </Tooltip>

                        {/* Activity Log & History Trigger Button */}
                        <Tooltip title="Activity Log & History">
                            <IconButton
                                onClick={() => setActivityDrawerOpen(true)}
                                sx={{
                                    color: 'text.secondary',
                                    borderRadius: '10px',
                                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                                    p: 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: '#A855F7',
                                        bgcolor: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.08)',
                                        borderColor: 'rgba(168, 85, 247, 0.3)',
                                    }
                                }}
                            >
                                <Badge
                                    badgeContent={activitiesCount > 0 ? activitiesCount : undefined}
                                    max={99}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            bgcolor: '#A855F7',
                                            color: '#FFFFFF',
                                            fontSize: '0.62rem',
                                            fontWeight: 800,
                                            height: 16,
                                            minWidth: 16,
                                            px: 0.4,
                                        }
                                    }}
                                >
                                    <NotificationsNoneIcon sx={{ fontSize: 20 }} />
                                </Badge>
                            </IconButton>
                        </Tooltip>

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
                    minHeight: 0,
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Outlet />
            </Box>

            {aiPlannerOpen && (
                <AiPlannerModal
                    open={aiPlannerOpen}
                    onClose={() => setAiPlannerOpen(false)}
                />
            )}

            {exportImportOpen && (
                <ExportImportModal
                    open={exportImportOpen}
                    onClose={() => setExportImportOpen(false)}
                />
            )}

            {activityDrawerOpen && (
                <ActivityDrawer
                    open={activityDrawerOpen}
                    onClose={() => setActivityDrawerOpen(false)}
                />
            )}

            {confirmResetOpen && (
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
            )}
        </Box>
    );
};

export default AppLayout;

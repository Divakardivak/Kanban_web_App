import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Chip,
    Button,
    Tooltip,
    useTheme,
    Fade,
} from "@mui/material";
import { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import HistoryIcon from "@mui/icons-material/History";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useStore, type ActivityType } from "../../hooks/useStore";
import { useNotification } from "../../context/NotificationContext";

interface Props {
    open: boolean;
    onClose: () => void;
}

type FilterCategory = 'all' | 'tasks' | 'moves' | 'checklists' | 'columns';

const formatRelativeTime = (timestamp: number): string => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 45) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const date = new Date(timestamp);
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const getActivityConfig = (type: ActivityType) => {
    switch (type) {
        case 'task_created':
            return {
                label: 'CREATED',
                color: '#10B981',
                bg: 'rgba(16, 185, 129, 0.12)',
                icon: <AddCircleOutlineIcon sx={{ fontSize: 16, color: '#10B981' }} />,
            };
        case 'task_moved':
            return {
                label: 'MOVED',
                color: '#06B6D4',
                bg: 'rgba(6, 182, 212, 0.12)',
                icon: <SwapHorizIcon sx={{ fontSize: 16, color: '#06B6D4' }} />,
            };
        case 'subtask_toggled':
            return {
                label: 'CHECKLIST',
                color: '#A855F7',
                bg: 'rgba(168, 85, 247, 0.12)',
                icon: <TaskAltIcon sx={{ fontSize: 16, color: '#A855F7' }} />,
            };
        case 'task_updated':
            return {
                label: 'EDITED',
                color: '#F59E0B',
                bg: 'rgba(245, 158, 11, 0.12)',
                icon: <EditOutlinedIcon sx={{ fontSize: 16, color: '#F59E0B' }} />,
            };
        case 'task_deleted':
            return {
                label: 'DELETED',
                color: '#F43F5E',
                bg: 'rgba(244, 63, 94, 0.12)',
                icon: <DeleteOutlineIcon sx={{ fontSize: 16, color: '#F43F5E' }} />,
            };
        case 'column_created':
            return {
                label: 'NEW COLUMN',
                color: '#6366F1',
                bg: 'rgba(99, 102, 241, 0.12)',
                icon: <ViewColumnIcon sx={{ fontSize: 16, color: '#6366F1' }} />,
            };
        case 'column_deleted':
            return {
                label: 'COLUMN REMOVED',
                color: '#F43F5E',
                bg: 'rgba(244, 63, 94, 0.12)',
                icon: <DeleteOutlineIcon sx={{ fontSize: 16, color: '#F43F5E' }} />,
            };
        case 'board_imported':
            return {
                label: 'RESTORED',
                color: '#14B8A6',
                bg: 'rgba(20, 184, 166, 0.12)',
                icon: <CloudDownloadIcon sx={{ fontSize: 16, color: '#14B8A6' }} />,
            };
        case 'board_reset':
            return {
                label: 'RESET',
                color: '#EF4444',
                bg: 'rgba(239, 68, 68, 0.12)',
                icon: <RestartAltIcon sx={{ fontSize: 16, color: '#EF4444' }} />,
            };
        default:
            return {
                label: 'ACTION',
                color: '#6366F1',
                bg: 'rgba(99, 102, 241, 0.12)',
                icon: <HistoryIcon sx={{ fontSize: 16, color: '#6366F1' }} />,
            };
    }
};

export const ActivityDrawer = ({ open, onClose }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { activities, clearActivities } = useStore();
    const { showNotification } = useNotification();

    const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');

    const handleClear = () => {
        clearActivities();
        showNotification("Activity history cleared", "info");
    };

    // Filter activities
    const filteredActivities = activities.filter((act) => {
        if (filterCategory === 'all') return true;
        if (filterCategory === 'tasks') return act.type === 'task_created' || act.type === 'task_updated' || act.type === 'task_deleted';
        if (filterCategory === 'moves') return act.type === 'task_moved';
        if (filterCategory === 'checklists') return act.type === 'subtask_toggled';
        if (filterCategory === 'columns') return act.type === 'column_created' || act.type === 'column_deleted';
        return true;
    });

    // Counts for filter pills
    const taskCount = activities.filter((a) => a.type === 'task_created' || a.type === 'task_updated' || a.type === 'task_deleted').length;
    const moveCount = activities.filter((a) => a.type === 'task_moved').length;
    const checklistCount = activities.filter((a) => a.type === 'subtask_toggled').length;
    const columnCount = activities.filter((a) => a.type === 'column_created' || a.type === 'column_deleted').length;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 420 },
                    bgcolor: isDark ? '#0A0E18' : '#FFFFFF',
                    backgroundImage: isDark
                        ? 'radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), linear-gradient(180deg, rgba(16, 24, 39, 0.95) 0%, rgba(10, 14, 24, 0.98) 100%)'
                        : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                    borderLeft: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                    boxShadow: isDark
                        ? '-10px 0 30px rgba(0, 0, 0, 0.6), -2px 0 16px rgba(168, 85, 247, 0.15)'
                        : '-10px 0 30px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }
            }}
        >
            {/* Drawer Header */}
            <Box
                sx={{
                    p: 2.5,
                    pb: 1.8,
                    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '11px',
                            background: 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)',
                        }}
                    >
                        <HistoryIcon sx={{ color: '#FFFFFF', fontSize: 22 }} />
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', lineHeight: 1.2 }}>
                                Activity Log
                            </Typography>
                            <Chip
                                label={`${activities.length}`}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    bgcolor: isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.12)',
                                    color: isDark ? '#D8B4FE' : '#9333EA',
                                    borderRadius: '6px',
                                }}
                            />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            Real-time tracking of moves & completions
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {activities.length > 0 && (
                        <Tooltip title="Clear activity history">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                sx={{
                                    color: 'text.secondary',
                                    borderRadius: '8px',
                                    '&:hover': {
                                        color: '#F43F5E',
                                        bgcolor: isDark ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.08)',
                                    }
                                }}
                            >
                                <DeleteSweepIcon sx={{ fontSize: 19 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                    <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
                        <ClearIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Filter Pill Row */}
            <Box
                sx={{
                    px: 2.5,
                    py: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    overflowX: 'auto',
                    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {[
                    { id: 'all', label: 'All', count: activities.length },
                    { id: 'tasks', label: 'Tasks', count: taskCount },
                    { id: 'moves', label: 'Moves', count: moveCount },
                    { id: 'checklists', label: 'Checklists', count: checklistCount },
                    { id: 'columns', label: 'Columns', count: columnCount },
                ].map((item) => {
                    const isActive = filterCategory === item.id;
                    return (
                        <Chip
                            key={item.id}
                            label={`${item.label} (${item.count})`}
                            size="small"
                            clickable
                            onClick={() => setFilterCategory(item.id as FilterCategory)}
                            sx={{
                                height: 26,
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                borderRadius: '8px',
                                bgcolor: isActive
                                    ? (isDark ? '#A855F7' : '#9333EA')
                                    : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'),
                                color: isActive ? '#FFFFFF' : 'text.secondary',
                                border: `1px solid ${isActive ? 'transparent' : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)')}`,
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                    bgcolor: isActive ? (isDark ? '#9333EA' : '#7E22CE') : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                                }
                            }}
                        />
                    );
                })}
            </Box>

            {/* Activities Timeline Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    position: 'relative',
                }}
            >
                {filteredActivities.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            py: 8,
                            textAlign: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                bgcolor: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.06)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                border: `1px dashed ${isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.2)'}`,
                            }}
                        >
                            <HistoryIcon sx={{ fontSize: 28, color: '#A855F7' }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                            No Activity Recorded
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.82rem', maxWidth: 260, lineHeight: 1.5 }}>
                            {filterCategory === 'all'
                                ? "Actions like moving tasks, checking subtasks, and creating cards will appear here in real time."
                                : `No activities matching the "${filterCategory}" filter.`}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ position: 'relative', pl: 3.5 }}>
                        {/* Connecting timeline stem */}
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 13,
                                top: 12,
                                bottom: 12,
                                width: 2,
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                                borderRadius: '1px',
                            }}
                        />

                        {filteredActivities.map((act) => {
                            const cfg = getActivityConfig(act.type);
                            return (
                                <Fade in key={act.id} timeout={300}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            mb: 2,
                                            '&:last-child': { mb: 0 },
                                        }}
                                    >
                                        {/* Timeline node icon */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                left: -28,
                                                top: 6,
                                                width: 26,
                                                height: 26,
                                                borderRadius: '50%',
                                                bgcolor: isDark ? '#0D111E' : '#FFFFFF',
                                                border: `2px solid ${cfg.color}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 0 10px ${cfg.color}33`,
                                                zIndex: 1,
                                            }}
                                        >
                                            {cfg.icon}
                                        </Box>

                                        {/* Activity Card */}
                                        <Box
                                            sx={{
                                                p: 1.6,
                                                borderRadius: '12px',
                                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                                                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    borderColor: `${cfg.color}55`,
                                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.035)',
                                                    transform: 'translateX(2px)',
                                                }
                                            }}
                                        >
                                            {/* Tag & Timestamp row */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.6 }}>
                                                <Chip
                                                    label={cfg.label}
                                                    size="small"
                                                    sx={{
                                                        height: 18,
                                                        fontSize: '0.62rem',
                                                        fontWeight: 800,
                                                        bgcolor: cfg.bg,
                                                        color: cfg.color,
                                                        letterSpacing: '0.04em',
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem', fontWeight: 600 }}>
                                                    {formatRelativeTime(act.timestamp)}
                                                </Typography>
                                            </Box>

                                            {/* Main Title */}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    fontFamily: '"Outfit", sans-serif',
                                                    color: 'text.primary',
                                                    lineHeight: 1.3,
                                                    mb: 0.3,
                                                }}
                                            >
                                                {act.title}
                                            </Typography>

                                            {/* Narrative Description */}
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontSize: '0.76rem',
                                                    display: 'block',
                                                    lineHeight: 1.4,
                                                }}
                                            >
                                                {act.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Fade>
                            );
                        })}
                    </Box>
                )}
            </Box>

            {/* Bottom stats footer */}
            <Box
                sx={{
                    p: 1.8,
                    px: 2.5,
                    borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'}`,
                    bgcolor: isDark ? 'rgba(10, 14, 24, 0.85)' : 'rgba(248, 250, 252, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Auto-synced with Cloud Firestore
                </Typography>
                <Button
                    size="small"
                    variant="text"
                    onClick={onClose}
                    sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        color: 'primary.main',
                        py: 0.2,
                    }}
                >
                    Close Log
                </Button>
            </Box>
        </Drawer>
    );
};

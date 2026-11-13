import { 
    Box, 
    Chip, 
    Button, 
    Menu, 
    MenuItem, 
    Typography, 
    useTheme, 
    Tooltip, 
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { useState, memo } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import FlagIcon from "@mui/icons-material/Flag";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PaletteIcon from "@mui/icons-material/Palette";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import { 
    useStore, 
    type TaskPriority 
} from "../../hooks/useStore";

const COLOR_OPTIONS = [
    { label: "All Tags", value: "all", hex: "#6366F1" },
    { label: "Indigo", value: "#6366F1", hex: "#6366F1" },
    { label: "Cyber Cyan", value: "#06B6D4", hex: "#06B6D4" },
    { label: "Neon Purple", value: "#A855F7", hex: "#A855F7" },
    { label: "Emerald Mint", value: "#10B981", hex: "#10B981" },
    { label: "Solar Amber", value: "#F59E0B", hex: "#F59E0B" },
    { label: "Cyber Rose", value: "#F43F5E", hex: "#F43F5E" },
    { label: "Titanium", value: "#64748B", hex: "#64748B" },
];

const BoardFilterBar = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const {
        priorityFilter,
        dueFilter,
        tagColorFilter,
        sortBy,
        setPriorityFilter,
        setDueFilter,
        setTagColorFilter,
        setSortBy,
        resetFilters,
    } = useStore();

    // Menu anchors
    const [prioMenuAnchor, setPrioMenuAnchor] = useState<null | HTMLElement>(null);
    const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
    const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

    const isHighPriorityActive = priorityFilter === 'high_urgent';
    const isDueSoonActive = dueFilter === 'due_soon';
    const isOverdueActive = dueFilter === 'overdue';

    // Count active filters
    let activeFilterCount = 0;
    if (priorityFilter !== 'all') activeFilterCount++;
    if (dueFilter !== 'all') activeFilterCount++;
    if (tagColorFilter !== 'all') activeFilterCount++;
    if (sortBy !== 'manual') activeFilterCount++;

    return (
        <Box
            sx={{
                flexShrink: 0,
                px: { xs: 1.5, sm: 2.5, md: 3 },
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: { xs: 'nowrap', md: 'wrap' },
                overflowX: { xs: 'auto', md: 'visible' },
                gap: 1.2,
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                bgcolor: isDark ? '#0A0E17' : '#F8FAFC',
                position: 'relative',
                zIndex: 2,
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
            }}
        >
            {/* Left side: Quick Toggles & Filters */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: { xs: 'nowrap', sm: 'wrap' }, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary', mr: 0.5 }}>
                    <FilterListIcon sx={{ fontSize: 18 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Filters:
                    </Typography>
                </Box>

                {/* Quick Toggle: High Priority */}
                <Tooltip title="Filter tasks with Urgent or High priority">
                    <Chip
                        icon={<LocalFireDepartmentIcon sx={{ fontSize: '14px !important', color: isHighPriorityActive ? '#FFFFFF !important' : '#F97316 !important' }} />}
                        label="High Priority"
                        size="small"
                        clickable
                        onClick={() => setPriorityFilter(isHighPriorityActive ? 'all' : 'high_urgent')}
                        sx={{
                            height: 28,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            bgcolor: isHighPriorityActive 
                                ? '#F97316' 
                                : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
                            color: isHighPriorityActive ? '#FFFFFF' : 'text.primary',
                            border: `1px solid ${isHighPriorityActive ? '#F97316' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                            boxShadow: isHighPriorityActive ? '0 0 12px rgba(249, 115, 22, 0.4)' : 'none',
                            '&:hover': {
                                bgcolor: isHighPriorityActive ? '#EA580C' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                            }
                        }}
                    />
                </Tooltip>

                {/* Quick Toggle: Due Soon */}
                <Tooltip title="Filter tasks due within 3 days or today">
                    <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: '14px !important', color: isDueSoonActive ? '#FFFFFF !important' : '#6366F1 !important' }} />}
                        label="Due Soon"
                        size="small"
                        clickable
                        onClick={() => setDueFilter(isDueSoonActive ? 'all' : 'due_soon')}
                        sx={{
                            height: 28,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            bgcolor: isDueSoonActive 
                                ? '#6366F1' 
                                : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
                            color: isDueSoonActive ? '#FFFFFF' : 'text.primary',
                            border: `1px solid ${isDueSoonActive ? '#6366F1' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                            boxShadow: isDueSoonActive ? '0 0 12px rgba(99, 102, 241, 0.4)' : 'none',
                            '&:hover': {
                                bgcolor: isDueSoonActive ? '#4F46E5' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                            }
                        }}
                    />
                </Tooltip>

                {/* Quick Toggle: Overdue */}
                <Tooltip title="Filter tasks past their due date">
                    <Chip
                        icon={<WarningAmberIcon sx={{ fontSize: '14px !important', color: isOverdueActive ? '#FFFFFF !important' : '#F43F5E !important' }} />}
                        label="Overdue"
                        size="small"
                        clickable
                        onClick={() => setDueFilter(isOverdueActive ? 'all' : 'overdue')}
                        sx={{
                            height: 28,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            bgcolor: isOverdueActive 
                                ? '#F43F5E' 
                                : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'),
                            color: isOverdueActive ? '#FFFFFF' : 'text.primary',
                            border: `1px solid ${isOverdueActive ? '#F43F5E' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                            boxShadow: isOverdueActive ? '0 0 12px rgba(244, 63, 94, 0.4)' : 'none',
                            '&:hover': {
                                bgcolor: isOverdueActive ? '#E11D48' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'),
                            }
                        }}
                    />
                </Tooltip>

                {/* Priority Selector Menu */}
                <Button
                    size="small"
                    onClick={(e) => setPrioMenuAnchor(e.currentTarget)}
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                    sx={{
                        height: 28,
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        px: 1.2,
                        bgcolor: priorityFilter !== 'all' && !isHighPriorityActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        color: priorityFilter !== 'all' && !isHighPriorityActive ? 'primary.main' : 'text.secondary',
                        border: `1px solid ${priorityFilter !== 'all' && !isHighPriorityActive ? 'rgba(99, 102, 241, 0.3)' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                    }}
                >
                    Priority: {priorityFilter === 'all' ? 'All' : priorityFilter.toUpperCase()}
                </Button>

                <Menu
                    anchorEl={prioMenuAnchor}
                    open={Boolean(prioMenuAnchor)}
                    onClose={() => setPrioMenuAnchor(null)}
                    PaperProps={{
                        sx: {
                            borderRadius: '12px',
                            minWidth: 160,
                            bgcolor: isDark ? '#111726' : '#FFFFFF',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                        }
                    }}
                >
                    <MenuItem onClick={() => { setPriorityFilter('all'); setPrioMenuAnchor(null); }}>
                        <ListItemText primary="All Priorities" />
                        {priorityFilter === 'all' && <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                    </MenuItem>
                    {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((prio) => (
                        <MenuItem key={prio} onClick={() => { setPriorityFilter(prio); setPrioMenuAnchor(null); }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                                {prio === 'urgent' && <LocalFireDepartmentIcon sx={{ fontSize: 16, color: '#F43F5E' }} />}
                                {prio === 'high' && <PriorityHighIcon sx={{ fontSize: 16, color: '#F97316' }} />}
                                {prio === 'medium' && <FlagIcon sx={{ fontSize: 16, color: '#F59E0B' }} />}
                                {prio === 'low' && <LowPriorityIcon sx={{ fontSize: 16, color: '#10B981' }} />}
                            </ListItemIcon>
                            <ListItemText primary={prio.charAt(0).toUpperCase() + prio.slice(1)} />
                            {priorityFilter === prio && <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Tag Color Menu */}
                <Button
                    size="small"
                    onClick={(e) => setColorMenuAnchor(e.currentTarget)}
                    startIcon={<PaletteIcon sx={{ fontSize: 15 }} />}
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                    sx={{
                        height: 28,
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        px: 1.2,
                        bgcolor: tagColorFilter !== 'all' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        color: tagColorFilter !== 'all' ? 'primary.main' : 'text.secondary',
                        border: `1px solid ${tagColorFilter !== 'all' ? 'rgba(99, 102, 241, 0.3)' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                    }}
                >
                    Tag: {tagColorFilter === 'all' ? 'All' : 'Selected'}
                </Button>

                <Menu
                    anchorEl={colorMenuAnchor}
                    open={Boolean(colorMenuAnchor)}
                    onClose={() => setColorMenuAnchor(null)}
                    PaperProps={{
                        sx: {
                            borderRadius: '12px',
                            minWidth: 170,
                            bgcolor: isDark ? '#111726' : '#FFFFFF',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                        }
                    }}
                >
                    {COLOR_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} onClick={() => { setTagColorFilter(opt.value); setColorMenuAnchor(null); }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: opt.hex, mr: 1.5 }} />
                            <ListItemText primary={opt.label} />
                            {tagColorFilter === opt.value && <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Reset Filters Chip (Shown when active) */}
                {activeFilterCount > 0 && (
                    <Chip
                        icon={<ClearIcon sx={{ fontSize: '13px !important' }} />}
                        label={`Reset Filters (${activeFilterCount})`}
                        size="small"
                        onClick={resetFilters}
                        sx={{
                            height: 28,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            bgcolor: isDark ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.08)',
                            color: '#F43F5E',
                            border: '1px solid rgba(244, 63, 94, 0.25)',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: isDark ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.15)',
                            }
                        }}
                    />
                )}
            </Box>

            {/* Right side: Sorting Options */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <Button
                    size="small"
                    onClick={(e) => setSortMenuAnchor(e.currentTarget)}
                    startIcon={<SortIcon sx={{ fontSize: 16 }} />}
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                    sx={{
                        height: 28,
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        px: 1.4,
                        bgcolor: sortBy !== 'manual' ? (isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.08)') : 'transparent',
                        color: sortBy !== 'manual' ? 'primary.main' : 'text.secondary',
                        border: `1px solid ${sortBy !== 'manual' ? 'rgba(99, 102, 241, 0.35)' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                    }}
                >
                    Sort: {
                        sortBy === 'manual' ? 'Manual Order' :
                        sortBy === 'due_asc' ? 'Due Date (Earliest)' :
                        sortBy === 'priority_desc' ? 'Priority (Highest)' :
                        'A to Z'
                    }
                </Button>

                <Menu
                    anchorEl={sortMenuAnchor}
                    open={Boolean(sortMenuAnchor)}
                    onClose={() => setSortMenuAnchor(null)}
                    PaperProps={{
                        sx: {
                            borderRadius: '12px',
                            minWidth: 210,
                            bgcolor: isDark ? '#111726' : '#FFFFFF',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                        }
                    }}
                >
                    <MenuItem onClick={() => { setSortBy('manual'); setSortMenuAnchor(null); }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                            <DragHandleIcon sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary="Manual Order (Drag & Drop)" />
                        {sortBy === 'manual' && <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                    </MenuItem>
                    <MenuItem onClick={() => { setSortBy('due_asc'); setSortMenuAnchor(null); }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                            <CalendarTodayIcon sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary="Due Date (Earliest First)" />
                        {sortBy === 'due_asc' && <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                    </MenuItem>
                    <MenuItem onClick={() => { setSortBy('priority_desc'); setSortMenuAnchor(null); }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                            <LocalFireDepartmentIcon sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary="Priority (Highest First)" />
                        {sortBy === 'priority_desc' && <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                    </MenuItem>
                    <MenuItem onClick={() => { setSortBy('alphabetical'); setSortMenuAnchor(null); }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                            <SortByAlphaIcon sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary="Alphabetical (A → Z)" />
                        {sortBy === 'alphabetical' && <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};

export default memo(BoardFilterBar);

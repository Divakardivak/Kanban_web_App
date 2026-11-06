import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Box, 
    IconButton, 
    Typography, 
    useTheme, 
    Tooltip, 
    Chip, 
    Stack, 
    Checkbox, 
    LinearProgress 
} from "@mui/material";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import FlagIcon from "@mui/icons-material/Flag";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import type { TaskPriority, Subtask } from "../../hooks/useStore";

interface Props {
    open: boolean;
    mode: 'add' | 'edit';
    initialContent?: string;
    initialColor?: string;
    initialPriority?: TaskPriority;
    initialDueDate?: string;
    initialSubtasks?: Subtask[];
    onClose: () => void;
    onSave: (content: string, color: string, priority?: TaskPriority, dueDate?: string, subtasks?: Subtask[]) => void;
    onDelete?: () => void;
}

const COLOR_PALETTE = [
    { name: 'Default', hex: '#ffffff' },
    { name: 'Indigo Glow', hex: '#6366F1' },
    { name: 'Cyber Cyan', hex: '#06B6D4' },
    { name: 'Neon Purple', hex: '#A855F7' },
    { name: 'Emerald Mint', hex: '#10B981' },
    { name: 'Solar Amber', hex: '#F59E0B' },
    { name: 'Cyber Rose', hex: '#F43F5E' },
    { name: 'Titanium', hex: '#64748B' },
];

const PRIORITIES: { value: TaskPriority; label: string; color: string; icon: any }[] = [
    { value: 'urgent', label: 'Urgent', color: '#F43F5E', icon: LocalFireDepartmentIcon },
    { value: 'high', label: 'High', color: '#F97316', icon: PriorityHighIcon },
    { value: 'medium', label: 'Medium', color: '#F59E0B', icon: FlagIcon },
    { value: 'low', label: 'Low', color: '#10B981', icon: LowPriorityIcon },
];

const TaskModal = ({ 
    open, 
    mode, 
    initialContent = "", 
    initialColor = "#ffffff", 
    initialPriority,
    initialDueDate,
    initialSubtasks = [],
    onClose, 
    onSave, 
    onDelete 
}: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [content, setContent] = useState(initialContent);
    const [color, setColor] = useState(initialColor);
    const [priority, setPriority] = useState<TaskPriority | undefined>(initialPriority);
    const [dueDate, setDueDate] = useState<string | undefined>(initialDueDate);
    const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);
    const [newSubtaskInput, setNewSubtaskInput] = useState("");

    useEffect(() => {
        if (open) {
            setContent(initialContent);
            setColor(initialColor);
            setPriority(initialPriority);
            setDueDate(initialDueDate);
            setSubtasks(initialSubtasks || []);
            setNewSubtaskInput("");
        }
    }, [open, initialContent, initialColor, initialPriority, initialDueDate, initialSubtasks]);

    const handleSave = () => {
        if (content.trim()) {
            onSave(content.trim(), color, priority, dueDate || undefined, subtasks.length > 0 ? subtasks : undefined);
            onClose();
        }
    };

    // Subtask handlers
    const handleAddSubtask = () => {
        if (!newSubtaskInput.trim()) return;
        setSubtasks((prev) => [
            ...prev,
            { id: uuidv4(), title: newSubtaskInput.trim(), completed: false }
        ]);
        setNewSubtaskInput("");
    };

    const handleToggleSubtask = (id: string) => {
        setSubtasks((prev) =>
            prev.map(st => st.id === id ? { ...st, completed: !st.completed } : st)
        );
    };

    const handleDeleteSubtask = (id: string) => {
        setSubtasks((prev) => prev.filter(st => st.id !== id));
    };

    // Quick Date Helpers
    const setQuickDate = (daysFromToday: number) => {
        const target = new Date();
        target.setDate(target.getDate() + daysFromToday);
        const yyyy = target.getFullYear();
        const mm = String(target.getMonth() + 1).padStart(2, '0');
        const dd = String(target.getDate()).padStart(2, '0');
        setDueDate(`${yyyy}-${mm}-${dd}`);
    };

    const completedCount = subtasks.filter(s => s.completed).length;
    const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="sm"
            PaperProps={{
                sx: {
                    p: 1,
                    borderRadius: '20px',
                    bgcolor: isDark ? '#111726' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                    boxShadow: isDark 
                        ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15)' 
                        : '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    pb: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '10px',
                            bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {mode === 'add' ? (
                            <AddCircleOutlineIcon sx={{ fontSize: 20 }} />
                        ) : (
                            <EditNoteIcon sx={{ fontSize: 22 }} />
                        )}
                    </Box>
                    {mode === 'add' ? 'Create New Task' : 'Edit Task'}
                </Box>

                {mode === 'edit' && onDelete && (
                    <Tooltip title="Delete Task">
                        <IconButton 
                            onClick={onDelete} 
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    color: '#F43F5E',
                                    bgcolor: isDark ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.08)',
                                }
                            }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </DialogTitle>

            <DialogContent sx={{ pt: '10px !important' }}>
                {/* Description Input */}
                <TextField
                    autoFocus
                    label="Task Description"
                    placeholder="What needs to be done?"
                    fullWidth
                    multiline
                    minRows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{ mb: 2.5 }}
                />

                {/* Checklist & Subtasks Section */}
                <Box sx={{ mb: 3, p: 2, borderRadius: '12px', bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)', border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckBoxOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    fontWeight: 700, 
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: 'text.primary',
                                }}
                            >
                                Subtasks & Checklist
                            </Typography>
                        </Box>
                        {subtasks.length > 0 && (
                            <Typography variant="caption" sx={{ fontWeight: 700, color: progressPercent === 100 ? '#10B981' : 'primary.main' }}>
                                {completedCount}/{subtasks.length} ({progressPercent}%)
                            </Typography>
                        )}
                    </Box>

                    {/* Progress Bar in Modal */}
                    {subtasks.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={progressPercent}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 3,
                                        background: progressPercent === 100
                                            ? 'linear-gradient(90deg, #10B981, #059669)'
                                            : 'linear-gradient(90deg, #6366F1, #A855F7)',
                                    }
                                }}
                            />
                        </Box>
                    )}

                    {/* Subtasks List */}
                    {subtasks.length > 0 && (
                        <Stack spacing={0.8} sx={{ mb: 2 }}>
                            {subtasks.map((st) => (
                                <Box
                                    key={st.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: '4px 8px',
                                        borderRadius: '8px',
                                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)',
                                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
                                        '&:hover .del-subtask-btn': { opacity: 1 },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, minWidth: 0 }}>
                                        <Checkbox
                                            size="small"
                                            checked={st.completed}
                                            onChange={() => handleToggleSubtask(st.id)}
                                            sx={{ p: 0.5, color: 'text.secondary', '&.Mui-checked': { color: '#10B981' } }}
                                        />
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                textDecoration: st.completed ? 'line-through' : 'none',
                                                color: st.completed ? 'text.secondary' : 'text.primary',
                                                opacity: st.completed ? 0.6 : 1,
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {st.title}
                                        </Typography>
                                    </Box>

                                    <IconButton
                                        size="small"
                                        className="del-subtask-btn"
                                        onClick={() => handleDeleteSubtask(st.id)}
                                        sx={{
                                            p: 0.4,
                                            opacity: 0.4,
                                            transition: 'opacity 0.2s ease',
                                            '&:hover': { opacity: 1, color: '#F43F5E' }
                                        }}
                                    >
                                        <ClearIcon sx={{ fontSize: 15 }} />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>
                    )}

                    {/* Add Subtask Input */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            size="small"
                            placeholder="Add a checklist item... (press Enter)"
                            value={newSubtaskInput}
                            onChange={(e) => setNewSubtaskInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSubtask();
                                }
                            }}
                            fullWidth
                            sx={{
                                '& .MuiInputBase-input': { fontSize: '0.85rem', py: 0.8 }
                            }}
                        />
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleAddSubtask}
                            disabled={!newSubtaskInput.trim()}
                            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                            sx={{ minWidth: 80, borderRadius: '8px' }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>

                {/* Priority Selector */}
                <Box sx={{ mb: 2.5 }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            display: 'block',
                            fontWeight: 700, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'text.secondary',
                            mb: 1,
                        }}
                    >
                        Priority Level
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {PRIORITIES.map((p) => {
                            const isSelected = priority === p.value;
                            const IconComponent = p.icon;
                            return (
                                <Chip
                                    key={p.value}
                                    icon={<IconComponent sx={{ fontSize: '15px !important', color: isSelected ? '#FFFFFF !important' : `${p.color} !important` }} />}
                                    label={p.label}
                                    onClick={() => setPriority(isSelected ? undefined : p.value)}
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        bgcolor: isSelected 
                                            ? p.color 
                                            : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'),
                                        color: isSelected ? '#FFFFFF' : 'text.primary',
                                        border: `1px solid ${isSelected ? p.color : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                                        boxShadow: isSelected && isDark ? `0 0 12px ${p.color}88` : 'none',
                                        '&:hover': {
                                            bgcolor: isSelected ? p.color : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'),
                                            transform: 'translateY(-1px)',
                                        }
                                    }}
                                />
                            );
                        })}
                        {priority && (
                            <Chip
                                label="Clear Priority"
                                size="small"
                                onClick={() => setPriority(undefined)}
                                sx={{
                                    fontSize: '0.75rem',
                                    bgcolor: 'transparent',
                                    color: 'text.secondary',
                                    border: '1px dashed rgba(148, 163, 184, 0.3)',
                                    cursor: 'pointer',
                                }}
                            />
                        )}
                    </Stack>
                </Box>

                {/* Due Date Selector */}
                <Box sx={{ mb: 2.5 }}>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            display: 'block',
                            fontWeight: 700, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'text.secondary',
                            mb: 1,
                        }}
                    >
                        Due Date
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                        <TextField
                            type="date"
                            size="small"
                            value={dueDate || ''}
                            onChange={(e) => setDueDate(e.target.value || undefined)}
                            InputProps={{
                                startAdornment: (
                                    <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                                ),
                                endAdornment: dueDate ? (
                                    <IconButton size="small" onClick={() => setDueDate(undefined)} sx={{ p: 0.5 }}>
                                        <ClearIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                ) : null
                            }}
                            sx={{ minWidth: 190 }}
                        />

                        {/* Quick date shortcuts */}
                        <Stack direction="row" spacing={0.8}>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={() => setQuickDate(0)}
                                sx={{ py: 0.5, px: 1.2, fontSize: '0.75rem', borderRadius: '8px' }}
                            >
                                Today
                            </Button>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={() => setQuickDate(1)}
                                sx={{ py: 0.5, px: 1.2, fontSize: '0.75rem', borderRadius: '8px' }}
                            >
                                Tomorrow
                            </Button>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={() => setQuickDate(7)}
                                sx={{ py: 0.5, px: 1.2, fontSize: '0.75rem', borderRadius: '8px' }}
                            >
                                In 1 Week
                            </Button>
                        </Stack>
                    </Box>
                </Box>

                {/* Tag Color Palette */}
                <Box>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            display: 'block',
                            fontWeight: 700, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'text.secondary',
                            mb: 1.2,
                        }}
                    >
                        Tag Color
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
                        {COLOR_PALETTE.map((c) => {
                            const isSelected = color === c.hex;
                            const isWhite = c.hex === '#ffffff';
                            return (
                                <Tooltip key={c.hex} title={c.name}>
                                    <Box
                                        onClick={() => setColor(c.hex)}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            bgcolor: c.hex,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: isSelected
                                                ? `2px solid ${isDark ? '#FFFFFF' : '#0F172A'}`
                                                : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}`,
                                            boxShadow: isSelected
                                                ? (isDark ? `0 0 12px ${c.hex}` : `0 4px 10px rgba(0,0,0,0.15)`)
                                                : 'none',
                                            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'scale(1.15)',
                                            }
                                        }}
                                    >
                                        {isSelected && (
                                            <CheckIcon 
                                                sx={{ 
                                                    fontSize: 15, 
                                                    color: isWhite ? '#000000' : '#FFFFFF' 
                                                }} 
                                            />
                                        )}
                                    </Box>
                                </Tooltip>
                            );
                        })}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
                <Button 
                    onClick={onClose}
                    sx={{ color: 'text.secondary' }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained" 
                    disabled={!content.trim()}
                    sx={{ px: 3 }}
                >
                    {mode === 'add' ? 'Create Task' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskModal;

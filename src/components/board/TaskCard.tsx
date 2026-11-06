import { Draggable } from "@hello-pangea/dnd";
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    IconButton, 
    useTheme, 
    Tooltip, 
    Chip,
    LinearProgress
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import FlagIcon from "@mui/icons-material/Flag";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import type { Task, TaskPriority, Subtask } from "../../hooks/useStore";
import { useState } from "react";
import TaskModal from "../modals/TaskModal";
import { useNotification } from "../../context/NotificationContext";

interface Props {
    task: Task;
    index: number;
    columnId: string;
    deleteTask: (taskId: string, columnId: string) => void;
    updateTask: (taskId: string, content: string, color?: string, priority?: TaskPriority, dueDate?: string, subtasks?: Subtask[]) => void;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: any }> = {
    urgent: { label: 'URGENT', color: '#F43F5E', icon: LocalFireDepartmentIcon },
    high: { label: 'HIGH', color: '#F97316', icon: PriorityHighIcon },
    medium: { label: 'MED', color: '#F59E0B', icon: FlagIcon },
    low: { label: 'LOW', color: '#10B981', icon: LowPriorityIcon },
};

const getDueDateInfo = (dueDateStr?: string) => {
    if (!dueDateStr) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [y, m, d] = dueDateStr.split('-').map(Number);
    const due = new Date(y, m - 1, d);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            label: `${Math.abs(diffDays)}d overdue`,
            state: 'overdue',
            color: '#F43F5E',
            icon: WarningAmberIcon,
        };
    } else if (diffDays === 0) {
        return {
            label: 'Today',
            state: 'today',
            color: '#F59E0B',
            icon: AccessTimeIcon,
        };
    } else if (diffDays === 1) {
        return {
            label: 'Tomorrow',
            state: 'tomorrow',
            color: '#6366F1',
            icon: CalendarTodayIcon,
        };
    } else {
        const formatted = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        return {
            label: formatted,
            state: 'future',
            color: '#94A3B8',
            icon: CalendarTodayIcon,
        };
    }
};

const TaskCard = ({ task, index, updateTask, deleteTask, columnId }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [editModalOpen, setEditModalOpen] = useState(false);
    const { showNotification } = useNotification();

    const hasCustomColor = task.color && task.color !== '#ffffff' && task.color !== '#fff';
    const priorityConfig = task.priority ? PRIORITY_CONFIG[task.priority] : null;
    const dueDateInfo = getDueDateInfo(task.dueDate);

    // Subtasks Progress Calculation
    const hasSubtasks = Boolean(task.subtasks && task.subtasks.length > 0);
    const completedSubtasksCount = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
    const totalSubtasksCount = task.subtasks ? task.subtasks.length : 0;
    const progressPercent = totalSubtasksCount > 0 ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100) : 0;

    return (
        <>
            <Draggable draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                    <Card
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        sx={{
                            mb: 1.5,
                            borderRadius: '12px',
                            position: 'relative',
                            backgroundColor: isDark 
                                ? (snapshot.isDragging ? 'rgba(28, 36, 56, 0.95)' : 'rgba(18, 24, 38, 0.75)')
                                : (snapshot.isDragging ? '#FFFFFF' : '#FFFFFF'),
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${
                                snapshot.isDragging
                                    ? (isDark ? '#6366F1' : '#4F46E5')
                                    : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)')
                            }`,
                            boxShadow: snapshot.isDragging
                                ? (isDark 
                                    ? '0 16px 32px -4px rgba(0, 0, 0, 0.6), 0 0 20px rgba(99, 102, 241, 0.4)' 
                                    : '0 16px 32px -4px rgba(0, 0, 0, 0.16), 0 0 16px rgba(79, 70, 229, 0.25)')
                                : (isDark
                                    ? '0 2px 8px 0 rgba(0, 0, 0, 0.2)'
                                    : '0 2px 6px 0 rgba(0, 0, 0, 0.04)'),
                            transform: snapshot.isDragging ? 'rotate(2deg) scale(1.02)' : 'none',
                            transition: snapshot.isDragging 
                                ? 'box-shadow 0.2s ease, transform 0.2s ease'
                                : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'grab',
                            '&:active': {
                                cursor: 'grabbing',
                            },
                            '&:hover': {
                                transform: snapshot.isDragging ? 'rotate(2deg) scale(1.02)' : 'translateY(-2px)',
                                borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                                boxShadow: isDark 
                                    ? '0 8px 20px -4px rgba(0, 0, 0, 0.4), 0 0 12px rgba(99, 102, 241, 0.12)' 
                                    : '0 8px 18px -4px rgba(0, 0, 0, 0.08)',
                                '& .task-actions': {
                                    opacity: 1,
                                    transform: 'translateX(0)',
                                },
                                '& .drag-handle-icon': {
                                    opacity: 0.7,
                                }
                            },
                        }}
                    >
                        {/* Optional Glowing Accent Strip */}
                        {hasCustomColor && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    width: 4,
                                    borderRadius: '12px 0 0 12px',
                                    bgcolor: task.color,
                                    boxShadow: isDark ? `0 0 10px ${task.color}` : 'none',
                                }}
                            />
                        )}

                        <CardContent
                            sx={{
                                p: '12px 14px 14px 16px !important',
                                pb: '14px !important',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            {/* Card Top Row: Drag Handle + Badges (Priority / Due Date) + Hover Actions */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, minHeight: 24 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap', flexGrow: 1, minWidth: 0 }}>
                                    {/* Subtle Drag Handle Indicator */}
                                    <Box
                                        className="drag-handle-icon"
                                        sx={{
                                            color: 'text.secondary',
                                            opacity: 0.25,
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'opacity 0.2s ease',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <DragIndicatorIcon sx={{ fontSize: 16 }} />
                                    </Box>

                                    {/* Priority Badge */}
                                    {priorityConfig && (
                                        <Tooltip title={`Priority: ${priorityConfig.label}`}>
                                            <Chip
                                                icon={<priorityConfig.icon sx={{ fontSize: '13px !important', color: `${priorityConfig.color} !important` }} />}
                                                label={priorityConfig.label}
                                                size="small"
                                                sx={{
                                                    height: 20,
                                                    fontSize: '0.66rem',
                                                    fontWeight: 800,
                                                    letterSpacing: '0.04em',
                                                    borderRadius: '6px',
                                                    bgcolor: isDark ? `${priorityConfig.color}18` : `${priorityConfig.color}12`,
                                                    color: priorityConfig.color,
                                                    border: `1px solid ${priorityConfig.color}35`,
                                                    '& .MuiChip-label': { px: 0.6 },
                                                }}
                                            />
                                        </Tooltip>
                                    )}

                                    {/* Due Date Badge */}
                                    {dueDateInfo && (
                                        <Tooltip title={`Due Date: ${task.dueDate}`}>
                                            <Chip
                                                icon={<dueDateInfo.icon sx={{ fontSize: '11px !important', color: `${dueDateInfo.color} !important` }} />}
                                                label={dueDateInfo.label}
                                                size="small"
                                                sx={{
                                                    height: 20,
                                                    fontSize: '0.66rem',
                                                    fontWeight: 700,
                                                    borderRadius: '6px',
                                                    bgcolor: isDark 
                                                        ? (dueDateInfo.state === 'overdue' ? 'rgba(244, 63, 94, 0.18)' : 'rgba(255, 255, 255, 0.05)')
                                                        : (dueDateInfo.state === 'overdue' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(0, 0, 0, 0.04)'),
                                                    color: dueDateInfo.color,
                                                    border: `1px solid ${
                                                        dueDateInfo.state === 'overdue' 
                                                            ? 'rgba(244, 63, 94, 0.4)' 
                                                            : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')
                                                    }`,
                                                    '& .MuiChip-label': { px: 0.6 },
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </Box>

                                {/* Floating Actions (Clean hover reveal) */}
                                <Box
                                    className="task-actions"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        opacity: { xs: 1, sm: 0 },
                                        transform: { xs: 'none', sm: 'translateX(4px)' },
                                        transition: 'all 0.2s ease',
                                        bgcolor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(241, 245, 249, 0.9)',
                                        backdropFilter: 'blur(4px)',
                                        p: 0.3,
                                        borderRadius: '8px',
                                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                                    }}
                                >
                                    <Tooltip title="Edit task">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditModalOpen(true);
                                            }}
                                            sx={{
                                                p: 0.5,
                                                color: 'text.secondary',
                                                borderRadius: '6px',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)',
                                                },
                                            }}
                                        >
                                            <EditIcon sx={{ fontSize: 15 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete task">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteTask(task.id, columnId);
                                                showNotification("Task deleted", "info");
                                            }}
                                            sx={{
                                                p: 0.5,
                                                color: 'text.secondary',
                                                borderRadius: '6px',
                                                '&:hover': {
                                                    color: '#F43F5E',
                                                    bgcolor: isDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(244, 63, 94, 0.1)',
                                                },
                                            }}
                                        >
                                            <DeleteOutlineIcon sx={{ fontSize: 15 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {/* Task Content */}
                            <Typography
                                variant="body1"
                                sx={{
                                    wordBreak: 'break-word',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    lineHeight: 1.45,
                                    color: 'text.primary',
                                }}
                            >
                                {task.content}
                            </Typography>

                            {/* Subtasks Progress Bar & Checklist Summary */}
                            {hasSubtasks && (
                                <Box sx={{ mt: 0.5, width: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                            <CheckBoxOutlinedIcon 
                                                sx={{ 
                                                    fontSize: 14, 
                                                    color: progressPercent === 100 ? '#10B981' : 'text.secondary' 
                                                }} 
                                            />
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    fontSize: '0.73rem', 
                                                    fontWeight: 700, 
                                                    color: progressPercent === 100 ? '#10B981' : 'text.secondary' 
                                                }}
                                            >
                                                {completedSubtasksCount}/{totalSubtasksCount} subtasks
                                            </Typography>
                                        </Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                fontSize: '0.73rem', 
                                                fontWeight: 800, 
                                                color: progressPercent === 100 ? '#10B981' : 'primary.main' 
                                            }}
                                        >
                                            {progressPercent}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressPercent}
                                        sx={{
                                            height: 5,
                                            borderRadius: 2.5,
                                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 2.5,
                                                background: progressPercent === 100
                                                    ? 'linear-gradient(90deg, #10B981, #059669)'
                                                    : 'linear-gradient(90deg, #6366F1, #A855F7)',
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}
            </Draggable>

            <TaskModal
                open={editModalOpen}
                mode="edit"
                initialContent={task.content}
                initialColor={task.color}
                initialPriority={task.priority}
                initialDueDate={task.dueDate}
                initialSubtasks={task.subtasks}
                onClose={() => setEditModalOpen(false)}
                onSave={(content, color, priority, dueDate, subtasks) => {
                    updateTask(task.id, content, color, priority, dueDate, subtasks);
                    showNotification("Task updated", "success");
                }}
                onDelete={() => {
                    deleteTask(task.id, columnId);
                    showNotification("Task deleted", "info");
                }}
            />
        </>
    );
};

export default TaskCard;

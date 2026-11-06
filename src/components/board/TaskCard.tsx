import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, Typography, Box, IconButton, useTheme, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { Task } from "../../hooks/useStore";
import { useState } from "react";
import TaskModal from "../modals/TaskModal";
import { useNotification } from "../../context/NotificationContext";

interface Props {
    task: Task;
    index: number;
    columnId: string;
    deleteTask: (taskId: string, columnId: string) => void;
    updateTask: (taskId: string, content: string, color?: string) => void;
}

const TaskCard = ({ task, index, updateTask, deleteTask, columnId }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [editModalOpen, setEditModalOpen] = useState(false);
    const { showNotification } = useNotification();

    const hasCustomColor = task.color && task.color !== '#ffffff' && task.color !== '#fff';

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
                            overflow: 'hidden',
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
                                    bgcolor: task.color,
                                    boxShadow: isDark ? `0 0 10px ${task.color}` : 'none',
                                }}
                            />
                        )}

                        <CardContent
                            sx={{
                                p: '14px 14px 14px 16px !important',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                            }}
                        >
                            {/* Subtle Drag Handle Indicator */}
                            <Box
                                className="drag-handle-icon"
                                sx={{
                                    color: 'text.secondary',
                                    opacity: 0.25,
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 0.2,
                                    transition: 'opacity 0.2s ease',
                                    flexShrink: 0,
                                }}
                            >
                                <DragIndicatorIcon sx={{ fontSize: 16 }} />
                            </Box>

                            {/* Task Content */}
                            <Box sx={{ flexGrow: 1, minWidth: 0, mr: 0.5 }}>
                                {hasCustomColor && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: task.color,
                                                mr: 1,
                                                boxShadow: isDark ? `0 0 8px ${task.color}` : 'none',
                                            }}
                                        />
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                fontSize: '0.68rem', 
                                                fontWeight: 700, 
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                color: 'text.secondary' 
                                            }}
                                        >
                                            Tagged
                                        </Typography>
                                    </Box>
                                )}
                                <Typography
                                    variant="body1"
                                    sx={{
                                        wordBreak: 'break-word',
                                        fontWeight: 500,
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                        color: 'text.primary',
                                    }}
                                >
                                    {task.content}
                                </Typography>
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
                        </CardContent>
                    </Card>
                )}
            </Draggable>

            <TaskModal
                open={editModalOpen}
                mode="edit"
                initialContent={task.content}
                initialColor={task.color}
                onClose={() => setEditModalOpen(false)}
                onSave={(content, color) => {
                    updateTask(task.id, content, color);
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

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Typography, IconButton, Paper, Button, Chip, useTheme, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import type { Column, Task, TaskPriority, Subtask } from "../../hooks/useStore";
import TaskCard from "./TaskCard";
import { useState } from "react";
import TaskModal from "../modals/TaskModal";
import ConfirmModal from "../modals/ConfirmModal";
import ColumnModal from "../modals/ColumnModal";
import { useNotification } from "../../context/NotificationContext";

interface Props {
    column: Column;
    tasks: Task[];
    index: number;
    deleteColumn: (colId: string) => void;
    updateColumn: (colId: string, title: string, color?: string) => void;
    addTask: (colId: string, content: string, color?: string, priority?: TaskPriority, dueDate?: string, subtasks?: Subtask[]) => void;
    deleteTask: (taskId: string, columnId: string) => void;
    updateTask: (taskId: string, content: string, color?: string, priority?: TaskPriority, dueDate?: string, subtasks?: Subtask[]) => void;
}

const BoardColumn = ({
    column,
    tasks,
    index,
    deleteColumn,
    updateColumn,
    addTask,
    deleteTask,
    updateTask
}: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [editColumnModalOpen, setEditColumnModalOpen] = useState(false);
    const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const { showNotification } = useNotification();

    const columnColor = column.color && column.color !== '#e0e0e0'
        ? column.color
        : (isDark ? '#6366F1' : '#4F46E5');

    return (
        <>
            <Draggable draggableId={column.id} index={index}>
                {(provided) => (
                    <Paper
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        elevation={0}
                        sx={{
                            width: { xs: '84vw', sm: 310, md: 320 },
                            minWidth: { xs: '84vw', sm: 310, md: 320 },
                            maxWidth: { xs: 340, sm: 340 },
                            height: '100%',
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: isDark
                                ? 'rgba(12, 17, 29, 0.75)'
                                : 'rgba(241, 245, 249, 0.85)',
                            backdropFilter: 'blur(16px)',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
                            borderRadius: '16px',
                            mr: { xs: 1.5, sm: 2.5 },
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: isDark
                                ? '0 4px 20px -2px rgba(0, 0, 0, 0.35)'
                                : '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        {/* Futuristic Glowing Top Accent Bar */}
                        <Box
                            sx={{
                                height: 4,
                                width: '100%',
                                background: `linear-gradient(90deg, ${columnColor} 0%, ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(79, 70, 229, 0.3)'} 100%)`,
                                boxShadow: isDark ? `0 0 12px ${columnColor}` : 'none',
                            }}
                        />

                        {/* Column Header */}
                        <Box
                            {...provided.dragHandleProps}
                            sx={{
                                p: '14px 16px 10px 16px',
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: 'grab',
                                '&:active': { cursor: 'grabbing' },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}>
                                {/* Status dot indicator */}
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        bgcolor: columnColor,
                                        boxShadow: isDark ? `0 0 10px ${columnColor}` : 'none',
                                        flexShrink: 0,
                                    }}
                                />

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '0.98rem',
                                        letterSpacing: '-0.01em',
                                        color: 'text.primary',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {column.title}
                                </Typography>

                                <Chip
                                    label={tasks.length}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        minWidth: 22,
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                                        color: 'text.secondary',
                                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
                                        '& .MuiChip-label': { px: 0.8 },
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Tooltip title="Edit column">
                                    <IconButton
                                        size="small"
                                        onClick={() => setEditColumnModalOpen(true)}
                                        sx={{
                                            color: 'text.secondary',
                                            borderRadius: '8px',
                                            p: 0.6,
                                            '&:hover': {
                                                color: 'primary.main',
                                                bgcolor: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(79, 70, 229, 0.08)',
                                            }
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete column">
                                    <IconButton
                                        size="small"
                                        onClick={() => setConfirmDeleteOpen(true)}
                                        sx={{
                                            color: 'text.secondary',
                                            borderRadius: '8px',
                                            p: 0.6,
                                            '&:hover': {
                                                color: '#F43F5E',
                                                bgcolor: isDark ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.08)',
                                            }
                                        }}
                                    >
                                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        {/* Task Droppable Area */}
                        <Droppable droppableId={column.id} type="task">
                            {(provided, snapshot) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{
                                        flexGrow: 1,
                                        overflowY: 'auto',
                                        px: 1.5,
                                        py: 1,
                                        minHeight: 120,
                                        transition: 'all 0.2s ease',
                                        borderRadius: '10px',
                                        backgroundColor: snapshot.isDraggingOver
                                            ? (isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.05)')
                                            : 'transparent',
                                        outline: snapshot.isDraggingOver
                                            ? `2px dashed ${isDark ? '#6366F1' : '#4F46E5'}`
                                            : '2px dashed transparent',
                                        outlineOffset: '-4px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {tasks.map((task, index) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            index={index}
                                            columnId={column.id}
                                            deleteTask={deleteTask}
                                            updateTask={updateTask}
                                        />
                                    ))}
                                    {provided.placeholder}

                                    {tasks.length === 0 && !snapshot.isDraggingOver && (
                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                py: 4,
                                                opacity: 0.45,
                                                color: 'text.secondary',
                                            }}
                                        >
                                            <AssignmentTurnedInIcon sx={{ fontSize: 30, mb: 0.8 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                Drop or add tasks here
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Droppable>

                        {/* Clean Add Task Button at Bottom */}
                        <Box sx={{ p: 1.5, pt: 0.5 }}>
                            <Button
                                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                                fullWidth
                                onClick={() => setAddTaskModalOpen(true)}
                                sx={{
                                    py: 1,
                                    borderRadius: '10px',
                                    justifyContent: 'center',
                                    color: 'text.secondary',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                                    border: `1px dashed ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'}`,
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        bgcolor: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(79, 70, 229, 0.08)',
                                        color: isDark ? '#A5B4FC' : '#4F46E5',
                                        borderColor: isDark ? '#818CF8' : '#6366F1',
                                        transform: 'translateY(-1px)',
                                    }
                                }}
                            >
                                Add a task
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Draggable>

            <TaskModal
                open={addTaskModalOpen}
                mode="add"
                onClose={() => setAddTaskModalOpen(false)}
                onSave={(content, color, priority, dueDate, subtasks) => {
                    addTask(column.id, content, color, priority, dueDate, subtasks);
                    showNotification("Task added successfully", "success");
                }}
            />

            <ColumnModal
                open={editColumnModalOpen}
                mode="edit"
                initialTitle={column.title}
                initialColor={column.color}
                onClose={() => setEditColumnModalOpen(false)}
                onSave={(title, color) => {
                    updateColumn(column.id, title, color);
                    showNotification("Column updated", "success");
                }}
            />

            <ConfirmModal
                open={confirmDeleteOpen}
                title="Delete Column"
                content={`Are you sure you want to delete column "${column.title}" and all its tasks?`}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={() => {
                    deleteColumn(column.id);
                    showNotification("Column deleted", "warning");
                }}
            />
        </>
    );
};

export default BoardColumn;

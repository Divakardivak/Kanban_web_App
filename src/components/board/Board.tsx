import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Box, Button, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useStore, type Task } from "../../hooks/useStore";
import BoardColumn from "./BoardColumn";
import BoardFilterBar from "./BoardFilterBar";
import { useEffect, useState, useMemo } from "react";
import ColumnModal from "../modals/ColumnModal";
import { useNotification } from "../../context/NotificationContext";

const PRIORITY_WEIGHT: Record<string, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
};

const Board = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const {
        tasks,
        columns,
        columnOrder,
        moveTask,
        moveColumn,
        addColumn,
        deleteColumn,
        updateColumn,
        addTask,
        deleteTask,
        updateTask,
        searchQuery,
        priorityFilter,
        dueFilter,
        tagColorFilter,
        sortBy,
    } = useStore();

    const [winReady, setWinReady] = useState(false);
    const [addColumnModalOpen, setAddColumnModalOpen] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        setWinReady(true);
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === "column") {
            moveColumn(source.index, destination.index);
            return;
        }

        moveTask(
            draggableId,
            source.droppableId,
            destination.droppableId,
            source.index,
            destination.index
        );
    };

    // Filter and Sort calculation for all columns
    const filteredTasksByColumn = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result: Record<string, Task[]> = {};

        columnOrder.forEach((colId) => {
            const column = columns[colId];
            if (!column) return;

            const colTasks = column.taskIds
                .map((id) => tasks[id])
                .filter(Boolean)
                .filter((task) => {
                    // Search query filter (matches content or subtasks)
                    if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        const matchesContent = task.content.toLowerCase().includes(q);
                        const matchesSubtask = task.subtasks?.some((st) => st.title.toLowerCase().includes(q));
                        if (!matchesContent && !matchesSubtask) return false;
                    }

                    // Priority filter
                    if (priorityFilter !== 'all') {
                        if (priorityFilter === 'high_urgent') {
                            if (task.priority !== 'urgent' && task.priority !== 'high') return false;
                        } else if (task.priority !== priorityFilter) {
                            return false;
                        }
                    }

                    // Tag color filter
                    if (tagColorFilter !== 'all') {
                        if (task.color !== tagColorFilter) return false;
                    }

                    // Due date filter
                    if (dueFilter !== 'all') {
                        if (!task.dueDate) return false;
                        const [y, m, d] = task.dueDate.split('-').map(Number);
                        const taskDue = new Date(y, m - 1, d);
                        taskDue.setHours(0, 0, 0, 0);
                        const diffDays = Math.round((taskDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                        if (dueFilter === 'overdue') {
                            if (diffDays >= 0) return false;
                        } else if (dueFilter === 'due_soon') {
                            // Due within 3 days or today or overdue
                            if (diffDays > 3) return false;
                        } else if (dueFilter === 'has_due') {
                            if (!task.dueDate) return false;
                        }
                    }

                    return true;
                })
                .sort((a, b) => {
                    if (sortBy === 'due_asc') {
                        if (!a.dueDate) return 1;
                        if (!b.dueDate) return -1;
                        return a.dueDate.localeCompare(b.dueDate);
                    }
                    if (sortBy === 'priority_desc') {
                        const weightA = a.priority ? PRIORITY_WEIGHT[a.priority] || 0 : 0;
                        const weightB = b.priority ? PRIORITY_WEIGHT[b.priority] || 0 : 0;
                        return weightB - weightA;
                    }
                    if (sortBy === 'alphabetical') {
                        return a.content.localeCompare(b.content);
                    }
                    return 0; // 'manual' keeps drag-and-drop order
                });

            result[colId] = colTasks;
        });

        return result;
    }, [columnOrder, columns, tasks, searchQuery, priorityFilter, dueFilter, tagColorFilter, sortBy]);

    if (!winReady) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
            {/* Quick Filters & Sorting Bar */}
            <BoardFilterBar />

            {/* Board Canvas Area */}
            <Box sx={{ flexGrow: 1, height: 'calc(100% - 48px)', overflow: 'hidden' }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-columns" direction="horizontal" type="column">
                        {(provided) => (
                            <Box
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                sx={{
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    overflowX: "auto",
                                    overflowY: "hidden",
                                    alignItems: "flex-start",
                                    p: { xs: 1.5, sm: 2.5, md: 3 },
                                    WebkitOverflowScrolling: 'touch',
                                    '&::-webkit-scrollbar': {
                                        height: 8,
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: 'transparent',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                                        borderRadius: 4,
                                        '&:hover': {
                                            backgroundColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(79, 70, 229, 0.3)',
                                        }
                                    }
                                }}
                            >
                                {columnOrder.map((colId, index) => {
                                    const column = columns[colId];
                                    if (!column) return null;

                                    const colTasks = filteredTasksByColumn[colId] || [];

                                    return (
                                        <BoardColumn
                                            key={column.id}
                                            column={column}
                                            tasks={colTasks}
                                            index={index}
                                            deleteColumn={deleteColumn}
                                            updateColumn={updateColumn}
                                            addTask={addTask}
                                            deleteTask={deleteTask}
                                            updateTask={updateTask}
                                        />
                                    );
                                })}
                                {provided.placeholder}

                                {/* Futuristic Add Column Card */}
                                <Box sx={{ width: 280, minWidth: 280 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setAddColumnModalOpen(true)}
                                        sx={{
                                            width: '100%',
                                            minHeight: 140,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1.2,
                                            p: 3,
                                            borderRadius: '16px',
                                            borderStyle: 'dashed',
                                            borderWidth: 2,
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
                                            bgcolor: isDark ? 'rgba(12, 17, 29, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                                            backdropFilter: 'blur(10px)',
                                            color: 'text.secondary',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                borderColor: isDark ? '#818CF8' : '#6366F1',
                                                bgcolor: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(79, 70, 229, 0.05)',
                                                color: isDark ? '#A5B4FC' : '#4F46E5',
                                                transform: 'translateY(-2px)',
                                                boxShadow: isDark 
                                                    ? '0 10px 25px -5px rgba(0,0,0,0.4), 0 0 15px rgba(99,102,241,0.2)' 
                                                    : '0 10px 20px -5px rgba(0,0,0,0.06)',
                                                '& .add-col-icon-box': {
                                                    bgcolor: 'primary.main',
                                                    color: '#FFFFFF',
                                                    boxShadow: isDark ? '0 0 16px rgba(99, 102, 241, 0.6)' : '0 4px 12px rgba(79, 70, 229, 0.3)',
                                                }
                                            }
                                        }}
                                    >
                                        <Box
                                            className="add-col-icon-box"
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: '50%',
                                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.25s ease',
                                            }}
                                        >
                                            <AddIcon sx={{ fontSize: 24 }} />
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                Add New Column
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                Expand your workflow
                                            </Typography>
                                        </Box>
                                    </Button>
                                </Box>

                                {/* Empty board state if 0 columns */}
                                {columnOrder.length === 0 && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            textAlign: 'center',
                                            p: 4,
                                        }}
                                    >
                                        <ViewColumnIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.3, mb: 1.5 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                            Your FlowBoard is empty
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                            Start by creating your first column to organize tasks.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => setAddColumnModalOpen(true)}
                                        >
                                            Create Column
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>

            <ColumnModal
                open={addColumnModalOpen}
                mode="add"
                onClose={() => setAddColumnModalOpen(false)}
                onSave={(title, color) => {
                    addColumn(title, color);
                    showNotification("Column added successfully", "success");
                }}
            />
        </Box>
    );
};

export default Board;

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Box, Button, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { useStore } from "../../hooks/useStore";
import BoardColumn from "./BoardColumn";
import { useEffect, useState } from "react";
import ColumnModal from "../modals/ColumnModal";
import { useNotification } from "../../context/NotificationContext";

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

    if (!winReady) {
        return null;
    }

    return (
        <>
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
                                p: 3,
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

                                const colTasks = column.taskIds
                                    .map((taskId) => tasks[taskId])
                                    .filter(Boolean)
                                    .filter(task => task.content.toLowerCase().includes(searchQuery.toLowerCase()));

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

            <ColumnModal
                open={addColumnModalOpen}
                mode="add"
                onClose={() => setAddColumnModalOpen(false)}
                onSave={(title, color) => {
                    addColumn(title, color);
                    showNotification("Column added successfully", "success");
                }}
            />
        </>
    );
};

export default Board;

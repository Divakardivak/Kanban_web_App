import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// DEFINE THE STRUCTURE FOR A SINGLE TASK
export interface Task {
    id: string;
    content: string;
    color?: string; // OPTIONAL COLOR PROPERTY FOR TASK STYLING
}

// DEFINE THE STRUCTURE FOR A BOARD COLUMN
export interface Column {
    id: string;
    title: string;
    taskIds: string[];
    color?: string; // OPTIONAL COLOR FOR COLUMN HEADER
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

// DEFINE THE OVERALL BOARD STATE INTERFACE
export interface BoardState {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];

    // CLOUD SYNC STATE
    syncStatus: SyncStatus;
    setSyncStatus: (status: SyncStatus) => void;
    syncFromRemote: (payload: { tasks: Record<string, Task>; columns: Record<string, Column>; columnOrder: string[] }) => void;
    setBoardData: (payload: { tasks: Record<string, Task>; columns: Record<string, Column>; columnOrder: string[] }) => void;

    // ACTIONS
    addTask: (columnId: string, content: string, color?: string) => void;
    deleteTask: (taskId: string, columnId: string) => void;
    moveTask: (
        taskId: string,
        sourceColId: string,
        destColId: string,
        sourceIndex: number,
        destIndex: number
    ) => void;
    moveColumn: (sourceIndex: number, destIndex: number) => void;
    addColumn: (title: string, color?: string) => void;
    deleteColumn: (columnId: string) => void;
    updateColumn: (columnId: string, title: string, color?: string) => void;
    updateTask: (taskId: string, content: string, color?: string) => void;

    // SEARCH & RESET
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    clearBoard: () => void;
}

// INITIAL MOCK DATA FOR THE BOARD
const initialData: Pick<BoardState, "tasks" | "columns" | "columnOrder" | "searchQuery" | "syncStatus"> = {
    searchQuery: "",
    syncStatus: "idle",
    tasks: {
        "task-1": { id: "task-1", content: "Take out the garbage", color: '#ffffff' },
        "task-2": { id: "task-2", content: "Watch my favorite show", color: '#ffffff' },
        "task-3": { id: "task-3", content: "Charge my phone", color: '#ffffff' },
        "task-4": { id: "task-4", content: "Cook dinner", color: '#ffffff' },
    },
    columns: {
        "column-1": {
            id: "column-1",
            title: "To do",
            taskIds: ["task-1", "task-2", "task-3", "task-4"],
            color: '#6366F1'
        },
        "column-2": {
            id: "column-2",
            title: "In progress",
            taskIds: [],
            color: '#A855F7'
        },
        "column-3": {
            id: "column-3",
            title: "Done",
            taskIds: [],
            color: '#10B981'
        },
    },
    columnOrder: ["column-1", "column-2", "column-3"],
};

export const useStore = create<BoardState>()(
    persist(
        (set) => ({
            ...initialData,

            setSyncStatus: (status) => set({ syncStatus: status }),

            syncFromRemote: ({ tasks, columns, columnOrder }) =>
                set({
                    tasks,
                    columns,
                    columnOrder,
                }),

            setBoardData: ({ tasks, columns, columnOrder }) =>
                set({
                    tasks,
                    columns,
                    columnOrder,
                }),

            setSearchQuery: (query) => set({ searchQuery: query }),

            clearBoard: () => set({
                tasks: {},
                columns: {},
                columnOrder: []
            }),

            // ADD A NEW TASK TO A SPECIFIC COLUMN
            addTask: (columnId, content, color) =>
                set((state) => {
                    const newTaskId = uuidv4();
                    const newTask: Task = { id: newTaskId, content, color: color || '#ffffff' };

                    const column = state.columns[columnId];
                    if (!column) return state;

                    const newTaskIds = Array.from(column.taskIds);
                    newTaskIds.push(newTaskId);

                    return {
                        tasks: { ...state.tasks, [newTaskId]: newTask },
                        columns: {
                            ...state.columns,
                            [columnId]: { ...column, taskIds: newTaskIds },
                        },
                    };
                }),

            // UPDATE TASK CONTENT AND COLOR
            updateTask: (taskId, content, color) =>
                set((state) => {
                    const task = state.tasks[taskId];
                    if (!task) return state;
                    return {
                        tasks: {
                            ...state.tasks,
                            [taskId]: { ...task, content, color: color !== undefined ? color : task.color }
                        }
                    };
                }),

            // DELETE A TASK FROM A COLUMN AND REMOVE IT FROM STATE
            deleteTask: (taskId, columnId) =>
                set((state) => {
                    const newTasks = { ...state.tasks };
                    delete newTasks[taskId];

                    const column = state.columns[columnId];
                    if (!column) return state;
                    const newTaskIds = column.taskIds.filter((id) => id !== taskId);

                    return {
                        tasks: newTasks,
                        columns: {
                            ...state.columns,
                            [columnId]: { ...column, taskIds: newTaskIds },
                        },
                    };
                }),

            // HANDLE DRAG AND DROP FOR TASKS (WITHIN OR BETWEEN COLUMNS)
            moveTask: (taskId, sourceColId, destColId, sourceIndex, destIndex) =>
                set((state) => {
                    const sourceCol = state.columns[sourceColId];
                    const destCol = state.columns[destColId];
                    if (!sourceCol || !destCol) return state;

                    const sourceTaskIds = Array.from(sourceCol.taskIds);
                    sourceTaskIds.splice(sourceIndex, 1);

                    // MOVING WITHIN THE SAME COLUMN
                    if (sourceColId === destColId) {
                        sourceTaskIds.splice(destIndex, 0, taskId);
                        return {
                            columns: {
                                ...state.columns,
                                [sourceColId]: { ...sourceCol, taskIds: sourceTaskIds },
                            },
                        };
                    }

                    // MOVING TO A DIFFERENT COLUMN
                    const destTaskIds = Array.from(destCol.taskIds);
                    destTaskIds.splice(destIndex, 0, taskId);

                    return {
                        columns: {
                            ...state.columns,
                            [sourceColId]: { ...sourceCol, taskIds: sourceTaskIds },
                            [destColId]: { ...destCol, taskIds: destTaskIds },
                        },
                    };
                }),

            // HANDLE DRAG AND DROP FOR COLUMNS
            moveColumn: (sourceIndex, destIndex) =>
                set((state) => {
                    const newColumnOrder = Array.from(state.columnOrder);
                    const [removed] = newColumnOrder.splice(sourceIndex, 1);
                    newColumnOrder.splice(destIndex, 0, removed);
                    return { columnOrder: newColumnOrder };
                }),

            addColumn: (title, color) =>
                set((state) => {
                    const newColId = uuidv4();
                    const newCol = {
                        id: newColId,
                        title,
                        taskIds: [],
                        color: color || '#6366F1',
                    };
                    return {
                        columns: { ...state.columns, [newColId]: newCol },
                        columnOrder: [...state.columnOrder, newColId]
                    };
                }),

            deleteColumn: (columnId) =>
                set((state) => {
                    const column = state.columns[columnId];
                    if (!column) return state;

                    const newColumns = { ...state.columns };
                    delete newColumns[columnId];
                    const newColumnOrder = state.columnOrder.filter(id => id !== columnId);

                    // Also delete tasks in that column
                    const tasksToDelete = column.taskIds;
                    const newTasks = { ...state.tasks };
                    tasksToDelete.forEach(taskId => delete newTasks[taskId]);

                    return {
                        columns: newColumns,
                        columnOrder: newColumnOrder,
                        tasks: newTasks
                    };
                }),

            updateColumn: (columnId, title, color) =>
                set((state) => {
                    const column = state.columns[columnId];
                    if (!column) return state;
                    return {
                        columns: {
                            ...state.columns,
                            [columnId]: { ...column, title, color: color || column.color }
                        }
                    };
                }),
        }),
        {
            name: "kanban-storage",
            partialize: (state) => ({
                tasks: state.tasks,
                columns: state.columns,
                columnOrder: state.columnOrder,
            }),
        }
    )
);

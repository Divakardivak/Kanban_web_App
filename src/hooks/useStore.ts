import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type PriorityFilterOption = 'all' | 'high_urgent' | TaskPriority;
export type DueFilterOption = 'all' | 'due_soon' | 'overdue' | 'has_due';
export type SortOption = 'manual' | 'due_asc' | 'priority_desc' | 'alphabetical';

export type ActivityType =
    | 'task_created'
    | 'task_updated'
    | 'task_deleted'
    | 'task_moved'
    | 'subtask_toggled'
    | 'column_created'
    | 'column_deleted'
    | 'board_imported'
    | 'board_reset';

export interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: number;
    taskId?: string;
    columnTitle?: string;
    color?: string;
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

// DEFINE THE STRUCTURE FOR A SINGLE TASK
export interface Task {
    id: string;
    content: string;
    color?: string; // OPTIONAL COLOR PROPERTY FOR TASK STYLING
    priority?: TaskPriority;
    dueDate?: string; // YYYY-MM-DD
    subtasks?: Subtask[];
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
    syncError: string | null;
    setSyncStatus: (status: SyncStatus, error?: string | null) => void;
    syncFromRemote: (payload: { tasks: Record<string, Task>; columns: Record<string, Column>; columnOrder: string[]; activities?: ActivityItem[] }) => void;
    setBoardData: (payload: { tasks: Record<string, Task>; columns: Record<string, Column>; columnOrder: string[] }) => void;
    mergeBoardData: (payload: { tasks: Record<string, Task>; columns: Record<string, Column>; columnOrder: string[] }) => void;

    // ACTIVITY LOG & HISTORY
    activities: ActivityItem[];
    addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
    clearActivities: () => void;

    // ACTIONS
    addTask: (columnId: string, content: string, color?: string, priority?: TaskPriority, dueDate?: string, subtasks?: Subtask[]) => void;
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
    updateTask: (taskId: string, content: string, color?: string, priority?: TaskPriority, dueDate?: string, subtasks?: Subtask[]) => void;
    toggleSubtask: (taskId: string, subtaskId: string) => void;

    // SEARCH, FILTERS & SORTING
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    priorityFilter: PriorityFilterOption;
    dueFilter: DueFilterOption;
    tagColorFilter: string | 'all';
    sortBy: SortOption;
    setPriorityFilter: (filter: PriorityFilterOption) => void;
    setDueFilter: (filter: DueFilterOption) => void;
    setTagColorFilter: (color: string | 'all') => void;
    setSortBy: (sort: SortOption) => void;
    resetFilters: () => void;
    clearBoard: () => void;
}

const createActivity = (
    type: ActivityType,
    title: string,
    description: string,
    taskId?: string,
    columnTitle?: string,
    color?: string
): ActivityItem => ({
    id: uuidv4(),
    type,
    title,
    description,
    timestamp: Date.now(),
    taskId,
    columnTitle,
    color,
});

// INITIAL MOCK DATA FOR THE BOARD
const initialData: Pick<BoardState, "tasks" | "columns" | "columnOrder" | "searchQuery" | "syncStatus" | "syncError" | "priorityFilter" | "dueFilter" | "tagColorFilter" | "sortBy" | "activities"> = {
    searchQuery: "",
    syncStatus: "idle",
    syncError: null,
    priorityFilter: "all",
    dueFilter: "all",
    tagColorFilter: "all",
    sortBy: "manual",
    activities: [
        {
            id: "init-act-1",
            type: "task_created",
            title: "Welcome to FlowBoard",
            description: "Started workspace with starter tasks",
            timestamp: Date.now(),
        }
    ],
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

            setSyncStatus: (status, error = null) =>
                set((state) => {
                    if (state.syncStatus === status && state.syncError === error) {
                        return state;
                    }
                    return { syncStatus: status, syncError: error };
                }),

            syncFromRemote: ({ tasks, columns, columnOrder, activities }) =>
                set((state) => ({
                    tasks,
                    columns,
                    columnOrder,
                    activities: activities && activities.length > 0 ? activities : state.activities,
                })),

            setBoardData: ({ tasks, columns, columnOrder }) =>
                set((state) => ({
                    tasks,
                    columns,
                    columnOrder,
                    activities: [
                        createActivity(
                            'board_imported',
                            'Board Restored',
                            `Restored ${Object.keys(tasks).length} tasks across ${columnOrder.length} columns`
                        ),
                        ...state.activities,
                    ].slice(0, 100),
                })),

            mergeBoardData: ({ tasks: incomingTasks, columns: incomingColumns, columnOrder: incomingColumnOrder }) =>
                set((state) => {
                    const nextTasks = { ...state.tasks };
                    const nextColumns = { ...state.columns };
                    const nextColumnOrder = [...state.columnOrder];

                    // Map old task ID to new task ID to prevent collisions
                    const taskIdMap: Record<string, string> = {};
                    Object.values(incomingTasks).forEach((task) => {
                        const newId = nextTasks[task.id] ? uuidv4() : task.id;
                        taskIdMap[task.id] = newId;
                        nextTasks[newId] = { ...task, id: newId };
                    });

                    // Map columns
                    incomingColumnOrder.forEach((incomingColId) => {
                        const incomingCol = incomingColumns[incomingColId];
                        if (!incomingCol) return;

                        // Check if a column with the same title already exists in current board
                        const existingColEntry = Object.values(nextColumns).find(
                            (col) => col.title.trim().toLowerCase() === incomingCol.title.trim().toLowerCase()
                        );

                        const mappedTaskIds = incomingCol.taskIds
                            .map((tid) => taskIdMap[tid] || tid)
                            .filter((tid) => Boolean(nextTasks[tid]));

                        if (existingColEntry) {
                            // Append tasks to existing column
                            nextColumns[existingColEntry.id] = {
                                ...existingColEntry,
                                taskIds: [...existingColEntry.taskIds, ...mappedTaskIds],
                            };
                        } else {
                            // Add new column
                            const newColId = nextColumns[incomingCol.id] ? uuidv4() : incomingCol.id;
                            nextColumns[newColId] = {
                                ...incomingCol,
                                id: newColId,
                                taskIds: mappedTaskIds,
                            };
                            if (!nextColumnOrder.includes(newColId)) {
                                nextColumnOrder.push(newColId);
                            }
                        }
                    });

                    const mergeAct = createActivity(
                        'board_imported',
                        'Tasks Merged',
                        `Imported ${Object.keys(incomingTasks).length} tasks into board`
                    );

                    return {
                        tasks: nextTasks,
                        columns: nextColumns,
                        columnOrder: nextColumnOrder,
                        activities: [mergeAct, ...state.activities].slice(0, 100),
                    };
                }),

            addActivity: (activity) =>
                set((state) => ({
                    activities: [
                        { ...activity, id: uuidv4(), timestamp: Date.now() },
                        ...state.activities,
                    ].slice(0, 100),
                })),

            clearActivities: () => set({ activities: [] }),

            setSearchQuery: (query) => set({ searchQuery: query }),

            setPriorityFilter: (filter) => set({ priorityFilter: filter }),
            setDueFilter: (filter) => set({ dueFilter: filter }),
            setTagColorFilter: (color) => set({ tagColorFilter: color }),
            setSortBy: (sort) => set({ sortBy: sort }),
            resetFilters: () => set({
                searchQuery: "",
                priorityFilter: "all",
                dueFilter: "all",
                tagColorFilter: "all",
                sortBy: "manual",
            }),

            clearBoard: () =>
                set((state) => ({
                    tasks: {},
                    columns: {},
                    columnOrder: [],
                    activities: [
                        createActivity('board_reset', 'Board Reset', 'Cleared all columns and tasks'),
                        ...state.activities,
                    ].slice(0, 100),
                })),

            // ADD A NEW TASK TO A SPECIFIC COLUMN
            addTask: (columnId, content, color, priority, dueDate, subtasks) =>
                set((state) => {
                    const newTaskId = uuidv4();
                    const newTask: Task = {
                        id: newTaskId,
                        content,
                        color: color || '#ffffff',
                        priority,
                        dueDate,
                        subtasks: subtasks && subtasks.length > 0 ? subtasks : undefined,
                    };

                    const column = state.columns[columnId];
                    if (!column) return state;

                    const newTaskIds = Array.from(column.taskIds);
                    newTaskIds.push(newTaskId);

                    const act = createActivity(
                        'task_created',
                        content,
                        `Created in "${column.title}"${priority ? ` [${priority.toUpperCase()}]` : ''}`,
                        newTaskId,
                        column.title,
                        color
                    );

                    return {
                        tasks: { ...state.tasks, [newTaskId]: newTask },
                        columns: {
                            ...state.columns,
                            [columnId]: { ...column, taskIds: newTaskIds },
                        },
                        activities: [act, ...state.activities].slice(0, 100),
                    };
                }),

            // UPDATE TASK CONTENT AND COLOR
            updateTask: (taskId, content, color, priority, dueDate, subtasks) =>
                set((state) => {
                    const task = state.tasks[taskId];
                    if (!task) return state;

                    const details: string[] = [];
                    if (content !== task.content) details.push(`Renamed to "${content}"`);
                    if (priority !== task.priority) details.push(`Priority: ${priority?.toUpperCase() || 'cleared'}`);
                    if (dueDate !== task.dueDate) details.push(`Due: ${dueDate || 'cleared'}`);
                    const description = details.length > 0 ? details.join(', ') : 'Updated task details';

                    const act = createActivity(
                        'task_updated',
                        content,
                        description,
                        taskId,
                        undefined,
                        color !== undefined ? color : task.color
                    );

                    return {
                        tasks: {
                            ...state.tasks,
                            [taskId]: {
                                ...task,
                                content,
                                color: color !== undefined ? color : task.color,
                                priority: priority !== undefined ? priority : task.priority,
                                dueDate: dueDate !== undefined ? dueDate : task.dueDate,
                                subtasks: subtasks !== undefined ? subtasks : task.subtasks,
                            }
                        },
                        activities: [act, ...state.activities].slice(0, 100),
                    };
                }),

            // TOGGLE SUBTASK STATUS (COMPLETED / ACTIVE)
            toggleSubtask: (taskId, subtaskId) =>
                set((state) => {
                    const task = state.tasks[taskId];
                    if (!task || !task.subtasks) return state;

                    let targetSubtask: Subtask | undefined;
                    const updatedSubtasks = task.subtasks.map((st) => {
                        if (st.id === subtaskId) {
                            targetSubtask = { ...st, completed: !st.completed };
                            return targetSubtask;
                        }
                        return st;
                    });

                    const isNowCompleted = targetSubtask ? targetSubtask.completed : false;
                    const act = createActivity(
                        'subtask_toggled',
                        task.content,
                        `${isNowCompleted ? 'Completed' : 'Reopened'} checklist item: "${targetSubtask?.title || 'Subtask'}"`,
                        taskId
                    );

                    return {
                        tasks: {
                            ...state.tasks,
                            [taskId]: {
                                ...task,
                                subtasks: updatedSubtasks,
                            },
                        },
                        activities: [act, ...state.activities].slice(0, 100),
                    };
                }),

            // DELETE A TASK FROM A COLUMN AND REMOVE IT FROM STATE
            deleteTask: (taskId, columnId) =>
                set((state) => {
                    const task = state.tasks[taskId];
                    const newTasks = { ...state.tasks };
                    delete newTasks[taskId];

                    const column = state.columns[columnId];
                    if (!column) return state;
                    const newTaskIds = column.taskIds.filter((id) => id !== taskId);

                    const act = createActivity(
                        'task_deleted',
                        task ? task.content : "Task",
                        `Deleted from "${column.title}"`,
                        taskId,
                        column.title
                    );

                    return {
                        tasks: newTasks,
                        columns: {
                            ...state.columns,
                            [columnId]: { ...column, taskIds: newTaskIds },
                        },
                        activities: [act, ...state.activities].slice(0, 100),
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

                    const task = state.tasks[taskId];
                    const act = createActivity(
                        'task_moved',
                        task ? task.content : "Task",
                        `Moved from "${sourceCol.title}" ➔ "${destCol.title}"`,
                        taskId,
                        destCol.title,
                        task?.color
                    );

                    return {
                        columns: {
                            ...state.columns,
                            [sourceColId]: { ...sourceCol, taskIds: sourceTaskIds },
                            [destColId]: { ...destCol, taskIds: destTaskIds },
                        },
                        activities: [act, ...state.activities].slice(0, 100),
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
                    const act = createActivity(
                        'column_created',
                        title,
                        `Created new workflow column "${title}"`,
                        undefined,
                        title,
                        color
                    );
                    return {
                        columns: { ...state.columns, [newColId]: newCol },
                        columnOrder: [...state.columnOrder, newColId],
                        activities: [act, ...state.activities].slice(0, 100),
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

                    const act = createActivity(
                        'column_deleted',
                        column.title,
                        `Deleted column "${column.title}" with ${column.taskIds.length} tasks`,
                        undefined,
                        column.title
                    );

                    return {
                        columns: newColumns,
                        columnOrder: newColumnOrder,
                        tasks: newTasks,
                        activities: [act, ...state.activities].slice(0, 100),
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
                activities: state.activities,
            }),
        }
    )
);

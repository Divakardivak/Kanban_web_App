import { v4 as uuidv4 } from "uuid";
import type { Task, Column, TaskPriority, Subtask } from "../hooks/useStore";

const formatTimestamp = (): string => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
};

const parseValidDate = (raw: string): string | undefined => {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    return undefined;
};

export interface ParsedBoardData {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];
}

export interface ParseResult {
    success: boolean;
    data?: ParsedBoardData;
    taskCount?: number;
    columnCount?: number;
    error?: string;
}

/**
 * Triggers a download in the user's browser
 */
export const triggerFileDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Exports the entire board state to formatted JSON
 */
export const exportBoardToJson = (
    tasks: Record<string, Task>,
    columns: Record<string, Column>,
    columnOrder: string[]
) => {
    const timestamp = formatTimestamp();
    const exportPayload = {
        version: 1,
        appName: "FlowBoard",
        exportedAt: new Date().toISOString(),
        board: {
            tasks,
            columns,
            columnOrder,
        },
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    triggerFileDownload(jsonString, `flowboard-backup-${timestamp}.json`, "application/json");
};

const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
};

/**
 * Exports tasks to a spreadsheet-friendly CSV format
 */
export const exportBoardToCsv = (
    tasks: Record<string, Task>,
    columns: Record<string, Column>,
    columnOrder: string[]
) => {
    const timestamp = formatTimestamp();
    const headers = [
        "Task ID",
        "Title",
        "Column",
        "Priority",
        "Due Date",
        "Tag Color",
        "Subtasks Done",
        "Subtasks Total",
        "Subtasks Checklist"
    ];

    const rows: string[] = [headers.map(escapeCsv).join(",")];

    columnOrder.forEach((colId) => {
        const column = columns[colId];
        if (!column) return;

        column.taskIds.forEach((taskId) => {
            const task = tasks[taskId];
            if (!task) return;

            const subtasks = task.subtasks || [];
            const completedCount = subtasks.filter((s) => s.completed).length;
            const subtaskSummary = subtasks
                .map((s) => `${s.title} [${s.completed ? 'DONE' : 'PENDING'}]`)
                .join("; ");

            const row = [
                escapeCsv(task.id),
                escapeCsv(task.content),
                escapeCsv(column.title),
                escapeCsv(task.priority || ""),
                escapeCsv(task.dueDate || ""),
                escapeCsv(task.color || ""),
                escapeCsv(completedCount),
                escapeCsv(subtasks.length),
                escapeCsv(subtaskSummary)
            ];

            rows.push(row.join(","));
        });
    });

    const csvContent = "\uFEFF" + rows.join("\r\n"); // UTF-8 BOM for Excel compatibility
    triggerFileDownload(csvContent, `flowboard-tasks-${timestamp}.csv`, "text/csv;charset=utf-8;");
};

/**
 * Parses JSON backup files with full validation
 */
export const parseJsonBackup = (jsonString: string): ParseResult => {
    try {
        const raw = JSON.parse(jsonString);
        let board = raw.board || raw;

        if (!board || typeof board !== 'object') {
            return { success: false, error: "Invalid backup format: root board object not found." };
        }

        let tasks: Record<string, Task> = {};
        let columns: Record<string, Column> = {};
        let columnOrder: string[] = [];

        // Handle tasks (either object or array)
        if (Array.isArray(board.tasks)) {
            board.tasks.forEach((t: any) => {
                if (t && t.id) {
                    tasks[t.id] = {
                        id: t.id,
                        content: t.content || t.title || "Untitled Task",
                        color: t.color || "#6366F1",
                        priority: t.priority,
                        dueDate: t.dueDate,
                        subtasks: Array.isArray(t.subtasks) ? t.subtasks : undefined,
                    };
                }
            });
        } else if (board.tasks && typeof board.tasks === 'object') {
            Object.entries(board.tasks).forEach(([id, t]: [string, any]) => {
                if (t && typeof t === 'object') {
                    tasks[id] = {
                        id: t.id || id,
                        content: t.content || t.title || "Untitled Task",
                        color: t.color || "#6366F1",
                        priority: t.priority,
                        dueDate: t.dueDate,
                        subtasks: Array.isArray(t.subtasks) ? t.subtasks : undefined,
                    };
                }
            });
        }

        // Handle columns
        if (Array.isArray(board.columns)) {
            board.columns.forEach((col: any) => {
                if (col && col.id) {
                    columns[col.id] = {
                        id: col.id,
                        title: col.title || "Untitled Column",
                        taskIds: Array.isArray(col.taskIds) ? col.taskIds : [],
                        color: col.color,
                    };
                }
            });
        } else if (board.columns && typeof board.columns === 'object') {
            Object.entries(board.columns).forEach(([id, col]: [string, any]) => {
                if (col && typeof col === 'object') {
                    columns[id] = {
                        id: col.id || id,
                        title: col.title || "Untitled Column",
                        taskIds: Array.isArray(col.taskIds) ? col.taskIds : [],
                        color: col.color,
                    };
                }
            });
        }

        // Handle column order
        if (Array.isArray(board.columnOrder) && board.columnOrder.length > 0) {
            columnOrder = board.columnOrder.filter((id: string) => Boolean(columns[id]));
        } else {
            columnOrder = Object.keys(columns);
        }

        // If no columns found but tasks exist, create a default "Imported Tasks" column
        if (columnOrder.length === 0 && Object.keys(tasks).length > 0) {
            const defaultColId = "col-imported-" + uuidv4().slice(0, 8);
            columns[defaultColId] = {
                id: defaultColId,
                title: "Imported Tasks",
                taskIds: Object.keys(tasks),
            };
            columnOrder = [defaultColId];
        }

        const taskCount = Object.keys(tasks).length;
        const columnCount = columnOrder.length;

        if (taskCount === 0 && columnCount === 0) {
            return { success: false, error: "The selected backup contains no columns or tasks." };
        }

        return {
            success: true,
            data: { tasks, columns, columnOrder },
            taskCount,
            columnCount,
        };
    } catch (err: any) {
        return { success: false, error: `Failed to parse JSON file: ${err.message || 'Malformed JSON'}` };
    }
};

/**
 * Robust RFC-compliant CSV line parser
 */
function parseCsvRows(text: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    // Strip UTF-8 BOM if present
    const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;

    for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        const nextChar = cleanText[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentCell += '"';
                i++; // Skip escaped quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++; // Skip CRLF
            }
            currentRow.push(currentCell.trim());
            if (currentRow.some((c) => c !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }

    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some((c) => c !== '')) {
            rows.push(currentRow);
        }
    }

    return rows;
}

/**
 * Parses CSV export files into Kanban boards
 */
export const parseCsvBackup = (csvString: string): ParseResult => {
    try {
        const rows = parseCsvRows(csvString);
        if (rows.length < 2) {
            return { success: false, error: "CSV file is empty or missing data rows." };
        }

        // Header mapping
        const headerRow = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const findColIndex = (...candidates: string[]) => {
            return headerRow.findIndex((h) => candidates.some((cand) => h.includes(cand)));
        };

        const titleIdx = findColIndex("title", "content", "task", "name");
        const columnIdx = findColIndex("column", "status", "stage", "category");
        const priorityIdx = findColIndex("priority", "urgency", "prio");
        const dueDateIdx = findColIndex("due", "date", "deadline");
        const colorIdx = findColIndex("color", "tag");
        const subtasksIdx = findColIndex("subtaskschecklist", "subtasks", "checklist");

        if (titleIdx === -1) {
            return { success: false, error: "Could not find a 'Title' or 'Task' column in the CSV file." };
        }

        const tasks: Record<string, Task> = {};
        const columns: Record<string, Column> = {};
        const columnOrder: string[] = [];
        const columnNameToId: Record<string, string> = {};

        const getOrCreateColumn = (colName: string): Column => {
            const cleanName = colName.trim() || "To do";
            const key = cleanName.toLowerCase();
            if (columnNameToId[key]) {
                return columns[columnNameToId[key]];
            }
            const colId = "col-" + uuidv4().slice(0, 8);
            const newCol: Column = {
                id: colId,
                title: cleanName,
                taskIds: [],
            };
            columns[colId] = newCol;
            columnOrder.push(colId);
            columnNameToId[key] = colId;
            return newCol;
        };

        // Process rows
        for (let r = 1; r < rows.length; r++) {
            const row = rows[r];
            const title = row[titleIdx]?.trim();
            if (!title) continue; // Skip empty rows

            const colName = columnIdx !== -1 && row[columnIdx] ? row[columnIdx] : "To do";
            const targetColumn = getOrCreateColumn(colName);

            // Priority
            let priority: TaskPriority | undefined = undefined;
            if (priorityIdx !== -1 && row[priorityIdx]) {
                const prioVal = row[priorityIdx].toLowerCase().trim();
                if (['urgent', 'high', 'medium', 'low'].includes(prioVal)) {
                    priority = prioVal as TaskPriority;
                }
            }

            // Due Date
            let dueDate: string | undefined = undefined;
            if (dueDateIdx !== -1 && row[dueDateIdx]) {
                const rawDate = row[dueDateIdx].trim();
                dueDate = parseValidDate(rawDate);
            }

            // Tag Color
            let color = "#6366F1";
            if (colorIdx !== -1 && row[colorIdx]) {
                const rawColor = row[colorIdx].trim();
                if (rawColor.startsWith("#") || rawColor.startsWith("rgb")) {
                    color = rawColor;
                }
            }

            // Subtasks
            let subtasks: Subtask[] | undefined = undefined;
            if (subtasksIdx !== -1 && row[subtasksIdx]) {
                const subtaskRaw = row[subtasksIdx].trim();
                if (subtaskRaw) {
                    const parsedSubtasks: Subtask[] = [];
                    // Handles "Task 1 [DONE]; Task 2 [PENDING]" or "[x] Task 1; [ ] Task 2" or comma separated
                    const parts = subtaskRaw.split(/[;\n]/).map((p) => p.trim()).filter(Boolean);
                    parts.forEach((part) => {
                        const isDone = /\[(done|x)\]/i.test(part);
                        const cleanSubTitle = part
                            .replace(/\[(done|pending|x|\s)\]/gi, '')
                            .replace(/^[-*•]\s*/, '')
                            .trim();
                        if (cleanSubTitle) {
                            parsedSubtasks.push({
                                id: uuidv4(),
                                title: cleanSubTitle,
                                completed: isDone,
                            });
                        }
                    });
                    if (parsedSubtasks.length > 0) {
                        subtasks = parsedSubtasks;
                    }
                }
            }

            const taskId = "task-" + uuidv4().slice(0, 8);
            tasks[taskId] = {
                id: taskId,
                content: title,
                color,
                priority,
                dueDate,
                subtasks,
            };
            targetColumn.taskIds.push(taskId);
        }

        const taskCount = Object.keys(tasks).length;
        const columnCount = columnOrder.length;

        if (taskCount === 0) {
            return { success: false, error: "No valid tasks were found in this CSV file." };
        }

        return {
            success: true,
            data: { tasks, columns, columnOrder },
            taskCount,
            columnCount,
        };
    } catch (err: any) {
        return { success: false, error: `Failed to parse CSV file: ${err.message || 'Malformed CSV format'}` };
    }
};

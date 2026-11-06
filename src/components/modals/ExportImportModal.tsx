import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Box, 
    IconButton, 
    Typography, 
    useTheme, 
    Tabs, 
    Tab, 
    Card, 
    CardContent, 
    Chip, 
    RadioGroup, 
    FormControlLabel, 
    Radio, 
    Alert,
    CircularProgress,
    Tooltip
} from "@mui/material";
import { useState, useRef } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import TableChartIcon from "@mui/icons-material/TableChart";
import CodeIcon from "@mui/icons-material/Code";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LayersIcon from "@mui/icons-material/Layers";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { useStore } from "../../hooks/useStore";
import { useNotification } from "../../context/NotificationContext";
import { 
    exportBoardToJson, 
    exportBoardToCsv, 
    parseJsonBackup, 
    parseCsvBackup,
    type ParsedBoardData
} from "../../services/boardTransferService";

interface Props {
    open: boolean;
    onClose: () => void;
}

export const ExportImportModal = ({ open, onClose }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { tasks, columns, columnOrder, setBoardData, mergeBoardData } = useStore();
    const { showNotification } = useNotification();

    const [activeTab, setActiveTab] = useState<0 | 1>(0);

    // Import State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedBoardData | null>(null);
    const [parsedSummary, setParsedSummary] = useState<{ taskCount: number; columnCount: number; format: string } | null>(null);
    const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
    const [isProcessing, setIsProcessing] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const totalTasks = Object.keys(tasks).length;
    const totalColumns = columnOrder.length;

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue as 0 | 1);
        setParseError(null);
    };

    const handleExportJson = () => {
        try {
            exportBoardToJson(tasks, columns, columnOrder);
            showNotification("Full JSON backup downloaded successfully!", "success");
        } catch (err: any) {
            showNotification("Failed to export JSON: " + err.message, "error");
        }
    };

    const handleExportCsv = () => {
        try {
            exportBoardToCsv(tasks, columns, columnOrder);
            showNotification("Spreadsheet CSV exported successfully!", "success");
        } catch (err: any) {
            showNotification("Failed to export CSV: " + err.message, "error");
        }
    };

    const processFile = async (file: File) => {
        setSelectedFile(file);
        setParseError(null);
        setParsedData(null);
        setParsedSummary(null);
        setIsProcessing(true);

        try {
            const text = await file.text();
            const fileName = file.name.toLowerCase();

            if (fileName.endsWith('.json')) {
                const res = parseJsonBackup(text);
                if (res.success && res.data) {
                    setParsedData(res.data);
                    setParsedSummary({
                        taskCount: res.taskCount || 0,
                        columnCount: res.columnCount || 0,
                        format: "JSON Backup",
                    });
                } else {
                    setParseError(res.error || "Failed to parse JSON backup.");
                }
            } else if (fileName.endsWith('.csv')) {
                const res = parseCsvBackup(text);
                if (res.success && res.data) {
                    setParsedData(res.data);
                    setParsedSummary({
                        taskCount: res.taskCount || 0,
                        columnCount: res.columnCount || 0,
                        format: "CSV Spreadsheet",
                    });
                } else {
                    setParseError(res.error || "Failed to parse CSV spreadsheet.");
                }
            } else {
                setParseError("Unsupported file type. Please upload a .json or .csv file.");
            }
        } catch (err: any) {
            setParseError("Could not read file: " + (err.message || "Unknown error"));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const resetImportState = () => {
        setSelectedFile(null);
        setParsedData(null);
        setParsedSummary(null);
        setParseError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleConfirmImport = () => {
        if (!parsedData || !parsedSummary) return;

        try {
            if (importMode === 'replace') {
                setBoardData(parsedData);
                showNotification(`Board replaced with ${parsedSummary.taskCount} tasks across ${parsedSummary.columnCount} columns.`, "success");
            } else {
                mergeBoardData(parsedData);
                showNotification(`Merged ${parsedSummary.taskCount} tasks and ${parsedSummary.columnCount} columns into your board.`, "success");
            }
            resetImportState();
            onClose();
        } catch (err: any) {
            showNotification("Failed to import board: " + err.message, "error");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    bgcolor: isDark ? '#0D111E' : '#FFFFFF',
                    backgroundImage: isDark
                        ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(13, 17, 30, 0.95) 100%)'
                        : 'none',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                    boxShadow: isDark
                        ? '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.2)'
                        : '0 20px 40px rgba(0, 0, 0, 0.12)',
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                }
            }}
        >
            {/* Modal Header */}
            <DialogTitle sx={{ p: 2.5, pb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
                            }}
                        >
                            <ImportExportIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', lineHeight: 1.2 }}>
                                Board Backup & Transfer
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                Export offline copies or restore & merge your workflow
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
                        <ClearIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Box>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        mt: 2,
                        minHeight: 40,
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                        borderRadius: '10px',
                        p: 0.5,
                        '& .MuiTabs-indicator': {
                            display: 'none',
                        },
                    }}
                >
                    <Tab
                        icon={<FileDownloadIcon sx={{ fontSize: 18 }} />}
                        iconPosition="start"
                        label="Export Board"
                        sx={{
                            minHeight: 34,
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            textTransform: 'none',
                            color: activeTab === 0 ? '#FFFFFF' : 'text.secondary',
                            bgcolor: activeTab === 0 
                                ? (isDark ? 'rgba(99, 102, 241, 0.35)' : '#6366F1')
                                : 'transparent',
                            boxShadow: activeTab === 0 ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
                            transition: 'all 0.2s ease',
                        }}
                    />
                    <Tab
                        icon={<FileUploadIcon sx={{ fontSize: 18 }} />}
                        iconPosition="start"
                        label="Import & Restore"
                        sx={{
                            minHeight: 34,
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            textTransform: 'none',
                            color: activeTab === 1 ? '#FFFFFF' : 'text.secondary',
                            bgcolor: activeTab === 1 
                                ? (isDark ? 'rgba(99, 102, 241, 0.35)' : '#6366F1')
                                : 'transparent',
                            boxShadow: activeTab === 1 ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
                            transition: 'all 0.2s ease',
                        }}
                    />
                </Tabs>
            </DialogTitle>

            <DialogContent sx={{ p: 2.5, pt: 1 }}>
                {/* TAB 0: EXPORT */}
                {activeTab === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Current Board Stats Banner */}
                        <Box
                            sx={{
                                p: 1.8,
                                borderRadius: '12px',
                                bgcolor: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.06)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                <LayersIcon sx={{ color: '#6366F1', fontSize: 22 }} />
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Current FlowBoard Snapshot
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Ready to package into an offline file
                                    </Typography>
                                </Box>
                            </Box>
                            <Chip
                                label={`${totalTasks} Tasks • ${totalColumns} Columns`}
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    bgcolor: '#6366F1',
                                    color: '#FFFFFF',
                                    fontSize: '0.72rem',
                                }}
                            />
                        </Box>

                        {/* Export Option 1: Full JSON */}
                        <Card
                            sx={{
                                borderRadius: '14px',
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: 'rgba(99, 102, 241, 0.5)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: isDark ? '0 6px 20px rgba(99, 102, 241, 0.15)' : '0 6px 20px rgba(0, 0, 0, 0.05)',
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2.2, '&:last-child': { pb: 2.2 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CodeIcon sx={{ color: '#06B6D4', fontSize: 22 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                            Full JSON Backup
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label="Full Fidelity"
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontSize: '0.68rem',
                                            fontWeight: 700,
                                            bgcolor: 'rgba(6, 182, 212, 0.15)',
                                            color: '#06B6D4',
                                            border: '1px solid rgba(6, 182, 212, 0.3)',
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', mb: 2 }}>
                                    Preserves complete board structure: all columns, card ordering, subtasks, priorities, cyber tags, and due dates. Perfect for restoring on another device.
                                </Typography>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleExportJson}
                                    startIcon={<FileDownloadIcon />}
                                    sx={{
                                        py: 1,
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                                        }
                                    }}
                                >
                                    Download JSON (.json)
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Export Option 2: CSV Spreadsheet */}
                        <Card
                            sx={{
                                borderRadius: '14px',
                                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: 'rgba(16, 185, 129, 0.5)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: isDark ? '0 6px 20px rgba(16, 185, 129, 0.15)' : '0 6px 20px rgba(0, 0, 0, 0.05)',
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2.2, '&:last-child': { pb: 2.2 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TableChartIcon sx={{ color: '#10B981', fontSize: 22 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                            Spreadsheet CSV
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label="Excel & Notion"
                                        size="small"
                                        sx={{
                                            height: 22,
                                            fontSize: '0.68rem',
                                            fontWeight: 700,
                                            bgcolor: 'rgba(16, 185, 129, 0.15)',
                                            color: '#10B981',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                        }}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', mb: 2 }}>
                                    Exports a clean tabular spreadsheet with task titles, columns, priorities, and deadlines. Easily openable in Excel, Google Sheets, or Notion.
                                </Typography>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleExportCsv}
                                    startIcon={<FileDownloadIcon />}
                                    sx={{
                                        py: 1,
                                        borderRadius: '10px',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        borderColor: 'rgba(16, 185, 129, 0.4)',
                                        color: isDark ? '#34D399' : '#059669',
                                        bgcolor: isDark ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                        '&:hover': {
                                            borderColor: '#10B981',
                                            bgcolor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)',
                                        }
                                    }}
                                >
                                    Download CSV (.csv)
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                )}

                {/* TAB 1: IMPORT & RESTORE */}
                {activeTab === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept=".json,.csv"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />

                        {/* File Dropzone */}
                        {!selectedFile && (
                            <Box
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    border: `2px dashed ${isDragOver ? '#6366F1' : (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)')}`,
                                    borderRadius: '16px',
                                    p: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: isDragOver
                                        ? (isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.06)')
                                        : (isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'),
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: '#6366F1',
                                        bgcolor: isDark ? 'rgba(99, 102, 241, 0.06)' : 'rgba(99, 102, 241, 0.03)',
                                    }
                                }}
                            >
                                <CloudUploadIcon sx={{ fontSize: 44, color: isDragOver ? '#6366F1' : 'text.secondary', mb: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                    Choose a file or drag & drop here
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                                    Supports <b>.json</b> (FlowBoard backup) and <b>.csv</b> (Spreadsheet)
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        mt: 2,
                                        borderRadius: '8px',
                                        fontWeight: 700,
                                        fontSize: '0.78rem',
                                        textTransform: 'none',
                                    }}
                                >
                                    Browse Files
                                </Button>
                            </Box>
                        )}

                        {/* Processing spinner */}
                        {isProcessing && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, gap: 1.5 }}>
                                <CircularProgress size={22} sx={{ color: '#6366F1' }} />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Validating backup file...
                                </Typography>
                            </Box>
                        )}

                        {/* Parse Error Alert */}
                        {parseError && (
                            <Alert 
                                severity="error" 
                                onClose={() => setParseError(null)}
                                sx={{ borderRadius: '12px', fontSize: '0.82rem' }}
                            >
                                {parseError}
                            </Alert>
                        )}

                        {/* File Parsed Successfully Card */}
                        {parsedSummary && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: '14px',
                                        bgcolor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)',
                                        border: '1px solid rgba(16, 185, 129, 0.25)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <CheckCircleIcon sx={{ color: '#10B981', fontSize: 26 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                                {selectedFile?.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                {parsedSummary.format} • {((selectedFile?.size || 0) / 1024).toFixed(1)} KB
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={`${parsedSummary.taskCount} Tasks`}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '0.72rem',
                                                bgcolor: '#10B981',
                                                color: '#FFFFFF',
                                            }}
                                        />
                                        <Tooltip title="Remove file">
                                            <IconButton size="small" onClick={resetImportState}>
                                                <ClearIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>

                                {/* Import Strategy Choice */}
                                <Box sx={{ px: 0.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                        Choose Restore Method:
                                    </Typography>
                                    <RadioGroup
                                        value={importMode}
                                        onChange={(e) => setImportMode(e.target.value as 'merge' | 'replace')}
                                        sx={{ mt: 1, gap: 1 }}
                                    >
                                        {/* Option A: Merge */}
                                        <Box
                                            onClick={() => setImportMode('merge')}
                                            sx={{
                                                p: 1.5,
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                border: `1px solid ${importMode === 'merge' ? '#6366F1' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                                                bgcolor: importMode === 'merge'
                                                    ? (isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)')
                                                    : 'transparent',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 1.2,
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <FormControlLabel
                                                value="merge"
                                                control={<Radio size="small" sx={{ color: '#6366F1', '&.Mui-checked': { color: '#6366F1' } }} />}
                                                label=""
                                                sx={{ m: 0 }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                        Merge with Current Board
                                                    </Typography>
                                                    <Chip
                                                        label="Safe (No Data Loss)"
                                                        size="small"
                                                        sx={{
                                                            height: 18,
                                                            fontSize: '0.62rem',
                                                            fontWeight: 700,
                                                            bgcolor: 'rgba(16, 185, 129, 0.15)',
                                                            color: '#10B981',
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.3 }}>
                                                    Keeps your current tasks and adds the backup tasks into matching columns.
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Option B: Replace */}
                                        <Box
                                            onClick={() => setImportMode('replace')}
                                            sx={{
                                                p: 1.5,
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                border: `1px solid ${importMode === 'replace' ? '#F43F5E' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                                                bgcolor: importMode === 'replace'
                                                    ? (isDark ? 'rgba(244, 63, 94, 0.1)' : 'rgba(244, 63, 94, 0.05)')
                                                    : 'transparent',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 1.2,
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <FormControlLabel
                                                value="replace"
                                                control={<Radio size="small" sx={{ color: '#F43F5E', '&.Mui-checked': { color: '#F43F5E' } }} />}
                                                label=""
                                                sx={{ m: 0 }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: importMode === 'replace' ? '#F43F5E' : 'inherit' }}>
                                                        Replace Current Board
                                                    </Typography>
                                                    <Chip
                                                        label="Overwrite"
                                                        size="small"
                                                        sx={{
                                                            height: 18,
                                                            fontSize: '0.62rem',
                                                            fontWeight: 700,
                                                            bgcolor: 'rgba(244, 63, 94, 0.15)',
                                                            color: '#F43F5E',
                                                        }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.3 }}>
                                                    Completely wipes existing board and restores exactly what is in this file.
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </RadioGroup>
                                </Box>

                                {importMode === 'replace' && (
                                    <Alert
                                        severity="warning"
                                        icon={<WarningAmberIcon />}
                                        sx={{ borderRadius: '12px', fontSize: '0.78rem' }}
                                    >
                                        Warning: This will overwrite your current {totalTasks} tasks and {totalColumns} columns!
                                    </Alert>
                                )}
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2.5, pt: 1, borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}` }}>
                <Button
                    onClick={onClose}
                    variant="text"
                    sx={{
                        borderRadius: '10px',
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'none',
                    }}
                >
                    Cancel
                </Button>

                {activeTab === 1 && parsedData && (
                    <Button
                        onClick={handleConfirmImport}
                        variant="contained"
                        startIcon={<FileUploadIcon />}
                        sx={{
                            borderRadius: '10px',
                            fontWeight: 700,
                            textTransform: 'none',
                            px: 2.5,
                            background: importMode === 'replace'
                                ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)'
                                : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                            boxShadow: importMode === 'replace'
                                ? '0 4px 14px rgba(244, 63, 94, 0.4)'
                                : '0 4px 14px rgba(99, 102, 241, 0.4)',
                        }}
                    >
                        {importMode === 'replace' ? "Replace Board Now" : "Merge Tasks Now"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

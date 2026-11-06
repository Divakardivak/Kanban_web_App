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
    Chip, 
    Stack, 
    CircularProgress,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
} from "@mui/material";
import { useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ClearIcon from "@mui/icons-material/Clear";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useStore, type TaskPriority } from "../../hooks/useStore";
import { generatePlanWithAI, type GeneratedPlan } from "../../services/aiPlannerService";
import { useNotification } from "../../context/NotificationContext";
import { v4 as uuidv4 } from "uuid";

interface Props {
    open: boolean;
    onClose: () => void;
}

const PRESET_IDEAS = [
    { label: "📘 Master TypeScript", prompt: "Master Advanced TypeScript and Modern Patterns" },
    { label: "🚀 Launch a SaaS MVP", prompt: "Build and Launch a SaaS MVP in 14 Days" },
    { label: "💼 Tech Interview Prep", prompt: "Prepare for Senior Frontend Developer Interview" },
    { label: "🎨 Modern Portfolio Website", prompt: "Design and Deploy a Futuristic Portfolio Website" },
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
    urgent: '#F43F5E',
    high: '#F97316',
    medium: '#F59E0B',
    low: '#10B981',
};

const AiPlannerModal = ({ open, onClose }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { columns, columnOrder, addTask } = useStore();
    const { showNotification } = useNotification();

    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [targetColumnId, setTargetColumnId] = useState<string>(() => columnOrder[0] || "");
    const [showApiKeySetting, setShowApiKeySetting] = useState(false);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem("flowboard_gemini_key") || "");

    const handleGenerate = async (queryToUse?: string) => {
        const query = (queryToUse || prompt).trim();
        if (!query) return;

        setLoading(true);
        setGeneratedPlan(null);

        try {
            const plan = await generatePlanWithAI(query, apiKey);
            setGeneratedPlan(plan);
            setSelectedIndices(plan.tasks.map((_, i) => i)); // Select all by default
        } catch (err) {
            console.error("AI Planner error:", err);
            showNotification("Failed to generate plan. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveApiKey = (key: string) => {
        setApiKey(key);
        if (key.trim()) {
            localStorage.setItem("flowboard_gemini_key", key.trim());
        } else {
            localStorage.removeItem("flowboard_gemini_key");
        }
    };

    const handleToggleSelectTask = (index: number) => {
        setSelectedIndices(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleApplyPlan = () => {
        if (!generatedPlan || selectedIndices.length === 0) return;

        // Determine destination column
        const destColId = targetColumnId || columnOrder[0];
        if (!destColId) {
            showNotification("Please create at least one column on the board first.", "warning");
            return;
        }

        const today = new Date();

        selectedIndices.forEach((taskIndex) => {
            const taskData = generatedPlan.tasks[taskIndex];
            if (!taskData) return;

            // Compute due date from offset
            const dueDate = new Date();
            dueDate.setDate(today.getDate() + (taskData.dueDateOffsetDays || 3));
            const yyyy = dueDate.getFullYear();
            const mm = String(dueDate.getMonth() + 1).padStart(2, '0');
            const dd = String(dueDate.getDate()).padStart(2, '0');
            const formattedDueDate = `${yyyy}-${mm}-${dd}`;

            // Format subtasks
            const subtaskObjects = taskData.subtasks.map((stTitle) => ({
                id: uuidv4(),
                title: stTitle,
                completed: false,
            }));

            addTask(
                destColId,
                taskData.title,
                taskData.color,
                taskData.priority,
                formattedDueDate,
                subtaskObjects
            );
        });

        showNotification(`✨ Added ${selectedIndices.length} AI-generated tasks to your board!`, "success");
        onClose();
        setGeneratedPlan(null);
        setPrompt("");
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="md"
            PaperProps={{
                sx: {
                    p: 1,
                    borderRadius: '24px',
                    bgcolor: isDark ? '#111726' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.15)'}`,
                    boxShadow: isDark 
                        ? '0 25px 70px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(99, 102, 241, 0.2)' 
                        : '0 25px 50px -15px rgba(0, 0, 0, 0.15)',
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
                    fontSize: '1.3rem',
                    pb: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #8B5CF6 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(245, 158, 11, 0.5)',
                        }}
                    >
                        <AutoAwesomeIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                            AI Smart Project Planner
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Powered by Gemini AI • Instant Intelligent Breakdown
                        </Typography>
                    </Box>
                </Box>

                <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                    <ClearIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: '10px !important' }}>
                {/* Prompt Input Box */}
                <Box sx={{ mb: 2 }}>
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
                        What project or goal do you want to break down?
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField
                            autoFocus
                            placeholder="e.g. Build Full-Stack E-Commerce App, Learn TypeScript, Prepare for Hackathon..."
                            fullWidth
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleGenerate();
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                }
                            }}
                        />

                        <Button
                            variant="contained"
                            disabled={!prompt.trim() || loading}
                            onClick={() => handleGenerate()}
                            startIcon={loading ? <CircularProgress size={18} sx={{ color: '#FFFFFF' }} /> : <AutoAwesomeIcon />}
                            sx={{
                                minWidth: 160,
                                borderRadius: '12px',
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                                }
                            }}
                        >
                            {loading ? "Generating..." : "Generate Plan"}
                        </Button>
                    </Box>
                </Box>

                {/* Quick Presets */}
                <Box sx={{ mb: 2.5 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {PRESET_IDEAS.map((preset) => (
                            <Chip
                                key={preset.label}
                                label={preset.label}
                                size="small"
                                onClick={() => {
                                    setPrompt(preset.prompt);
                                    handleGenerate(preset.prompt);
                                }}
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                                    '&:hover': {
                                        bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)',
                                        borderColor: isDark ? '#818CF8' : '#6366F1',
                                    }
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                {/* Optional Custom Gemini Key Settings */}
                <Box sx={{ mb: 2.5 }}>
                    <Button
                        size="small"
                        startIcon={<SettingsIcon sx={{ fontSize: 16 }} />}
                        onClick={() => setShowApiKeySetting(!showApiKeySetting)}
                        sx={{ color: 'text.secondary', fontSize: '0.78rem', p: 0 }}
                    >
                        {showApiKeySetting ? "Hide Custom API Key" : "Custom Gemini API Key (Optional)"}
                    </Button>
                    <Collapse in={showApiKeySetting}>
                        <Box sx={{ mt: 1, p: 2, borderRadius: '12px', bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0,0,0,0.02)', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                            <TextField
                                fullWidth
                                size="small"
                                type="password"
                                label="Google Gemini API Key"
                                placeholder="AIzaSy..."
                                value={apiKey}
                                onChange={(e) => handleSaveApiKey(e.target.value)}
                                helperText="Optional. Leave blank to use FlowBoard's built-in intelligent planner."
                            />
                        </Box>
                    </Collapse>
                </Box>

                {/* Loading State Animation */}
                {loading && (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <CircularProgress size={44} sx={{ color: 'primary.main', mb: 2 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            AI is analyzing "{prompt}"...
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Synthesizing milestones, estimating priorities, and generating subtask checklists
                        </Typography>
                    </Box>
                )}

                {/* Generated Plan Review Section */}
                {generatedPlan && !loading && (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                    Generated Plan: {generatedPlan.projectName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Select which tasks you want to add ({selectedIndices.length} of {generatedPlan.tasks.length} selected)
                                </Typography>
                            </Box>

                            {/* Target Column Selector */}
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel>Add to Column</InputLabel>
                                <Select
                                    value={targetColumnId}
                                    label="Add to Column"
                                    onChange={(e) => setTargetColumnId(e.target.value)}
                                    sx={{ borderRadius: '10px' }}
                                >
                                    {columnOrder.map((colId) => (
                                        <MenuItem key={colId} value={colId}>
                                            {columns[colId]?.title || colId}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Stack spacing={1.5} sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}>
                            {generatedPlan.tasks.map((task, index) => {
                                const isSelected = selectedIndices.includes(index);
                                const prioColor = PRIORITY_COLORS[task.priority] || '#6366F1';

                                return (
                                    <Box
                                        key={index}
                                        onClick={() => handleToggleSelectTask(index)}
                                        sx={{
                                            p: 2,
                                            borderRadius: '14px',
                                            bgcolor: isDark 
                                                ? (isSelected ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)')
                                                : (isSelected ? 'rgba(79, 70, 229, 0.05)' : 'rgba(0, 0, 0, 0.02)'),
                                            border: `1px solid ${
                                                isSelected 
                                                    ? (isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(79, 70, 229, 0.3)')
                                                    : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)')
                                            }`,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: isDark ? 'rgba(99, 102, 241, 0.6)' : 'rgba(79, 70, 229, 0.5)',
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Checkbox
                                                    size="small"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleSelectTask(index)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    sx={{ p: 0.5 }}
                                                />
                                                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                    {task.title}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip
                                                    label={task.priority.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '0.68rem',
                                                        fontWeight: 800,
                                                        borderRadius: '6px',
                                                        bgcolor: `${prioColor}20`,
                                                        color: prioColor,
                                                        border: `1px solid ${prioColor}40`,
                                                        height: 22,
                                                    }}
                                                />
                                                <Chip
                                                    icon={<CalendarTodayIcon sx={{ fontSize: '11px !important' }} />}
                                                    label={`+${task.dueDateOffsetDays}d`}
                                                    size="small"
                                                    sx={{ fontSize: '0.7rem', height: 22, borderRadius: '6px' }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Subtasks Preview */}
                                        {task.subtasks && task.subtasks.length > 0 && (
                                            <Box sx={{ mt: 1, pl: 4.5 }}>
                                                <Stack spacing={0.5}>
                                                    {task.subtasks.map((st, sIdx) => (
                                                        <Box key={sIdx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                            <CheckBoxOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary', opacity: 0.6 }} />
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                {st}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
                    Cancel
                </Button>

                {generatedPlan && (
                    <Button 
                        onClick={handleApplyPlan} 
                        variant="contained" 
                        disabled={selectedIndices.length === 0}
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            px: 3,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            }
                        }}
                    >
                        Add {selectedIndices.length} Tasks to Board
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AiPlannerModal;


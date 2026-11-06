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
    Tooltip
} from "@mui/material";
import { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface Props {
    open: boolean;
    mode: 'add' | 'edit';
    initialContent?: string;
    initialColor?: string;
    onClose: () => void;
    onSave: (content: string, color: string) => void;
    onDelete?: () => void;
}

const COLOR_PALETTE = [
    { name: 'Default', hex: '#ffffff' },
    { name: 'Indigo Glow', hex: '#6366F1' },
    { name: 'Cyber Cyan', hex: '#06B6D4' },
    { name: 'Neon Purple', hex: '#A855F7' },
    { name: 'Emerald Mint', hex: '#10B981' },
    { name: 'Solar Amber', hex: '#F59E0B' },
    { name: 'Cyber Rose', hex: '#F43F5E' },
    { name: 'Titanium', hex: '#64748B' },
];

const TaskModal = ({ open, mode, initialContent = "", initialColor = "#ffffff", onClose, onSave, onDelete }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [content, setContent] = useState(initialContent);
    const [color, setColor] = useState(initialColor);

    useEffect(() => {
        if (open) {
            setContent(initialContent);
            setColor(initialColor);
        }
    }, [open, initialContent, initialColor]);

    const handleSave = () => {
        if (content.trim()) {
            onSave(content.trim(), color);
            onClose();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="sm"
            PaperProps={{
                sx: {
                    p: 1,
                    borderRadius: '20px',
                    bgcolor: isDark ? '#111726' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                    boxShadow: isDark 
                        ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15)' 
                        : '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
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
                    fontSize: '1.25rem',
                    pb: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: '10px',
                            bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {mode === 'add' ? (
                            <AddCircleOutlineIcon sx={{ fontSize: 20 }} />
                        ) : (
                            <EditNoteIcon sx={{ fontSize: 22 }} />
                        )}
                    </Box>
                    {mode === 'add' ? 'Create New Task' : 'Edit Task'}
                </Box>

                {mode === 'edit' && onDelete && (
                    <Tooltip title="Delete Task">
                        <IconButton 
                            onClick={onDelete} 
                            sx={{ 
                                color: 'text.secondary',
                                '&:hover': {
                                    color: '#F43F5E',
                                    bgcolor: isDark ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.08)',
                                }
                            }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </DialogTitle>

            <DialogContent sx={{ pt: '10px !important' }}>
                <TextField
                    autoFocus
                    label="Task Description"
                    placeholder="What needs to be done?"
                    fullWidth
                    multiline
                    minRows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <Box>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            display: 'block',
                            fontWeight: 700, 
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: 'text.secondary',
                            mb: 1.5,
                        }}
                    >
                        Tag Color
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
                        {COLOR_PALETTE.map((c) => {
                            const isSelected = color === c.hex;
                            const isWhite = c.hex === '#ffffff';
                            return (
                                <Tooltip key={c.hex} title={c.name}>
                                    <Box
                                        onClick={() => setColor(c.hex)}
                                        sx={{
                                            width: 34,
                                            height: 34,
                                            borderRadius: '50%',
                                            bgcolor: c.hex,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: isSelected
                                                ? `2px solid ${isDark ? '#FFFFFF' : '#0F172A'}`
                                                : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}`,
                                            boxShadow: isSelected
                                                ? (isDark ? `0 0 12px ${c.hex}` : `0 4px 10px rgba(0,0,0,0.15)`)
                                                : 'none',
                                            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'scale(1.15)',
                                            }
                                        }}
                                    >
                                        {isSelected && (
                                            <CheckIcon 
                                                sx={{ 
                                                    fontSize: 16, 
                                                    color: isWhite ? '#000000' : '#FFFFFF' 
                                                }} 
                                            />
                                        )}
                                    </Box>
                                </Tooltip>
                            );
                        })}
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
                <Button 
                    onClick={onClose}
                    sx={{ color: 'text.secondary' }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained" 
                    disabled={!content.trim()}
                    sx={{ px: 3 }}
                >
                    {mode === 'add' ? 'Create Task' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskModal;

import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Box, 
    Typography,
    useTheme,
    Tooltip
} from "@mui/material";
import { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

interface Props {
    open: boolean;
    mode: 'add' | 'edit';
    initialTitle?: string;
    initialColor?: string;
    onClose: () => void;
    onSave: (title: string, color: string) => void;
}

const COLUMN_PALETTE = [
    { name: 'Indigo Glow', hex: '#6366F1' },
    { name: 'Cyber Cyan', hex: '#06B6D4' },
    { name: 'Neon Purple', hex: '#A855F7' },
    { name: 'Emerald Mint', hex: '#10B981' },
    { name: 'Solar Amber', hex: '#F59E0B' },
    { name: 'Cyber Rose', hex: '#F43F5E' },
    { name: 'Titanium Gray', hex: '#64748B' },
];

const ColumnModal = ({ open, mode, initialTitle = "", initialColor = "#6366F1", onClose, onSave }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [title, setTitle] = useState(initialTitle);
    const [color, setColor] = useState(initialColor);

    useEffect(() => {
        if (open) {
            setTitle(initialTitle);
            setColor(initialColor || '#6366F1');
        }
    }, [open, initialTitle, initialColor]);

    const handleSave = () => {
        if (title.trim()) {
            onSave(title.trim(), color);
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
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    pb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                }}
            >
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
                    <ViewColumnIcon sx={{ fontSize: 20 }} />
                </Box>
                {mode === 'add' ? 'Add New Column' : 'Edit Column'}
            </DialogTitle>

            <DialogContent sx={{ pt: '10px !important' }}>
                <TextField
                    autoFocus
                    label="Column Title"
                    placeholder="e.g. Backlog, Testing, Review..."
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                        Header Accent Color
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
                        {COLUMN_PALETTE.map((c) => {
                            const isSelected = color === c.hex;
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
                                            <CheckIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
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
                    disabled={!title.trim()}
                    sx={{ px: 3 }}
                >
                    {mode === 'add' ? 'Add Column' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ColumnModal;

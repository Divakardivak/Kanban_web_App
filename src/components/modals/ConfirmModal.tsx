import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography,
    Box,
    useTheme
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface Props {
    open: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmModal = ({ open, title, content, onConfirm, onClose }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xs" 
            fullWidth
            PaperProps={{
                sx: {
                    p: 1,
                    borderRadius: '20px',
                    bgcolor: isDark ? '#111726' : '#FFFFFF',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                    boxShadow: isDark 
                        ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(244, 63, 94, 0.15)' 
                        : '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    pb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                }}
            >
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: isDark ? 'rgba(244, 63, 94, 0.15)' : 'rgba(244, 63, 94, 0.1)',
                        color: '#F43F5E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
                </Box>
                {title}
            </DialogTitle>

            <DialogContent sx={{ pt: '8px !important' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {content}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
                <Button 
                    onClick={onClose}
                    sx={{ color: 'text.secondary' }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    color="error" 
                    variant="contained"
                    sx={{
                        bgcolor: '#F43F5E',
                        '&:hover': {
                            bgcolor: '#E11D48',
                            boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.4)',
                        }
                    }}
                >
                    Confirm Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;

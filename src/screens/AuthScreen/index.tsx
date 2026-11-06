import { useState } from "react";
import { 
    Container, 
    Stack, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    Paper, 
    InputAdornment, 
    IconButton, 
    Alert, 
    CircularProgress,
    useTheme
} from "@mui/material";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const initForm = {
    email: "",
    password: "",
};

const AuthScreen = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState(initForm);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((oldForm) => ({
            ...oldForm,
            [name]: value,
        }));
        if (errorMessage) setErrorMessage("");
    };

    const handleAuth = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!form.email.trim() || !form.password.trim()) return;

        setLoading(true);
        setErrorMessage("");

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
            } else {
                await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            let msg = err.message || "An authentication error occurred.";
            if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
                msg = "Invalid email or password. Please try again.";
            } else if (err.code === "auth/email-already-in-use") {
                msg = "An account with this email already exists. Try logging in.";
            } else if (err.code === "auth/weak-password") {
                msg = "Password should be at least 6 characters long.";
            } else if (err.code === "auth/invalid-email") {
                msg = "Please enter a valid email address.";
            }
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
                p: 2,
            }}
        >
            {/* Ambient Sci-Fi Glow Orbs */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '20%',
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '15%',
                    width: 450,
                    height: 450,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={0}
                    component="form"
                    onSubmit={handleAuth}
                    sx={{
                        p: { xs: 3.5, sm: 4.5 },
                        borderRadius: '24px',
                        bgcolor: isDark ? 'rgba(17, 24, 38, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                        boxShadow: isDark
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.15)'
                            : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {/* Brand Header */}
                    <Stack spacing={1.5} alignItems="center" textAlign="center" mb={3.5}>
                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 24px -4px rgba(99, 102, 241, 0.5)',
                                mb: 1,
                            }}
                        >
                            <ViewKanbanIcon sx={{ color: '#FFFFFF', fontSize: 30 }} />
                        </Box>

                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: '"Outfit", sans-serif',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                background: isDark 
                                    ? 'linear-gradient(135deg, #FFFFFF 40%, #94A3B8 100%)' 
                                    : 'linear-gradient(135deg, #0F172A 40%, #334155 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Flow<Box component="span" sx={{
                                background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>Board</Box>
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.84rem' }}>
                            Next-generation visual workflow platform
                        </Typography>
                    </Stack>

                    {/* Mode Toggle Switcher */}
                    <Box
                        sx={{
                            p: 0.5,
                            borderRadius: '12px',
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                            display: 'flex',
                            mb: 3,
                        }}
                    >
                        <Button
                            fullWidth
                            onClick={() => { setIsLogin(true); setErrorMessage(""); }}
                            sx={{
                                py: 0.8,
                                borderRadius: '9px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                bgcolor: isLogin 
                                    ? (isDark ? 'rgba(99, 102, 241, 0.25)' : '#FFFFFF') 
                                    : 'transparent',
                                color: isLogin ? 'primary.main' : 'text.secondary',
                                boxShadow: isLogin && !isDark ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                                border: isLogin && isDark ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                                '&:hover': {
                                    bgcolor: isLogin 
                                        ? (isDark ? 'rgba(99, 102, 241, 0.3)' : '#FFFFFF') 
                                        : 'rgba(255,255,255,0.05)',
                                }
                            }}
                        >
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            onClick={() => { setIsLogin(false); setErrorMessage(""); }}
                            sx={{
                                py: 0.8,
                                borderRadius: '9px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                bgcolor: !isLogin 
                                    ? (isDark ? 'rgba(99, 102, 241, 0.25)' : '#FFFFFF') 
                                    : 'transparent',
                                color: !isLogin ? 'primary.main' : 'text.secondary',
                                boxShadow: !isLogin && !isDark ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                                border: !isLogin && isDark ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                                '&:hover': {
                                    bgcolor: !isLogin 
                                        ? (isDark ? 'rgba(99, 102, 241, 0.3)' : '#FFFFFF') 
                                        : 'rgba(255,255,255,0.05)',
                                }
                            }}
                        >
                            Register
                        </Button>
                    </Box>

                    {/* Error Banner */}
                    {errorMessage && (
                        <Alert 
                            severity="error" 
                            variant="filled"
                            sx={{ 
                                mb: 2.5, 
                                borderRadius: '10px', 
                                fontSize: '0.82rem',
                                bgcolor: isDark ? 'rgba(244, 63, 94, 0.2)' : undefined,
                                color: isDark ? '#FDA4AF' : undefined,
                                border: isDark ? '1px solid rgba(244, 63, 94, 0.3)' : undefined,
                            }}
                        >
                            {errorMessage}
                        </Alert>
                    )}

                    {/* Inputs */}
                    <Stack spacing={2.2}>
                        <TextField
                            name="email"
                            type="email"
                            label="Email Address"
                            placeholder="name@example.com"
                            onChange={handleChange}
                            value={form.email}
                            fullWidth
                            autoComplete="email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            value={form.password}
                            fullWidth
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Submit Button */}
                        <Button
                            disabled={!form.email.trim() || !form.password.trim() || loading}
                            type="submit"
                            size="large"
                            variant="contained"
                            endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                mt: 1,
                                py: 1.3,
                                borderRadius: '12px',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                boxShadow: '0 8px 24px -4px rgba(99, 102, 241, 0.5)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                                    boxShadow: '0 10px 28px -4px rgba(99, 102, 241, 0.65)',
                                }
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                            ) : (
                                isLogin ? "Sign In" : "Create Account"
                            )}
                        </Button>
                    </Stack>

                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            mt: 3,
                            textAlign: 'center',
                            color: 'text.secondary',
                            cursor: 'pointer',
                            '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                        }}
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrorMessage("");
                        }}
                    >
                        {isLogin
                            ? "Don't have an account? Sign up here"
                            : "Already have an account? Sign in here"}
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthScreen;

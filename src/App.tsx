import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import AuthScreen from "./screens/AuthScreen";
import { auth } from "./firebase";
import { CircularProgress, Box } from "@mui/material";
import BoardScreen from "./screens/BoardScreen";
import AppLayout from "./components/layout/AppLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { ColorModeProvider } from "./context/ColorModeContext";

import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ColorModeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={!user ? <AuthScreen /> : <Navigate to="/" />} />

            <Route path="/" element={user ? <AppLayout /> : <Navigate to="/auth" />}>
              <Route index element={<BoardScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ColorModeProvider>
  );
};

export default App;

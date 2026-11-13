import Board from "../components/board/Board";
import { Box } from "@mui/material";

const BoardScreen = () => {
    return (
        <Box sx={{ height: '100%', width: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Board />
        </Box>
    );
};

export default BoardScreen;

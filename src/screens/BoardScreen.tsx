import Board from "../components/board/Board";
import { Box } from "@mui/material";

const BoardScreen = () => {
    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <Board />
        </Box>
    );
};

export default BoardScreen;

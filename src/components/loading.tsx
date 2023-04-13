import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

function Loading() {
  return (
    <Box>
      <Backdrop
        open={true}
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Typography variant="h6">Loading</Typography>
        <CircularProgress sx={{ width: '200px', height: 50 }} color="inherit" />
      </Backdrop>
    </Box>
  );
}
export default Loading;

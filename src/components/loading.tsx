import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from "@mui/material/Backdrop";

function Loading() {

    return (
         
            <Backdrop open={true} >
            <CircularProgress sx={{width: "200px"}}color="inherit"/>
            </Backdrop>
            
            
    

    )
}
export default Loading
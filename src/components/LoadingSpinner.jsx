import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export const LoadingSpinner = () => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }}>
        <CircularProgress color="primary" />
    </Box>
)
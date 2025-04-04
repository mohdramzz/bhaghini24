import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8 
    }}>
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
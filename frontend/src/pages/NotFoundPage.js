import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
        <SadIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h2" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
        
        <Box display="flex" justifyContent="center" gap={2}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/"
            size="large"
          >
            Go to Homepage
          </Button>
          
          <Button 
            variant="outlined" 
            component={Link} 
            to="/products"
            size="large"
          >
            Browse Products
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
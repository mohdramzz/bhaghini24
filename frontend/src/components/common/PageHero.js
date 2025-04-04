import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const PageHero = ({ 
  title, 
  description, 
  imageUrl, 
  buttonText, 
  buttonLink, 
  height = 400,
  align = 'left'
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        height: { xs: height * 0.7, md: height },
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${imageUrl})`,
      }}
    >
      <Container
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: align,
          py: { xs: 3, md: 6 },
          maxWidth: 'md'
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          color="inherit"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography 
            variant="h6" 
            color="inherit" 
            paragraph
            sx={{ maxWidth: align === 'center' ? '100%' : '80%', mx: align === 'center' ? 'auto' : 0 }}
          >
            {description}
          </Typography>
        )}
        {buttonText && buttonLink && (
          <Box sx={{ mt: 2 }}>
            <Button
              component={Link}
              to={buttonLink}
              variant="contained"
              size="large"
              sx={{ 
                minWidth: 150,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {buttonText}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PageHero;
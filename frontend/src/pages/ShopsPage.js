import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  InputAdornment,
  TextField
} from '@mui/material';
import { Search, Store } from '@mui/icons-material';
import { shopApi } from '../services/api';
import PageHero from '../components/common/PageHero';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const response = await shopApi.getAllShops();
        setShops(response.data);
        setFilteredShops(response.data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShops();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredShops(shops);
    } else {
      const filtered = shops.filter(
        shop => shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (shop.description && shop.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredShops(filtered);
    }
  }, [searchTerm, shops]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading shops..." />;
  }
  
  return (
    <div>
      <PageHero
        title="Our Shops"
        description="Discover unique shops and browse their products."
        imageUrl="https://source.unsplash.com/random/1200x400/?store"
        height={300}
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search shops..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          
          <Divider sx={{ mb: 4 }} />
          
          {filteredShops.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              No shops found matching your search.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredShops.map((shop) => (
                <Grid item key={shop.id} xs={12} sm={6} md={4}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    }
                  }}>
                    <Box sx={{ 
                      height: 200, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5'
                    }}>
                      {shop.logoUrl ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={shop.logoUrl}
                          alt={shop.name}
                          sx={{ objectFit: 'contain' }}
                        />
                      ) : (
                        <Store sx={{ fontSize: 80, color: 'text.secondary' }} />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {shop.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '4.5em'
                      }}>
                        {shop.description || 'Visit our shop for great products!'}
                      </Typography>
                      <Button 
                        component={Link} 
                        to={`/shop/${shop.id}`} 
                        variant="contained" 
                        fullWidth
                      >
                        Visit Shop
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default ShopsPage;
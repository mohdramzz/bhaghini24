import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Divider,
  Button,
  Avatar
} from '@mui/material';
import { Store, LocationOn, Phone, Email } from '@mui/icons-material';
import { shopApi, productApi } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ShopDetailPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch shop details
        const shopResponse = await shopApi.getShopById(id);
        setShop(shopResponse.data);
        
        // Fetch shop products
        const productsResponse = await productApi.getProductsByShop(id);
        setProducts(productsResponse.data);
      } catch (err) {
        console.error('Error fetching shop data:', err);
        setError('Failed to load shop information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  if (loading) {
    return <LoadingSpinner message="Loading shop details..." />;
  }
  
  if (error || !shop) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom color="error">
          {error || 'Shop not found'}
        </Typography>
        <Button component={Link} to="/products" variant="contained" sx={{ mt: 3 }}>
          Browse Products
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center' 
            }}>
              {shop.logoUrl ? (
                <img 
                  src={shop.logoUrl} 
                  alt={shop.name} 
                  style={{ 
                    width: '100%', 
                    maxHeight: 180, 
                    objectFit: 'contain',
                    marginBottom: 16
                  }} 
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    bgcolor: 'primary.main',
                    mb: 2
                  }}
                >
                  <Store sx={{ fontSize: 60 }} />
                </Avatar>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Typography variant="h4" component="h1" gutterBottom>
              {shop.name}
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {shop.description || 'No description provided.'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                {shop.address}
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Shop Owner: {shop.ownerName}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Products
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {products.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            This shop doesn't have any products yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default ShopDetailPage;
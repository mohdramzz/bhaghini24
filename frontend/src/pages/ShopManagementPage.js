import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import { Edit, Delete, Add, Store } from '@mui/icons-material';
import { ShopContext } from '../contexts/ShopContext';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ShopManagementPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { 
    myShop, 
    shopProducts, 
    loading, 
    error, 
    fetchMyShop, 
    fetchShopProducts,
    deleteProduct
  } = useContext(ShopContext);
  
  const [tabValue, setTabValue] = useState(0);
  const [deleteError, setDeleteError] = useState(null);
  const [hasFetchedShop, setHasFetchedShop] = useState(false);
  
  // Fetch shop only once when component mounts or user changes
  useEffect(() => {
    if (currentUser && !hasFetchedShop && !myShop) {
      console.log("Fetching shop data - first time");
      fetchMyShop();
      setHasFetchedShop(true);
    }
  }, [currentUser, fetchMyShop, hasFetchedShop, myShop]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleDeleteProduct = async (productId) => {
    try {
      setDeleteError(null);
      await deleteProduct(productId);
    } catch (err) {
      setDeleteError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading shop data..." />;
  }
  
  if (!myShop) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Store sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            You don't have a shop yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your own shop to start selling products on our platform.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/create-shop"
            startIcon={<Add />}
          >
            Create Shop
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shop Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your shop, products, and orders
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {deleteError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {deleteError}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="shop management tabs">
            <Tab label="Shop Profile" id="tab-0" />
            <Tab label="Products" id="tab-1" />
            <Tab label="Orders" id="tab-2" />
          </Tabs>
        </Box>
        
        {/* Shop Profile Tab */}
        <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Shop Profile</Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Edit />}
                  component={Link}
                  to={`/edit-shop/${myShop.id}`}
                >
                  Edit Profile
                </Button>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ 
                      width: '100%', 
                      height: 200, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5'
                    }}>
                      {myShop.logoUrl ? (
                        <img 
                          src={myShop.logoUrl} 
                          alt={`${myShop.name} logo`} 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                        />
                      ) : (
                        <Store sx={{ fontSize: 80, color: 'text.secondary' }} />
                      )}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      {myShop.name}
                    </Typography>
                    
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                      {myShop.description || 'No description provided.'}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Address:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {myShop.address}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Owner:
                    </Typography>
                    <Typography variant="body2">
                      {myShop.ownerName}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        
        {/* Products Tab */}
        <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" sx={{ p: 3 }}>
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Products</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  component={Link}
                  to="/add-product"
                >
                  Add New Product
                </Button>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {shopProducts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    No products yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Start adding products to your shop.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Add />}
                    component={Link}
                    to="/add-product"
                  >
                    Add First Product
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {shopProducts.map(product => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                          alt={product.name}
                          sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" component="div" noWrap>
                              {product.name}
                            </Typography>
                            {product.featured && (
                              <Chip label="Featured" size="small" color="primary" />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            ${parseFloat(product.price).toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            In Stock: {product.stockQuantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Category: {product.categoryName}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between' }}>
                          <Button size="small" component={Link} to={`/product/${product.id}`}>
                            View
                          </Button>
                          <Box>
                            <IconButton 
                              size="small" 
                              color="primary"
                              component={Link}
                              to={`/edit-product/${product.id}`}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
        
        {/* Orders Tab */}
        <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" sx={{ p: 3 }}>
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Orders
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {/* This would be implemented with order management functionality */}
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  No orders yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Orders for your products will appear here.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ShopManagementPage;
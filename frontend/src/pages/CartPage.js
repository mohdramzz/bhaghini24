import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  TextField, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  Delete as DeleteIcon, 
  ShoppingCart as CartIcon, 
  NavigateNext as ArrowRightIcon 
} from '@mui/icons-material';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import PageHero from '../components/common/PageHero';

const CartPage = () => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    if (window.confirm('Remove this item from your cart?')) {
      removeFromCart(id);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Remove all items from your cart?')) {
      clearCart();
    }
  };

  const handleProceedToCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };


  if (cartItems.length === 0) {
    return (
      <>
        <PageHero
          title="Your Shopping Cart"
          description="Explore our products and add items to your cart"
          imageUrl="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          height={250}
        />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 100, color: 'grey.300', mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Looks like you haven't added any products to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            component={Link} 
            to="/products"
            endIcon={<ArrowRightIcon />}
          >
            Continue Shopping
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="Your Shopping Cart"
        description={`You have ${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
        imageUrl="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        height={250}
      />
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ mb: { xs: 4, lg: 0 } }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box 
                              component="img" 
                              src={item.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'} 
                              alt={item.name}
                              sx={{ width: 80, height: 80, mr: 2, objectFit: 'contain' }}
                            />
                            <Box>
                              <Typography 
                                component={Link} 
                                to={`/product/${item.id}`}
                                sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                              >
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Category: {item.categoryName}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ${parseFloat(item.price).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <IconButton 
                              size="small" 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val > 0) {
                                  handleQuantityChange(item.id, val);
                                }
                              }}
                              inputProps={{ 
                                min: 1, 
                                style: { 
                                  textAlign: 'center',
                                  width: '40px',
                                  padding: '5px'
                                }
                              }}
                              variant="standard"
                              sx={{ mx: 1 }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label="remove item"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/products"
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <List disablePadding>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body2">${totalPrice.toFixed(2)}</Typography>
                  </ListItem>
                  
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Shipping" />
                    <Typography variant="body2">Free</Typography>
                  </ListItem>
                  
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Tax (estimated)" />
                    <Typography variant="body2">${(totalPrice * 0.08).toFixed(2)}</Typography>
                  </ListItem>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="h6" fontWeight="bold">
                      ${(totalPrice + (totalPrice * 0.08)).toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleProceedToCheckout}
                  sx={{ mt: 3 }}
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </Button>

                {/* Promotion Code Input */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Promotional Code
                  </Typography>
                  <Box display="flex" gap={1}>
                    <TextField
                      placeholder="Enter code"
                      fullWidth
                      size="small"
                    />
                    <Button variant="outlined" size="small">
                      Apply
                    </Button>
                  </Box>
                </Box>

                {/* Accepted Payment Methods */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    We Accept
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <img src="https://via.placeholder.com/40x25?text=Visa" alt="Visa" />
                    <img src="https://via.placeholder.com/40x25?text=MC" alt="MasterCard" />
                    <img src="https://via.placeholder.com/40x25?text=Amex" alt="American Express" />
                    <img src="https://via.placeholder.com/40x25?text=PayPal" alt="PayPal" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CartPage;
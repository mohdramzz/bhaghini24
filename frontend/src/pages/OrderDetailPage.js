import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Divider,
  Button,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  DirectionsCar as DeliveryIcon,
  CheckCircle as CompletedIcon,
  Home as AddressIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { orderApi, paymentApi } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Helper function to get status step
const getOrderStep = (status) => {
  switch (status) {
    case 'PENDING':
      return 0;
    case 'PROCESSING':
      return 1;
    case 'SHIPPED':
      return 2;
    case 'DELIVERED':
      return 3;
    case 'CANCELLED':
      return -1;
    default:
      return 0;
  }
};

// Helper function to get status chip color
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'default';
    case 'PROCESSING':
      return 'primary';
    case 'SHIPPED':
      return 'info';
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Fetch order details
        const orderResponse = await orderApi.getOrderById(id);
        setOrder(orderResponse.data);
        
        // Fetch payment details
        try {
          const paymentResponse = await paymentApi.getPaymentByOrderId(id);
          setPayment(paymentResponse.data);
        } catch (paymentErr) {
          console.error('Error fetching payment:', paymentErr);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Box textAlign="center">
          <Button
            variant="contained"
            component={Link}
            to="/orders"
          >
            Back to Orders
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          Order not found.
        </Alert>
        <Box textAlign="center">
          <Button
            variant="contained"
            component={Link}
            to="/orders"
          >
            Back to Orders
          </Button>
        </Box>
      </Container>
    );
  }
  
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  const orderTime = new Date(order.createdAt).toLocaleTimeString();
  const orderStatus = order.status;
  const orderItems = order.items || [];
  const shippingAddress = order.shippingAddress || {};
  const orderStep = getOrderStep(orderStatus);
  
  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/orders"
            variant="outlined"
            sx={{ mb: 2 }}
          >
            ← Back to Orders
          </Button>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h4">
                Order #{order.orderNumber}
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                label={orderStatus}
                color={getStatusColor(orderStatus)}
              />
            </Grid>
          </Grid>
          <Typography variant="subtitle1" color="text.secondary">
            Placed on {orderDate} at {orderTime}
          </Typography>
        </Box>
        
        {orderStatus === 'CANCELLED' ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            This order was cancelled.
          </Alert>
        ) : (
          <Box sx={{ mb: 6 }}>
            <Stepper
              activeStep={orderStep}
              alternativeLabel={!isMobile}
              orientation={isMobile ? "vertical" : "horizontal"}
            >
              <Step>
                <StepLabel 
                  StepIconProps={{
                    icon: <ReceiptIcon />
                  }}
                >
                  Order Placed
                </StepLabel>
              </Step>
              <Step>
                <StepLabel 
                  StepIconProps={{
                    icon: <InventoryIcon />
                  }}
                >
                  Processing
                </StepLabel>
              </Step>
              <Step>
                <StepLabel 
                  StepIconProps={{
                    icon: <ShippingIcon />
                  }}
                >
                  Shipped
                </StepLabel>
              </Step>
              <Step>
                <StepLabel 
                  StepIconProps={{
                    icon: <CompletedIcon />
                  }}
                >
                  Delivered
                </StepLabel>
              </Step>
            </Stepper>
          </Box>
        )}
        
        <Grid container spacing={4}>
          {/* Order Items & Summary */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box
                              component="img"
                              src={item.imageUrl || 'https://via.placeholder.com/60x60?text=No+Image'}
                              alt={item.productName}
                              sx={{ width: 60, height: 60, mr: 2, objectFit: 'contain' }}
                            />
                            <Typography variant="body2">
                              {item.productName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ${parseFloat(item.price).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          {item.quantity}
                        </TableCell>
                        <TableCell align="right">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ width: { xs: '100%', sm: '300px' } }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Shipping:</Typography>
                    <Typography variant="body1">Free</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Tax:</Typography>
                    <Typography variant="body1">
                      ${(parseFloat(order.totalAmount) * 0.08).toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">
                      ${(parseFloat(order.totalAmount) * 1.08).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          {/* Order Information */}
          <Grid item xs={12} md={4}>
            {/* Shipping Information */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AddressIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Shipping Address</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography>{shippingAddress.fullName}</Typography>
                <Typography>{shippingAddress.addressLine1}</Typography>
                {shippingAddress.addressLine2 && (
                  <Typography>{shippingAddress.addressLine2}</Typography>
                )}
                <Typography>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                </Typography>
                <Typography>{shippingAddress.country}</Typography>
                <Typography sx={{ mt: 1 }}>
                  Phone: {shippingAddress.phoneNumber}
                </Typography>
              </CardContent>
            </Card>
            
            {/* Payment Information */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PaymentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Payment Information</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {payment ? (
                  <>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Method:</Typography>
                      <Typography variant="body2">
                        {payment.paymentMethod.replace('_', ' ')}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Status:</Typography>
                      <Chip 
                        label={payment.status} 
                        color={getStatusColor(payment.status)} 
                        size="small"
                      />
                    </Box>
                    {payment.transactionId && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Transaction ID:</Typography>
                        <Typography variant="body2" sx={{ maxWidth: '60%', wordBreak: 'break-all' }}>
                          {payment.transactionId}
                        </Typography>
                      </Box>
                    )}
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Date:</Typography>
                      <Typography variant="body2">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Payment information not available.
                  </Typography>
                )}
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Need Help?
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Contact Support
                </Button>
                {orderStatus !== 'CANCELLED' && orderStatus !== 'DELIVERED' && (
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                  >
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ProtectedRoute>
  );
};

export default OrderDetailPage;
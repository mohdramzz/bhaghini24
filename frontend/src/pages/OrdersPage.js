import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Chip,
  Button,
  Alert,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  Search as SearchIcon, 
  ShoppingBag as OrderIcon,
  ArrowForward as ArrowIcon 
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { orderApi } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageHero from '../components/common/PageHero';
import ProtectedRoute from '../components/common/ProtectedRoute';

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

const OrdersPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getUserOrders();
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = orders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
    setPage(0);
  }, [searchTerm, orders]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <PageHero
        title="My Orders"
        description="Track and manage your orders"
        imageUrl="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        height={250}
      />
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <OrderIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5">
                    Order Summary
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Total Orders:</Typography>
                  <Typography variant="body1" fontWeight="bold">{orders.length}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Pending:</Typography>
                  <Chip 
                    label={orders.filter(order => order.status === 'PENDING').length} 
                    size="small" 
                    color={getStatusColor('PENDING')}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Processing:</Typography>
                  <Chip 
                    label={orders.filter(order => order.status === 'PROCESSING').length} 
                    size="small" 
                    color={getStatusColor('PROCESSING')}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Shipped:</Typography>
                  <Chip 
                    label={orders.filter(order => order.status === 'SHIPPED').length} 
                    size="small" 
                    color={getStatusColor('SHIPPED')}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Delivered:</Typography>
                  <Chip 
                    label={orders.filter(order => order.status === 'DELIVERED').length} 
                    size="small" 
                    color={getStatusColor('DELIVERED')}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Cancelled:</Typography>
                  <Chip 
                    label={orders.filter(order => order.status === 'CANCELLED').length} 
                    size="small" 
                    color={getStatusColor('CANCELLED')}
                  />
                </Box>
                
                <Box sx={{ mt: 3 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    component={Link}
                    to="/products"
                  >
                    Browse Products
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Order List */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                <TextField
                  placeholder="Search orders..."
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {error ? (
                <Box p={3}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              ) : filteredOrders.length === 0 ? (
                <Box p={3} textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    No Orders Found
                  </Typography>
                  {orders.length > 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No results match your search criteria. Try a different search term.
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        You haven't placed any orders yet.
                      </Typography>
                      <Button 
                        variant="contained" 
                        component={Link} 
                        to="/products"
                      >
                        Start Shopping
                      </Button>
                    </>
                  )}
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="orders table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Order #</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredOrders
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((order) => (
                            <TableRow key={order.id} hover>
                              <TableCell component="th" scope="row">
                                {order.orderNumber}
                              </TableCell>
                              <TableCell>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={order.status} 
                                  color={getStatusColor(order.status)} 
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="right">
                                ${parseFloat(order.totalAmount).toFixed(2)}
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  component={Link}
                                  to={`/order/${order.id}`}
                                  size="small"
                                  endIcon={<ArrowIcon />}
                                >
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ProtectedRoute>
  );
};

export default OrdersPage;
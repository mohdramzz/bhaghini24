import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  Radio, 
  RadioGroup, 
  FormControl, 
  FormLabel, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { 
  Payment as PaymentIcon, 
  LocalShipping as ShippingIcon, 
  CheckCircleOutline as ConfirmIcon 
} from '@mui/icons-material';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { orderApi, paymentApi } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';


const AddressForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            variant="outlined"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            variant="outlined"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="addressLine1"
            name="addressLine1"
            label="Address line 1"
            fullWidth
            variant="outlined"
            value={formData.addressLine1}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="addressLine2"
            name="addressLine2"
            label="Address line 2 (optional)"
            fullWidth
            variant="outlined"
            value={formData.addressLine2}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            variant="outlined"
            value={formData.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="outlined"
            value={formData.state}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="postalCode"
            name="postalCode"
            label="Zip / Postal code"
            fullWidth
            variant="outlined"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            variant="outlined"
            value={formData.country}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            variant="outlined"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox 
                color="primary" 
                name="saveAddress" 
                checked={formData.saveAddress}
                onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
              />
            }
            label="Use this address for payment details"
          />
        </Grid>
      </Grid>
    </>
  );
};

const PaymentForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend">Select Payment Method</FormLabel>
        <RadioGroup
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
            <FormControlLabel 
              value="CREDIT_CARD" 
              control={<Radio />} 
              label="Credit / Debit Card" 
            />
            {formData.paymentMethod === 'CREDIT_CARD' && (
              <Box sx={{ pl: 4, pt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardNumber"
                      name="cardNumber"
                      label="Card number"
                      fullWidth
                      variant="outlined"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardName"
                      name="cardName"
                      label="Name on card"
                      fullWidth
                      variant="outlined"
                      value={formData.cardName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="expiryDate"
                      name="expiryDate"
                      label="Expiry date"
                      fullWidth
                      variant="outlined"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="cvv"
                      name="cvv"
                      label="CVV"
                      fullWidth
                      variant="outlined"
                      value={formData.cvv}
                      onChange={handleChange}
                      helperText="Last three digits on signature strip"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
          
          <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
            <FormControlLabel 
              value="PAYPAL" 
              control={<Radio />} 
              label="PayPal" 
            />
            {formData.paymentMethod === 'PAYPAL' && (
              <Box sx={{ pl: 4, pt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  You will be redirected to PayPal to complete your payment.
                </Typography>
                <TextField
                  required
                  id="paypalEmail"
                  name="paypalEmail"
                  label="PayPal Email"
                  fullWidth
                  variant="outlined"
                  value={formData.paypalEmail}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </Paper>
          
          <Paper variant="outlined" sx={{ p: 2 }}>
            <FormControlLabel 
              value="BANK_TRANSFER" 
              control={<Radio />} 
              label="Bank Transfer" 
            />
            {formData.paymentMethod === 'BANK_TRANSFER' && (
              <Box sx={{ pl: 4, pt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Please use the following details to make a bank transfer:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Bank: Example Bank<br />
                  Account Name: E-Commerce Store<br />
                  Account Number: 1234567890<br />
                  Sort Code: 12-34-56<br />
                  Reference: Your order number (will be provided)
                </Typography>
                <Alert severity="info" sx={{ mt: 2 }}>
                  Your order will be processed once payment is confirmed.
                </Alert>
              </Box>
            )}
          </Paper>
        </RadioGroup>
      </FormControl>
      
      <FormControlLabel
        control={
          <Checkbox 
            color="primary" 
            name="saveCard"
            checked={formData.saveCard}
            onChange={(e) => setFormData({ ...formData, saveCard: e.target.checked })}
          />
        }
        label="Remember payment details for next time"
      />
    </>
  );
};

const ReviewOrder = ({ formData, cartItems, totalPrice }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      
      <List disablePadding>
        {cartItems.map((item) => (
          <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
            <ListItemText 
              primary={item.name} 
              secondary={`Quantity: ${item.quantity}`} 
            />
            <Typography variant="body2">
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Subtotal" />
          <Typography variant="subtitle1">
            ${totalPrice.toFixed(2)}
          </Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" />
          <Typography variant="subtitle1">
            Free
          </Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Tax (8%)" />
          <Typography variant="subtitle1">
            ${(totalPrice * 0.08).toFixed(2)}
          </Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" fontWeight="bold">
            ${(totalPrice + (totalPrice * 0.08)).toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <Typography gutterBottom>
        {`${formData.firstName} ${formData.lastName}`}
      </Typography>
      <Typography gutterBottom>
        {formData.addressLine1}
        {formData.addressLine2 && <>, {formData.addressLine2}</>}
      </Typography>
      <Typography gutterBottom>
        {`${formData.city}, ${formData.state} ${formData.postalCode}`}
      </Typography>
      <Typography gutterBottom>
        {formData.country}
      </Typography>
      <Typography gutterBottom>
        {formData.phoneNumber}
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      {formData.paymentMethod === 'CREDIT_CARD' && (
        <>
          <Typography gutterBottom>
            Card Type: Visa
          </Typography>
          <Typography gutterBottom>
            Card Holder: {formData.cardName}
          </Typography>
          <Typography gutterBottom>
            Card Number: **** **** **** {formData.cardNumber.slice(-4)}
          </Typography>
          <Typography gutterBottom>
            Expiry Date: {formData.expiryDate}
          </Typography>
        </>
      )}
      {formData.paymentMethod === 'PAYPAL' && (
        <Typography gutterBottom>
          PayPal: {formData.paypalEmail}
        </Typography>
      )}
      {formData.paymentMethod === 'BANK_TRANSFER' && (
        <Typography gutterBottom>
          Payment will be made via bank transfer
        </Typography>
      )}
    </>
  );
};


const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    saveAddress: false,
    paymentMethod: 'CREDIT_CARD',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paypalEmail: '',
    saveCard: false
  });

  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const steps = ['Shipping Address', 'Payment Details', 'Review Order'];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [cartItems, currentUser, navigate]);


  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
      }));
    }
  }, [currentUser]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      const shippingAddress = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phoneNumber: formData.phoneNumber
      };
      
 
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      }));
      
   
      const orderResponse = await orderApi.createOrder({
        items: orderItems,
        shippingAddress: shippingAddress
      });
      
      const orderId = orderResponse.data.id;
      setOrderNumber(orderResponse.data.orderNumber);
      

      const paymentData = {
        orderId: orderId,
        amount: totalPrice + (totalPrice * 0.08),
        paymentMethod: formData.paymentMethod,
        cardDetails: formData.paymentMethod === 'CREDIT_CARD' ? {
          cardNumber: formData.cardNumber,
          cardHolderName: formData.cardName,
          expiryMonth: formData.expiryDate.split('/')[0],
          expiryYear: `20${formData.expiryDate.split('/')[1]}`,
          cvv: formData.cvv
        } : null
      };
      
      const paymentResponse = await paymentApi.processPayment(paymentData);
      
      if (paymentResponse.data.status === 'COMPLETED') {
 
        clearCart();
        setActiveStep(activeStep + 1);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm formData={formData} setFormData={setFormData} />;
      case 1:
        return <PaymentForm formData={formData} setFormData={setFormData} />;
      case 2:
        return <ReviewOrder formData={formData} cartItems={cartItems} totalPrice={totalPrice} />;
      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ConfirmIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Thank you for your order!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Your order number is #{orderNumber}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              We have emailed your order confirmation, and will send you an update when your order has shipped.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/order/${orderNumber}`)}
              sx={{ mr: 2 }}
            >
              View Order Details
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </Box>
        );
      default:
        throw new Error('Unknown step');
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:  
        return formData.firstName && 
               formData.lastName && 
               formData.addressLine1 && 
               formData.city && 
               formData.state && 
               formData.postalCode && 
               formData.country && 
               formData.phoneNumber;
      case 1:  
        if (formData.paymentMethod === 'CREDIT_CARD') {
          return formData.cardNumber && 
                 formData.cardName && 
                 formData.expiryDate && 
                 formData.cvv;
        } else if (formData.paymentMethod === 'PAYPAL') {
          return formData.paypalEmail;
        }
        return true;  
      case 2: 
        return true;  
      default:
        return false;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Processing your order..." />;
  }

  return (
    <Container sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                StepIconProps={{
                  icon: index === 0 ? <ShippingIcon /> : index === 1 ? <PaymentIcon /> : <ConfirmIcon />
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {getStepContent(activeStep)}
        
        {activeStep < 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
            >
              {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Order summary card - visible on first two steps */}
      {activeStep < 2 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary={item.name} 
                    secondary={`Quantity: ${item.quantity}`} 
                  />
                  <Typography variant="body2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="subtitle1">
                  ${totalPrice.toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Tax (8%)" />
                <Typography variant="subtitle1">
                  ${(totalPrice * 0.08).toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" fontWeight="bold">
                  ${(totalPrice + (totalPrice * 0.08)).toFixed(2)}
                </Typography>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default CheckoutPage;
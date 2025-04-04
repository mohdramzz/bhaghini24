import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Rating,
  Breadcrumbs,
  Card,
  CardContent,
  TextField,
  IconButton,
  Chip,
  Skeleton,
  Alert,
  Paper,
  Tab,
  Tabs,
  Dialog,
  DialogContent,
  Snackbar,
  styled
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon,
  ZoomIn as ZoomInIcon,
  LocalShipping as ShippingIcon, 
  Assignment as AssignmentIcon,
  WaterDrop as MaterialIcon,
  Wash as CareIcon,
  Done as DoneIcon
} from '@mui/icons-material';
import { productApi } from '../services/api';
import { CartContext } from '../contexts/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Styled Components
const StyledProductTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 600,
  letterSpacing: '1px',
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '60px',
    height: '2px',
    backgroundColor: '#D4AF37',
  }
}));

const StyledProductPrice = styled(Typography)(({ theme }) => ({
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 600,
  color: '#D4AF37',
  fontSize: '2rem',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const GoldButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#D4AF37',
  color: '#000',
  fontWeight: 500,
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: '#C5A028',
  },
  textTransform: 'none',
  letterSpacing: '1px',
}));

const OutlinedGoldButton = styled(Button)(({ theme }) => ({
  borderColor: '#D4AF37',
  color: '#D4AF37',
  fontWeight: 500,
  padding: '12px 24px',
  '&:hover': {
    borderColor: '#C5A028',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  textTransform: 'none',
  letterSpacing: '1px',
}));

const StyledQuantityInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(212, 175, 55, 0.3)',
      borderRadius: '4px',
    },
    '&:hover fieldset': {
      borderColor: '#D4AF37',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#D4AF37',
    },
  },
  '& .MuiInputBase-input': {
    textAlign: 'center',
  },
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid rgba(212, 175, 55, 0.3)',
  color: '#D4AF37',
  '&:hover': {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  '&.Mui-disabled': {
    color: 'rgba(212, 175, 55, 0.3)',
  },
}));

const ProductImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '500px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(212, 175, 55, 0.2)',
  borderRadius: '4px',
}));

const MainImageContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'zoom-in',
}));

const ThumbnailContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  gap: theme.spacing(1),
}));

const Thumbnail = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  border: '1px solid rgba(212, 175, 55, 0.2)',
  borderRadius: '4px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#D4AF37',
  },
}));

const ZoomIconContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 1,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
}));

const FeatureIconContainer = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  color: '#D4AF37',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#D4AF37',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#000',
    '&.Mui-selected': {
      color: '#D4AF37',
    },
  },
}));

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const getProductImages = (product) => {
    if (!product) return [];
    
    return [
      product.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image',
      'https://via.placeholder.com/600x600?text=Alternate+View',
      'https://via.placeholder.com/600x600?text=Detail+View',
      'https://via.placeholder.com/600x600?text=Lifestyle+View',
    ];
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProductById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setSnackbarMessage(`${quantity} ${product.name} added to your cart`);
      setSnackbarOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const toggleWishlist = () => {
    setWishlist(!wishlist);
    setSnackbarMessage(wishlist 
      ? `${product.name} removed from your wishlist` 
      : `${product.name} added to your wishlist`);
    setSnackbarOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleZoomToggle = () => {
    setZoomOpen(!zoomOpen);
  };

  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={500} animation="wave" sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
              {[1, 2, 3, 4].map((item) => (
                <Skeleton 
                  key={item} 
                  variant="rectangular" 
                  width={80} 
                  height={80} 
                  animation="wave" 
                  sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)' }} 
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} width="80%" animation="wave" sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)' }} />
            <Skeleton variant="text" height={30} width="50%" animation="wave" sx={{ my: 1, bgcolor: 'rgba(212, 175, 55, 0.1)' }} />
            <Skeleton variant="text" height={50} width="40%" animation="wave" sx={{ mb: 2, bgcolor: 'rgba(212, 175, 55, 0.1)' }} />
            <Skeleton variant="rectangular" height={100} animation="wave" sx={{ mb: 3, bgcolor: 'rgba(212, 175, 55, 0.1)' }} />
            <Skeleton variant="rectangular" height={50} width="60%" animation="wave" sx={{ mb: 3, bgcolor: 'rgba(212, 175, 55, 0.1)' }} />
            <Skeleton variant="rectangular" height={60} animation="wave" sx={{ mb: 2, bgcolor: 'rgba(212, 175, 55, 0.1)' }} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" height={50} width="100%" animation="wave" sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)' }} />
              <Skeleton variant="rectangular" height={50} width="100%" animation="wave" sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '8px',
            backgroundColor: '#f8f8f8'
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <OutlinedGoldButton onClick={() => navigate('/products')} sx={{ mt: 2 }}>
            Back to Products
          </OutlinedGoldButton>
        </Paper>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '8px',
            backgroundColor: '#f8f8f8'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Product not found
          </Typography>
          <OutlinedGoldButton onClick={() => navigate('/products')} sx={{ mt: 2 }}>
            Browse Products
          </OutlinedGoldButton>
        </Paper>
      </Container>
    );
  }

  const productImages = getProductImages(product);
  const isOutOfStock = product.stock <= 0;

  const productSpecs = [
    { label: 'Material', value: 'Premium Cotton Blend' },
    { label: 'Size', value: 'S, M, L, XL, XXL' },
    { label: 'Color', value: 'Black' },
    { label: 'Care Instructions', value: 'Machine wash cold, tumble dry low' },
    { label: 'Weight', value: '0.5 kg' },
    { label: 'Product Code', value: `BHG-${id.padStart(5, '0')}` },
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4, opacity: 0.7 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
          <Link to="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
            Products
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={6}>
          {/* Product Image Gallery */}
          <Grid item xs={12} md={6}>
            <ProductImageContainer 
              sx={{
                '&:hover .zoom-icon': {
                  opacity: 1,
                }
              }}
            >
              <MainImageContainer onClick={handleZoomToggle}>
                <img
                  src={productImages[activeImage]}
                  alt={`${product.name} - View ${activeImage + 1}`}
                  style={{ 
                    maxWidth: '90%', 
                    maxHeight: '90%', 
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </MainImageContainer>
              <ZoomIconContainer className="zoom-icon" onClick={handleZoomToggle}>
                <ZoomInIcon />
              </ZoomIconContainer>
            </ProductImageContainer>
            
            <ThumbnailContainer>
              {productImages.map((image, index) => (
                <Thumbnail 
                  key={index} 
                  onClick={() => handleThumbnailClick(index)}
                  sx={{ 
                    border: index === activeImage 
                      ? '2px solid #D4AF37' 
                      : '1px solid rgba(212, 175, 55, 0.2)' 
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    sx={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }}
                  />
                </Thumbnail>
              ))}
            </ThumbnailContainer>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box>
              <StyledProductTitle variant="h4" component="h1">
                {product.name}
              </StyledProductTitle>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Rating 
                  value={4} 
                  readOnly 
                  precision={0.5} 
                  sx={{ 
                    '& .MuiRating-iconFilled': {
                      color: '#D4AF37',
                    },
                  }} 
                />
                <Typography variant="body2" sx={{ ml: 1, opacity: 0.7 }}>
                  (15 reviews)
                </Typography>
              </Box>

              <StyledProductPrice variant="h4">
                ${parseFloat(product.price).toFixed(2)}
              </StyledProductPrice>

              <Divider sx={{ my: 3, borderColor: 'rgba(212, 175, 55, 0.2)' }} />

              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  lineHeight: 1.8, 
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '1.1rem',
                }}
              >
                {product.description}
              </Typography>

              <Box 
                sx={{ 
                  p: 2.5, 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: '8px',
                  mt: 3,
                  mb: 4,
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <FeatureIconContainer>
                        <ShippingIcon />
                      </FeatureIconContainer>
                      <Box>
                        <Typography variant="subtitle2">Shipping</Typography>
                        <Typography variant="body2" color="text.secondary">Free over $50</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <FeatureIconContainer>
                        <AssignmentIcon />
                      </FeatureIconContainer>
                      <Box>
                        <Typography variant="subtitle2">Returns</Typography>
                        <Typography variant="body2" color="text.secondary">30-day guarantee</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <FeatureIconContainer>
                        <MaterialIcon />
                      </FeatureIconContainer>
                      <Box>
                        <Typography variant="subtitle2">Materials</Typography>
                        <Typography variant="body2" color="text.secondary">Premium fabrics</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center">
                      <FeatureIconContainer>
                        <CareIcon />
                      </FeatureIconContainer>
                      <Box>
                        <Typography variant="subtitle2">Care</Typography>
                        <Typography variant="body2" color="text.secondary">Detailed instructions</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="subtitle1" sx={{ minWidth: '100px' }}>
                  Category:
                </Typography>
                <Chip 
                  label={product.categoryName || 'Uncategorized'} 
                  component={Link} 
                  to={`/category/${product.categoryId}`}
                  clickable 
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    color: '#000',
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    }
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <Typography variant="subtitle1" sx={{ minWidth: '100px' }}>
                  Availability:
                </Typography>
                <Chip 
                  label={isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
                  size="small"
                  sx={{ 
                    backgroundColor: isOutOfStock ? 'rgba(211, 47, 47, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                    color: isOutOfStock ? '#d32f2f' : '#2e7d32',
                    borderColor: isOutOfStock ? 'rgba(211, 47, 47, 0.3)' : 'rgba(46, 125, 50, 0.3)',
                  }}
                />
              </Box>

              {!isOutOfStock && (
                <>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    mb={4}
                  >
                    <Typography variant="subtitle1" sx={{ minWidth: '100px' }}>
                      Quantity:
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <QuantityButton 
                        onClick={decrementQuantity} 
                        size="small" 
                        disabled={quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </QuantityButton>
                      <StyledQuantityInput
                        value={quantity}
                        onChange={handleQuantityChange}
                        variant="outlined"
                        size="small"
                        inputProps={{ 
                          min: 1, 
                          max: product.stock,
                          style: { textAlign: 'center', width: '30px' } 
                        }}
                        sx={{ width: '60px', mx: 1 }}
                      />
                      <QuantityButton 
                        onClick={incrementQuantity} 
                        size="small"
                        disabled={quantity >= product.stock}
                      >
                        <AddIcon fontSize="small" />
                      </QuantityButton>
                    </Box>
                  </Box>

                  <Box display="flex" gap={2} mb={3}>
                    <GoldButton
                      size="large"
                      startIcon={<CartIcon />}
                      onClick={handleAddToCart}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Add to Cart
                    </GoldButton>
                    <OutlinedGoldButton
                      size="large"
                      onClick={handleBuyNow}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Buy Now
                    </OutlinedGoldButton>
                  </Box>
                </>
              )}

              <OutlinedGoldButton
                startIcon={wishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={toggleWishlist}
                sx={{ mb: 2 }}
                fullWidth={window.innerWidth < 960}
              >
                {wishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
              </OutlinedGoldButton>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Box sx={{ width: '100%', mt: 8, mb: 4 }}>
          <StyledTabs 
            value={tabValue} 
            onChange={handleTabChange}
            centered
            sx={{ 
              borderBottom: 1, 
              borderColor: 'rgba(212, 175, 55, 0.2)',
              mb: 4 
            }}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
            <Tab label="Shipping & Returns" />
          </StyledTabs>
          
          <Box sx={{ p: { xs: 2, md: 4 }, border: '1px solid rgba(212, 175, 55, 0.1)', borderRadius: '8px' }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', mb: 3 }}>
                  Product Description
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8,
                    color: 'rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {product.description || 'No detailed description available for this product.'}
                </Typography>
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>Features & Benefits</Typography>
                  <Box>
                    {['Premium quality fabrics', 'Handcrafted with attention to detail', 'Timeless design', 'Versatile styling options'].map((item, index) => (
                      <Box 
                        key={index} 
                        display="flex" 
                        alignItems="center" 
                        sx={{ mb: 1.5 }}
                      >
                        <Box 
                          sx={{ 
                            mr: 2, 
                            color: '#D4AF37',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <DoneIcon fontSize="small" />
                        </Box>
                        <Typography variant="body1">{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', mb: 3 }}>
                  Product Specifications
                </Typography>
                <Grid container spacing={2}>
                  {productSpecs.map((spec, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12} sm={4} sx={{ py: 1.5 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'rgba(0, 0, 0, 0.7)'
                          }}
                        >
                          {spec.label}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8} sx={{ py: 1.5 }}>
                        <Typography variant="body2">
                          {spec.value}
                        </Typography>
                      </Grid>
                      {index < productSpecs.length - 1 && (
                        <Grid item xs={12}>
                          <Divider sx={{ borderColor: 'rgba(212, 175, 55, 0.1)' }} />
                        </Grid>
                      )}
                    </React.Fragment>
                  ))}
                </Grid>
              </Box>
            )}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', mb: 3 }}>
                  Customer Reviews
                </Typography>
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" sx={{ opacity: 0.7 }}>
                    This product has 15 reviews with an average rating of 4 stars.
                  </Typography>
                  <OutlinedGoldButton sx={{ mt: 2 }}>
                    Write a Review
                  </OutlinedGoldButton>
                </Box>
              </Box>
            )}
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', mb: 3 }}>
                  Shipping Information
                </Typography>
                <Typography 
                  paragraph 
                  sx={{ 
                    lineHeight: 1.8,
                    color: 'rgba(0, 0, 0, 0.7)',
                    mb: 4,
                  }}
                >
                  Free standard shipping on all orders over $50. Orders are typically processed within 1-2 business days.
                  Delivery times vary depending on your location, but generally take 3-7 business days.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ color: '#D4AF37', mb: 3 }}>
                  Return Policy
                </Typography>
                <Typography 
                  sx={{ 
                    lineHeight: 1.8,
                    color: 'rgba(0, 0, 0, 0.7)',
                  }}
                >
                  We accept returns within 30 days of delivery for a full refund or exchange.
                  Items must be unused and in their original packaging. Please contact our customer 
                  service team to initiate a return.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* */}
        <Box sx={{ mt: 10, mb: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              pb: 1,
              mb: 4,
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '60px',
                height: '2px',
                backgroundColor: '#D4AF37',
              }
            }}
          >
            You might also like
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Explore more products similar to this one
          </Typography>
          
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ opacity: 0.7, mb: 3 }}>
              Related products will appear here
            </Typography>
            <OutlinedGoldButton component={Link} to="/products">
              Explore All Products
            </OutlinedGoldButton>
          </Box>
        </Box>
      </Container>

      {/* */}
      <Dialog
        open={zoomOpen}
        onClose={handleZoomToggle}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent 
          sx={{ 
            p: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#000',
            position: 'relative',
            height: '90vh'
          }}
          onClick={handleZoomToggle}
        >
          <img
            src={productImages[activeImage]}
            alt={product.name}
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              objectFit: 'contain',
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              position: 'absolute', 
              bottom: 20, 
              left: '50%', 
              transform: 'translateX(-50%)',
              color: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            Click anywhere to close
          </Typography>
        </DialogContent>
      </Dialog>

      {/* */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            ×
          </IconButton>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#D4AF37',
            color: '#000',
          }
        }}
      />
    </>
  );
};

export default ProductDetailPage;
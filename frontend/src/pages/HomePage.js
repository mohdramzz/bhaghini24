import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Box, 
  Button,
  Divider,
  styled 
} from '@mui/material';
import { productApi, categoryApi } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Styled components with black and gold theme
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  letterSpacing: '1.5px',
  fontFamily: '"Montserrat", sans-serif',
  position: 'relative',
  display: 'inline-block',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: '40%',
    height: 2,
    backgroundColor: '#D4AF37',
  }
}));

const HeroSection = styled(Box)(({ theme, bgImage }) => ({
  position: 'relative',
  height: '85vh',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  overflow: 'hidden',
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  fontFamily: '"Montserrat", sans-serif',
  letterSpacing: '2px',
  fontSize: '4rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

const HeroDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  maxWidth: '700px',
  fontSize: '1.1rem',
  lineHeight: 1.6,
}));

const GoldButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#D4AF37',
  color: '#000',
  fontWeight: 500,
  padding: '12px 30px',
  '&:hover': {
    backgroundColor: '#C5A028',
  },
  textTransform: 'none',
  letterSpacing: '1px',
}));

const OutlinedGoldButton = styled(Button)(({ theme }) => ({
  borderColor: '#D4AF37',
  color: '#D4AF37',
  '&:hover': {
    borderColor: '#C5A028',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  textTransform: 'none',
  letterSpacing: '1px',
}));

const FeatureSection = styled(Box)(({ theme, bgImage, bgColor }) => ({
  height: '80vh',
  position: 'relative',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  backgroundImage: bgImage ? `url(${bgImage})` : 'none',
  backgroundColor: bgColor || 'transparent',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1
  }
}));

const FeatureContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(4),
  maxWidth: '800px',
}));

const GoldHeading = styled(Typography)(({ theme }) => ({
  color: '#D4AF37',
  fontWeight: 500,
  letterSpacing: '2px',
  marginBottom: theme.spacing(2),
  fontFamily: '"Montserrat", sans-serif',
}));

const WhiteSubheading = styled(Typography)(({ theme }) => ({
  color: '#fff',
  fontWeight: 400,
  letterSpacing: '1px',
  marginBottom: theme.spacing(4),
}));

const QuoteSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#D4AF37',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 60,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '2px',
    backgroundColor: '#D4AF37',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 60,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '2px',
    backgroundColor: '#D4AF37',
  }
}));

const ProductFeature = styled(Box)(({ theme, reverse }) => ({
  display: 'flex',
  flexDirection: reverse ? 'row-reverse' : 'row',
  minHeight: '80vh',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const ProductImage = styled(Box)(({ theme, image }) => ({
  flex: '1 0 50%',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  }
}));

const ProductContent = styled(Box)(({ theme }) => ({
  flex: '1 0 50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6),
  backgroundColor: '#000',
  color: '#fff',
}));

const CategorySection = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(10, 0),
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s',
  backgroundColor: '#111',
  color: '#fff',
  boxShadow: 'none',
  border: '1px solid rgba(212, 175, 55, 0.2)',
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: '#D4AF37',
  },
}));

const HeritageSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
}));

const HeritageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#000',
  marginBottom: theme.spacing(4),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -16,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '2px',
    backgroundColor: '#D4AF37',
  }
}));

const SpecialOfferSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
  }
}));

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products
        const productsResponse = await productApi.getFeaturedProducts();
        setFeaturedProducts(productsResponse.data);
        
        // Fetch categories
        const categoriesResponse = await categoryApi.getAllCategories();
        setCategories(categoriesResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography color="error" align="center" variant="h5">
          {error}
        </Typography>
        <Box textAlign="center" mt={4}>
          <GoldButton onClick={() => window.location.reload()}>
            Retry
          </GoldButton>
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section with clothes rack background */}
      <HeroSection 
        bgImage="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <HeroTitle variant="h1">
            WELCOME TO <span style={{ color: '#D4AF37' }}>BHAGHINI</span>
          </HeroTitle>
          <HeroDescription variant="h6">
            Discover exquisite style and unmatched quality. Our curated collection brings 
            you the finest products with premium craftsmanship.
          </HeroDescription>
          <GoldButton component={Link} to="/products" size="large">
            Explore Collection
          </GoldButton>
        </Box>
      </HeroSection>

      {/* Made in Dhaka, Bangladesh Section */}
      <FeatureSection bgImage="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80">
        <FeatureContent>
          <GoldHeading variant="h2">
            Made in Dhaka, Bangladesh
          </GoldHeading>
          <WhiteSubheading variant="h6">
            FROM PREMIUM CRAFTSMANSHIP
          </WhiteSubheading>
          <OutlinedGoldButton 
            component={Link} 
            to="/products"
            size="large"
          >
            EXPLORE
          </OutlinedGoldButton>
        </FeatureContent>
      </FeatureSection>

      {/* Featured Products */}
      <Box sx={{ py: 10, bgcolor: '#000', color: '#fff' }}>
        <Container>
          <Box mb={6} sx={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', pb: 2 }}>
            <SectionTitle variant="h4" sx={{ color: '#fff' }}>
              Featured Products
            </SectionTitle>
          </Box>
          
          {featuredProducts.length > 0 ? (
            <Grid container spacing={4}>
              {featuredProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography align="center" color="rgba(255, 255, 255, 0.7)" sx={{ py: 6 }}>
              No featured products available at the moment.
            </Typography>
          )}
          
          <Box textAlign="center" mt={6}>
            <OutlinedGoldButton 
              component={Link} 
              to="/products"
              size="large"
              variant="outlined"
            >
              View All Products
            </OutlinedGoldButton>
          </Box>
        </Container>
      </Box>

      {/* Quote Section */}
      <QuoteSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="div" sx={{ 
            fontStyle: 'italic', 
            fontWeight: 400,
            letterSpacing: '1px',
            mb: 4,
            fontSize: {xs: '1.8rem', md: '2.5rem'},
            lineHeight: 1.4
          }}>
            "Elegance is not about being noticed, it's about being remembered."
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            — Giorgio Armani
          </Typography>
        </Container>
      </QuoteSection>

      {/* Luxury Collection Feature */}
      <FeatureSection bgImage="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd">
        <FeatureContent>
          <GoldHeading variant="h2">
            Luxury Collection
          </GoldHeading>
          <WhiteSubheading variant="h6">
            TIMELESS ELEGANCE FOR THE DISCERNING
          </WhiteSubheading>
          <OutlinedGoldButton 
            component={Link} 
            to="/products/luxury"
            size="large"
          >
            DISCOVER
          </OutlinedGoldButton>
        </FeatureContent>
      </FeatureSection>

      {/* Product Feature 1 - Signature Jacket */}
      <ProductFeature>
        <ProductImage image="https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" />
        <ProductContent>
          <GoldHeading variant="h3">THE SIGNATURE JACKET</GoldHeading>
          <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4, lineHeight: 1.8 }}>
            Crafted from the finest materials with meticulous attention to detail, our signature jacket embodies timeless sophistication.
          </Typography>
          <Box>
            <OutlinedGoldButton component={Link} to="/product/signature-jacket">
              SHOP
            </OutlinedGoldButton>
          </Box>
        </ProductContent>
      </ProductFeature>

      {/* Product Feature 2 - Classic Trousers */}
      <ProductFeature reverse>
        <ProductImage image="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" />
        <ProductContent>
          <GoldHeading variant="h3">THE CLASSIC TROUSERS</GoldHeading>
          <Typography variant="body1" paragraph sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4, lineHeight: 1.8 }}>
            Refined silhouettes and premium fabrics define our classic trouser collection. Experience unparalleled comfort without compromising on style.
          </Typography>
          <Box>
            <OutlinedGoldButton component={Link} to="/product/classic-trousers">
              SHOP
            </OutlinedGoldButton>
          </Box>
        </ProductContent>
      </ProductFeature>

      {/* Shop by Category */}
      <CategorySection>
        <Container>
          <Box mb={6} sx={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', pb: 2 }}>
            <SectionTitle variant="h4" sx={{ color: '#fff' }}>
              Shop by Category
            </SectionTitle>
          </Box>
          
          <Grid container spacing={4}>
            {categories.map((category) => (
              <Grid item key={category.id} xs={12} sm={6} md={4}>
                <CategoryCard component={Link} to={`/category/${category.id}`}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={category.imageUrl || 'https://via.placeholder.com/300x240?text=Category'}
                    alt={category.name}
                    sx={{ 
                      objectFit: 'cover',
                      filter: 'brightness(0.8) contrast(1.2)'
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ 
                      color: '#D4AF37',
                      fontWeight: 500,
                      letterSpacing: '1px',
                    }}>
                      {category.name?.toUpperCase() || 'CATEGORY'}
                    </Typography>
                    {category.description && (
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {category.description}
                      </Typography>
                    )}
                  </CardContent>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </CategorySection>

      {/* Heritage Section */}
      <HeritageSection>
        <Container maxWidth="md">
          <HeritageTitle variant="h2">
            Our Heritage
          </HeritageTitle>
          <Typography variant="body1" paragraph sx={{ maxWidth: '800px', fontSize: '1.1rem', mx: 'auto', mb: 4, lineHeight: 1.8 }}>
            The tradition of Bangladeshi craftsmanship dates back centuries, with techniques passed down through generations of skilled artisans. Each piece in our collection honors this heritage while embracing contemporary design sensibilities.
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: '800px', fontSize: '1.1rem', mx: 'auto', lineHeight: 1.8 }}>
            Our commitment to quality and sustainability ensures that every Bhaghini creation is not just a purchase, but an investment in timeless style and cultural preservation.
          </Typography>
        </Container>
      </HeritageSection>

      {/* Special Offer */}
      <SpecialOfferSection>
        <Container>
          <GoldHeading variant="h3" sx={{ mb: 2 }}>
            SPECIAL OFFER
          </GoldHeading>
          <Typography variant="h5" gutterBottom sx={{ mb: 4, color: '#fff' }}>
            Get 20% off on your first order
          </Typography>
          <GoldButton 
            component={Link} 
            to="/signup" 
            size="large" 
          >
            Sign Up Now
          </GoldButton>
        </Container>
      </SpecialOfferSection>
    </>
  );
};

export default HomePage;
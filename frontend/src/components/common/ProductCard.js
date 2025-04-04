import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip, 
  Rating,
  Box, 
  styled
} from '@mui/material';
import { CartContext } from '../../contexts/CartContext';

// Styled components
const ProductCardStyled = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  backgroundColor: '#fff',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    '& .product-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '& .product-image': {
      transform: 'scale(1.05)',
    }
  }
}));

const ProductImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#f9f9f9',
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 240,
  objectFit: 'contain',
  transition: 'transform 0.6s ease',
}));

const ProductContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const ProductTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  fontFamily: '"Montserrat", sans-serif',
  letterSpacing: '0.5px',
}));

const ProductDescription = styled(Typography)(({ theme }) => ({
  color: 'rgba(0, 0, 0, 0.6)',
  marginBottom: theme.spacing(1),
  height: '3em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}));

const ProductPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#000',
  fontSize: '1.25rem',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#222',
  },
  '&.Mui-disabled': {
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
  },
  transition: 'all 0.3s ease',
  textTransform: 'none',
}));

const FeaturedChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 10,
  backgroundColor: '#D4AF37',
  color: '#000',
  fontWeight: 500,
}));

const ActionsContainer = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  opacity: 1,
  transform: 'translateY(0)',
}));

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <ProductCardStyled>
      {product.featured && (
        <FeaturedChip label="Featured" size="small" />
      )}
      
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ProductImageContainer>
          <ProductImage
            className="product-image"
            component="img"
            image={product.imageUrl || 'https://via.placeholder.com/300x240?text=No+Image'}
            alt={product.name}
          />
        </ProductImageContainer>
        
        <ProductContent>
          <ProductTitle variant="h6" component="div">
            {product.name}
          </ProductTitle>
          
          <ProductDescription variant="body2">
            {product.description}
          </ProductDescription>
          
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <ProductPrice>
              ${parseFloat(product.price).toFixed(2)}
            </ProductPrice>
            
            <Box display="flex" alignItems="center">
              <Rating name="read-only" value={4} size="small" readOnly sx={{ 
                '& .MuiRating-iconFilled': {
                  color: '#D4AF37',
                },
              }} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                ({product.reviews || 15})
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {product.categoryName || 'Clothing'}
          </Typography>
        </ProductContent>
      </Link>
      
      <ActionsContainer className="product-actions">
        <ActionButton 
          fullWidth
          disabled={product.stock <= 0}
          onClick={handleAddToCart}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </ActionButton>
      </ActionsContainer>
    </ProductCardStyled>
  );
};

export default ProductCard;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Divider,
  Button,
  Alert,
  TextField,
  InputAdornment,
  Pagination,
  Card,
  CardContent
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { productApi } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  
  const productsPerPage = 12;
  
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await productApi.searchProducts(searchTerm);
        setProducts(response.data);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to load search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [searchTerm]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  

  const totalPages = Math.ceil(products.length / productsPerPage);
  const displayedProducts = products.slice(
    (page - 1) * productsPerPage, 
    page * productsPerPage
  );
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={!searchTerm.trim()}
                >
                  Search
                </Button>
              </InputAdornment>
            )
          }}
        />
      </Box>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : products.length === 0 ? (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" gutterBottom>
              No results found for "{queryParam}"
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please try a different search term or browse our categories.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
            >
              Browse All Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography>
              {products.length} {products.length === 1 ? 'result' : 'results'} found for "{queryParam}"
            </Typography>
            {totalPages > 1 && (
              <Typography variant="body2" color="text.secondary">
                Page {page} of {totalPages}
              </Typography>
            )}
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {displayedProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchResultsPage;
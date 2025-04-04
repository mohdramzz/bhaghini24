import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Pagination,
  TextField,
  Slider,
  Divider,
  Chip,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  FilterList as FilterListIcon, 
  Search as SearchIcon,
  Clear as ClearIcon 
} from '@mui/icons-material';
import { productApi, categoryApi } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageHero from '../components/common/PageHero';

const ProductsPage = () => {
  const { id: categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name_asc');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [categoryName, setCategoryName] = useState('');
  
  const productsPerPage = 12;


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        setCategories(response.data);
        

        if (categoryId) {
          const category = response.data.find(c => c.id.toString() === categoryId);
          if (category) {
            setCategoryName(category.name);
            setSelectedCategory(categoryId);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        if (searchQuery) {
          response = await productApi.searchProducts(searchQuery);
        } else if (selectedCategory) {
          response = await productApi.getProductsByCategory(selectedCategory);
        } else {
          response = await productApi.getAllProducts();
        }


        let filteredProducts = response.data.filter(product => {
          const price = parseFloat(product.price);
          return price >= priceRange[0] && price <= priceRange[1];
        });


        const sortedProducts = sortProducts(filteredProducts, sortBy);
        setProducts(sortedProducts);
        

        setTotalPages(Math.ceil(sortedProducts.length / productsPerPage));
        setCurrentPage(1);  
        
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const sortProducts = (products, sortOption) => {
    const productsCopy = [...products];
    
    switch (sortOption) {
      case 'price_asc':
        return productsCopy.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price_desc':
        return productsCopy.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name_asc':
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return productsCopy;
    }
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    
    if (value) {
      const category = categories.find(c => c.id.toString() === value);
      if (category) {
        setCategoryName(category.name);
      }
      
      navigate(`/category/${value}`);
    } else {
      setCategoryName('');
      navigate('/products');
    }
    
    setSearchQuery('');
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    
    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange([0, 2000]);
    setSortBy('name_asc');
    setCategoryName('');
    navigate('/products');
  };


  const paginate = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : categoryName
      ? `${categoryName} Products`
      : 'All Products';

  if (loading && !(products.length > 0)) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHero
        title={pageTitle}
        description={searchQuery ? "Browse our product catalog" : "Discover our wide range of products"}
        imageUrl="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        height={250}
      />
      
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Filters Section */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, mb: { xs: 2, md: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Filters</Typography>
                {isMobile && (
                  <IconButton onClick={() => setShowFilters(!showFilters)}>
                    <FilterListIcon />
                  </IconButton>
                )}
              </Box>

              {(showFilters || !isMobile) && (
                <>
                  {/* Search */}
                  <form onSubmit={handleSearch}>
                    <TextField
                      fullWidth
                      label="Search Products"
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      sx={{ mb: 3 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton type="submit" edge="end">
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </form>

                  {/* Category Filter */}
                  <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      label="Category"
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Price Range Filter */}
                  <Typography variant="subtitle1" gutterBottom>
                    Price Range
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={priceRange}
                      onChange={handlePriceChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={2000}
                      step={50}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2">${priceRange[0]}</Typography>
                      <Typography variant="body2">${priceRange[1]}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Sort Options */}
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={handleSortChange}
                      label="Sort By"
                    >
                      <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                      <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                      <MenuItem value="price_asc">Price (Low to High)</MenuItem>
                      <MenuItem value="price_desc">Price (High to Low)</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Clear Filters Button */}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={clearFilters}
                    fullWidth
                  >
                    Clear Filters
                  </Button>
                </>
              )}
            </Paper>
          </Grid>

          {/* Products Grid */}
          <Grid item xs={12} md={9}>
            {/* Active Filters */}
            {(selectedCategory || searchQuery || priceRange[0] > 0 || priceRange[1] < 2000) && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Active Filters:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {categoryName && (
                    <Chip 
                      label={`Category: ${categoryName}`} 
                      onDelete={() => {
                        setSelectedCategory('');
                        setCategoryName('');
                        navigate('/products');
                      }} 
                    />
                  )}
                  {searchQuery && (
                    <Chip 
                      label={`Search: ${searchQuery}`} 
                      onDelete={() => {
                        setSearchQuery('');
                        navigate('/products');
                      }} 
                    />
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                    <Chip 
                      label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                      onDelete={() => setPriceRange([0, 2000])} 
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Products count and pagination info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="subtitle1">
                {products.length} products found
              </Typography>
              {totalPages > 1 && (
                <Typography variant="body2" color="text.secondary">
                  Page {currentPage} of {totalPages}
                </Typography>
              )}
            </Box>

            {/* Products Grid */}
            {error ? (
              <Card sx={{ p: 2, bgcolor: '#f8d7da' }}>
                <CardContent>
                  <Typography color="error">
                    {error}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2 }}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : currentProducts.length > 0 ? (
              <Grid container spacing={3}>
                {currentProducts.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={4} lg={4}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Try adjusting your search or filter criteria
                  </Typography>
                  <Button variant="contained" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={paginate} 
                  color="primary" 
                  showFirstButton 
                  showLastButton
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProductsPage;
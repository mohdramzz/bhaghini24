import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Card,
  CardMedia
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ShopContext } from '../contexts/ShopContext';
import { productApi } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { myShop, updateProduct, loading, error } = useContext(ShopContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    featured: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setInitialLoading(true);
        const product = await productApi.getProductById(id);
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price ? product.price.toString() : '',
          stockQuantity: product.stockQuantity ? product.stockQuantity.toString() : '',
          imageUrl: product.imageUrl || '',
          featured: product.featured || false
        });
        
        if (product.imageUrl) {
          setPreviewUrl(product.imageUrl);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (myShop === null && !loading) {
      navigate('/shop-management');
    }
  }, [myShop, loading, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      

      setUploadStatus('');
      
 
      if (formErrors.imageUrl) {
        setFormErrors(prev => ({ ...prev, imageUrl: '' }));
      }
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Product name cannot exceed 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Price must be a valid positive number';
    }
    
    if (!formData.stockQuantity) {
      errors.stockQuantity = 'Stock quantity is required';
    } else if (isNaN(formData.stockQuantity) || parseInt(formData.stockQuantity) < 0) {
      errors.stockQuantity = 'Stock quantity must be a valid non-negative number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const uploadImage = async () => {
    if (!selectedFile) return null;
    
    try {
      setUploadStatus('uploading');
      const result = await productApi.uploadImage(selectedFile);
      setUploadStatus('success');
      return result.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      setUploadStatus('error');
      setFormErrors(prev => ({
        ...prev,
        imageUrl: 'Failed to upload image. Please try again.'
      }));
      return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {

      let imageUrl = formData.imageUrl;
      
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (uploadStatus === 'error') {

          setSubmitting(false);
          return;
        }
      }
      

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl
      };
      
      await updateProduct(id, productData);
      navigate('/shop-management');
    } catch (err) {
      console.error('Error updating product:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading || initialLoading) {
    return <LoadingSpinner message="Loading..." />;
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Edit Product
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={formData.price}
                onChange={handleChange}
                error={!!formErrors.price}
                helperText={formErrors.price}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                inputProps={{ min: 0, step: 1 }}
                value={formData.stockQuantity}
                onChange={handleChange}
                error={!!formErrors.stockQuantity}
                helperText={formErrors.stockQuantity}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Product Image
              </Typography>
              
              {previewUrl && (
                <Card sx={{ maxWidth: 300, mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={previewUrl}
                    alt="Product preview"
                  />
                </Card>
              )}
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { sm: 'center' },
                  mb: 2
                }}
              >
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
                >
                  {previewUrl ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                
                {selectedFile && (
                  <Typography variant="body2">
                    {selectedFile.name}
                  </Typography>
                )}
              </Box>
              
              {uploadStatus === 'uploading' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Uploading image...
                </Alert>
              )}
              
              {uploadStatus === 'error' && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formErrors.imageUrl || 'Failed to upload image. Please try again.'}
                </Alert>
              )}
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  {selectedFile ? 'Image selected for upload' : 'Or enter image URL:'}
                </Typography>
                
                {!selectedFile && (
                  <TextField
                    fullWidth
                    label="Image URL"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/product-image.jpg"
                    margin="normal"
                  />
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                }
                label="Feature this product"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/shop-management')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || uploadStatus === 'uploading'}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? 'Updating...' : 'Update Product'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProductPage;
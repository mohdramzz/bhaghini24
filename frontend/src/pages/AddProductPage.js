import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CardMedia,
  IconButton,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { ShopContext } from '../contexts/ShopContext';
import { productApi } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { myShop, addProduct, loading, error } = useContext(ShopContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    additionalImages: [],
    featured: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Image upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  
  // Redirect if user doesn't have a shop
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
  
  const handleAdditionalFilesChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAdditionalFiles(prev => [...prev, ...newFiles]);
      
      // Create preview URLs for additional images
      const newPreviews = [];
      newFiles.forEach(file => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          newPreviews.push(fileReader.result);
          if (newPreviews.length === newFiles.length) {
            setAdditionalPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        fileReader.readAsDataURL(file);
      });
    }
  };
  
  const removeAdditionalImage = (index) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
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
  
  const uploadAdditionalImages = async () => {
    if (!additionalFiles.length) return [];
    
    try {
      setUploadStatus('uploading');
      
      const uploadedUrls = [];
      for (const file of additionalFiles) {
        const result = await productApi.uploadImage(file);
        uploadedUrls.push(result.url);
      }
      
      setUploadStatus('success');
      return uploadedUrls;
    } catch (err) {
      console.error('Error uploading additional images:', err);
      setUploadStatus('error');
      setFormErrors(prev => ({
        ...prev,
        additionalImages: 'Failed to upload some images. Please try again.'
      }));
      return [];
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

      let additionalImageUrls = [];
      if (additionalFiles.length > 0) {
        additionalImageUrls = await uploadAdditionalImages();
        if (uploadStatus === 'error') {
          setSubmitting(false);
          return;
        }
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl,
        additionalImages: additionalImageUrls
      };
      
      await addProduct(productData);
      navigate('/shop-management');
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Add New Product
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
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Main Product Image
              </Typography>
              
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
                  Choose Main Image
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
              
              {/* Additional Images Section */}
              <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
                Additional Product Images
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Add More Images
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    multiple
                    onChange={handleAdditionalFilesChange}
                  />
                </Button>
                
                {additionalPreviews.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Additional Images ({additionalPreviews.length}):
                    </Typography>
                    <Grid container spacing={2}>
                      {additionalPreviews.map((preview, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Card sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="120"
                              image={preview}
                              alt={`Additional image ${index + 1}`}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                bgcolor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                              }}
                              onClick={() => removeAdditionalImage(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
            
            {uploadStatus === 'uploading' && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Uploading images...
                </Alert>
              </Grid>
            )}
            
            {uploadStatus === 'error' && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formErrors.imageUrl || formErrors.additionalImages || 'Failed to upload images. Please try again.'}
                </Alert>
              </Grid>
            )}
            
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
                  {submitting ? 'Adding...' : 'Add Product'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddProductPage;
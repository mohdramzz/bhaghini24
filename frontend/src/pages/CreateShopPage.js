
import React, { useState, useContext } from 'react';
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
  Input,
  FormHelperText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ShopContext } from '../contexts/ShopContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CreateShopPage = () => {
  const navigate = useNavigate();
  const { createShop, loading, error } = useContext(ShopContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    logoUrl: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);

      setUploadStatus('');
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Shop name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Shop name cannot exceed 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.length > 200) {
      errors.address = 'Address cannot exceed 200 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const uploadImage = async () => {
    if (!selectedFile) return null;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', 'shop'); 
    
    try {
      setUploadStatus('uploading');
      
      const response = await fetch('http://localhost:8081/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      
      const data = await response.json();
      setUploadStatus('success');
      return data.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      setUploadStatus('error');
      setFormErrors(prev => ({
        ...prev,
        logoUrl: 'Failed to upload image. Please try again.'
      }));
      return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      let logoUrl = formData.logoUrl;
      
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        } else if (uploadStatus === 'error') {

          return;
        }
      }
      

      await createShop({
        ...formData,
        logoUrl
      });
      
      navigate('/shop-management');
    } catch (err) {
      console.error('Error creating shop:', err);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Creating your shop..." />;
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Your Shop
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
                label="Shop Name"
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
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Shop Logo
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mr: 2 }}
                >
                  Choose File
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    sx={{ display: 'none' }}
                    inputProps={{ accept: 'image/*' }}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2" component="span">
                    {selectedFile.name}
                  </Typography>
                )}
                {uploadStatus === 'uploading' && (
                  <Typography variant="body2" color="primary">
                    Uploading...
                  </Typography>
                )}
                {uploadStatus === 'success' && (
                  <Typography variant="body2" color="success.main">
                    Upload successful!
                  </Typography>
                )}
                {uploadStatus === 'error' && (
                  <Typography variant="body2" color="error">
                    Upload failed.
                  </Typography>
                )}
              </Box>
              <TextField
                fullWidth
                label="Or enter Logo URL manually"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                error={!!formErrors.logoUrl}
                helperText={formErrors.logoUrl}
              />
              <FormHelperText>
                You can either upload an image or provide a URL to an existing image
              </FormHelperText>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ minWidth: 200 }}
                >
                  Create Shop
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateShopPage;
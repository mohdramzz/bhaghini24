import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material';
import { ShopContext } from '../contexts/ShopContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditShopPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { myShop, updateShop, loading, error } = useContext(ShopContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    logoUrl: '',
    logoFile: null,
    logoPreview: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (myShop) {
      setFormData({
        name: myShop.name || '',
        description: myShop.description || '',
        address: myShop.address || '',
        logoUrl: myShop.logoUrl || '',
        logoFile: null,
        logoPreview: null
      });
    }
  }, [myShop]);
  
  // Redirect if not owner of this shop
  useEffect(() => {
    if (myShop && myShop.id.toString() !== id) {
      navigate('/shop-management');
    }
  }, [myShop, id, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setFormData(prev => ({ 
          ...prev, 
          logoFile: file,
          logoPreview: e.target.result,
          logoUrl: prev.logoUrl || 'pending-upload' 
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ 
      ...prev, 
      logoFile: null,
      logoPreview: null,
      logoUrl: '' 
    }));
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {

      const shopData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        logoUrl: formData.logoUrl
      };
      

      if (formData.logoFile) {
        const formDataObj = new FormData();
        formDataObj.append('file', formData.logoFile);
        

        const uploadResponse = await updateShop.uploadLogo(id, formDataObj);
        shopData.logoUrl = uploadResponse.logoUrl;
      }
      

      await updateShop(id, shopData);
      navigate('/shop-management');
    } catch (err) {
      console.error('Error updating shop:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading shop data..." />;
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Edit Shop Profile
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
              <Typography variant="subtitle1" gutterBottom>
                Shop Logo
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(formData.logoUrl || formData.logoPreview) && (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <img 
                      src={formData.logoPreview || formData.logoUrl} 
                      alt="Shop Logo" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        objectFit: 'contain',
                        border: '1px solid #eee',
                        borderRadius: '4px',
                        padding: '8px'
                      }} 
                    />
                  </Box>
                )}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="logo-upload"
                  type="file"
                  onChange={handleLogoChange}
                />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <label htmlFor="logo-upload">
                    <Button variant="outlined" component="span">
                      {formData.logoUrl || formData.logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                  </label>
                  {(formData.logoUrl || formData.logoPreview) && (
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={handleRemoveLogo}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>
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
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditShopPage;
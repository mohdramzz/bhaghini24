import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import PageHero from '../components/common/PageHero';
import ProtectedRoute from '../components/common/ProtectedRoute';

const ProfilePage = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        email: currentUser?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    setIsEditing(!isEditing);
    setSuccess(false);
    setError(null);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    setTimeout(() => {
      setSuccess(true);
      setIsEditing(false);
      setLoading(false);
    }, 1500);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      setLoading(false);
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      setSuccess(true);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <ProtectedRoute>
      <PageHero
        title="My Account"
        description="Manage your profile and preferences"
        imageUrl="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        height={250}
      />
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* User Info Summary Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main' }}
                >
                  {currentUser?.firstName?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {currentUser?.firstName} {currentUser?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {currentUser?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since: January 2023
                </Typography>
                
                <Divider sx={{ my: 2, width: '100%' }} />
                
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLogout}
                  fullWidth
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Profile Management Tabs */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ width: '100%' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Profile Information" />
                <Tab label="Security" />
                <Tab label="Preferences" />
              </Tabs>
              
              <Box sx={{ p: 3 }}>
                {/* Profile Information Tab */}
                {activeTab === 0 && (
                  <Box>
                    {success && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Profile updated successfully!
                      </Alert>
                    )}
                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Personal Details</Typography>
                      <Button
                        startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                        onClick={handleEditToggle}
                      >
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                    </Box>
                    
                    <Grid container spacing={2} component="form" onSubmit={handleProfileUpdate}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                      
                      {isEditing && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                              disabled={loading}
                            >
                              Save Changes
                            </Button>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
                
                {/* Security Tab */}
                {activeTab === 1 && (
                  <Box>
                    {success && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Password updated successfully!
                      </Alert>
                    )}
                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    )}
                    
                    <Typography variant="h6" gutterBottom>
                      Change Password
                    </Typography>
                    
                    <Grid container spacing={2} component="form" onSubmit={handlePasswordUpdate}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="New Password"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={loading}
                          >
                            Update Password
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Preferences Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Communication Preferences
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Manage your email preferences and notifications.
                    </Typography>
                    
                    {/* Placeholder content - in a real app this would have notification settings */}
                    <Alert severity="info">
                      Notification preferences are not available in this demo.
                    </Alert>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ProtectedRoute>
  );
};

export default ProfilePage;
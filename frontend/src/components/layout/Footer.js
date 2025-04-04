import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  styled
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  Phone, 
  Email, 
  LocationOn 
} from '@mui/icons-material';

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#000000',
  color: '#fff',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4),
  marginTop: 'auto',
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  color: '#D4AF37',
  fontWeight: 500,
  letterSpacing: '1.5px',
  marginBottom: theme.spacing(2),
  fontFamily: '"Montserrat", sans-serif',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#fff',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#D4AF37',
  },
}));

const FooterText = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: '#D4AF37',
  marginRight: theme.spacing(1),
  border: '1px solid rgba(212, 175, 55, 0.3)',
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: '#D4AF37',
  },
}));

const ContactIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: '#D4AF37',
  display: 'flex',
  alignItems: 'center',
}));

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <FooterTitle variant="h6" gutterBottom>
              BHAGHINI
            </FooterTitle>
            <FooterText variant="body2" paragraph>
              Discover luxury and style with Bhaghini. We curate premium products that 
              reflect elegance and sophistication, bringing you the finest selection of fashion and lifestyle items.
            </FooterText>
            <Box>
              <SocialIconButton aria-label="facebook">
                <Facebook fontSize="small" />
              </SocialIconButton>
              <SocialIconButton aria-label="twitter">
                <Twitter fontSize="small" />
              </SocialIconButton>
              <SocialIconButton aria-label="instagram">
                <Instagram fontSize="small" />
              </SocialIconButton>
              <SocialIconButton aria-label="linkedin">
                <LinkedIn fontSize="small" />
              </SocialIconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <FooterTitle variant="h6" gutterBottom>
              EXPLORE
            </FooterTitle>
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText 
                  primary={
                    <FooterLink to="/">Home</FooterLink>
                  }
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={
                    <FooterLink to="/products">Products</FooterLink>
                  }
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={
                    <FooterLink to="/cart">Shopping Cart</FooterLink>
                  }
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={
                    <FooterLink to="/login">My Account</FooterLink>
                  }
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary={
                    <FooterLink to="/orders">Track Orders</FooterLink>
                  }
                />
              </ListItem>
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <FooterTitle variant="h6" gutterBottom>
              CONTACT US
            </FooterTitle>
            <List dense disablePadding>
              <ListItem disableGutters sx={{ mb: 1 }}>
                <ContactIcon>
                  <LocationOn fontSize="small" />
                </ContactIcon>
                <FooterText variant="body2">
                  123 Fashion Avenue, Style District, 12345
                </FooterText>
              </ListItem>
              <ListItem disableGutters sx={{ mb: 1 }}>
                <ContactIcon>
                  <Phone fontSize="small" />
                </ContactIcon>
                <FooterText variant="body2">
                  +1 (555) 123-4567
                </FooterText>
              </ListItem>
              <ListItem disableGutters>
                <ContactIcon>
                  <Email fontSize="small" />
                </ContactIcon>
                <FooterText variant="body2">
                  contact@bhaghini.com
                </FooterText>
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: 'rgba(212, 175, 55, 0.2)' }} />

        <Box textAlign="center">
          <FooterText variant="body2">
            &copy; {new Date().getFullYear()} Bhaghini. All rights reserved.
          </FooterText>
          <Box mt={1}>
            <FooterLink to="/privacy" style={{ marginRight: 16 }}>
              Privacy Policy
            </FooterLink>
            <FooterLink to="/terms" style={{ marginRight: 16 }}>
              Terms of Service
            </FooterLink>
            <FooterLink to="/faq">
              FAQ
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
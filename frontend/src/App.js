
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './AppRoutes';
import ScrollToTop from './components/common/ScrollToTop';
import { ShopProvider } from './contexts/ShopContext';

// Create a theme instance with Bhaghini black and gold theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#D4AF37', // Gold accent color
      light: '#E9D083',
      dark: '#B38F23',
      contrastText: '#000',
    },
    secondary: {
      main: '#000000', // Black main color
      light: '#333333',
      dark: '#000000',
      contrastText: '#fff',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      dark: '#000000',
    },
    text: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.7)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      letterSpacing: '1px',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '1px',
    },
    h3: {
      fontWeight: 500,
      letterSpacing: '1px',
    },
    h4: {
      fontWeight: 500,
      letterSpacing: '0.5px',
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
        containedPrimary: {
          backgroundColor: '#D4AF37',
          color: '#000',
          '&:hover': {
            backgroundColor: '#B38F23',
          },
        },
        outlinedPrimary: {
          borderColor: '#D4AF37',
          color: '#D4AF37',
          '&:hover': {
            borderColor: '#B38F23',
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#D4AF37',
          color: '#000',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <CartProvider>
            <ShopProvider>
              <ScrollToTop />
              <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ flexGrow: 1 }}>
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </ShopProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  InputBase, 
  Menu, 
  MenuItem, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  alpha,
  styled 
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ShoppingCart, 
  Search as SearchIcon, 
  AccountCircle, 
  Category as CategoryIcon 
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import { categoryApi } from '../../services/api';
import BhaghiniLogo from '../../assets/logo.svg';

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid rgba(212, 175, 55, 0.3)',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#D4AF37',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#000000',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#D4AF37',
  marginRight: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    color: '#FFD700',
  },
  textTransform: 'none',
  letterSpacing: '1px',
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: '#D4AF37',
  '&:hover': {
    color: '#FFD700',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 500,
  letterSpacing: '1.5px',
  color: '#D4AF37',
  textDecoration: 'none',
  fontSize: '1.5rem',
}));

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryMenuOpen = (event) => {
    setCategoryMenuAnchor(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchor(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };


  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', bgcolor: '#000', color: '#fff', height: '100%' }}>
      <Box sx={{ py: 2, borderBottom: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', justifyContent: 'center' }}>
        <img src={BhaghiniLogo} alt="Bhaghini" height="40" />
      </Box>
      <List>
        <ListItem button component={Link} to="/" sx={{ color: '#D4AF37' }}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={(e) => {
          e.stopPropagation();
          handleCategoryMenuOpen(e);
        }} sx={{ color: '#D4AF37' }}>
          <ListItemText primary="Categories" />
        </ListItem>
        <ListItem button component={Link} to="/products" sx={{ color: '#D4AF37' }}>
          <ListItemText primary="All Products" />
        </ListItem>
        <ListItem button component={Link} to="/shops" sx={{ color: '#D4AF37' }}>
          <ListItemText primary="Shops" />
        </ListItem>
        <ListItem button component={Link} to="/cart" sx={{ color: '#D4AF37' }}>
          <ListItemText primary={`Cart (${totalItems})`} />
        </ListItem>
        {currentUser ? (
          <>
            <ListItem button component={Link} to="/profile" sx={{ color: '#D4AF37' }}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button component={Link} to="/orders" sx={{ color: '#D4AF37' }}>
              <ListItemText primary="My Orders" />
            </ListItem>
            <ListItem button onClick={handleLogout} sx={{ color: '#D4AF37' }}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login" sx={{ color: '#D4AF37' }}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/signup" sx={{ color: '#D4AF37' }}>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );


  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      keepMounted
      PaperProps={{
        sx: {
          bgcolor: '#000',
          color: '#fff',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }
      }}
    >
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={{ color: '#D4AF37' }}>
        Profile
      </MenuItem>
      <MenuItem component={Link} to="/orders" onClick={handleMenuClose} sx={{ color: '#D4AF37' }}>
        My Orders
      </MenuItem>
      <MenuItem component={Link} to="/shop-management" onClick={handleMenuClose} sx={{ color: '#D4AF37' }}>
        Shop Management
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={{ color: '#D4AF37' }}>Logout</MenuItem>
    </Menu>
  );


  const categoriesMenu = (
    <Menu
      anchorEl={categoryMenuAnchor}
      open={Boolean(categoryMenuAnchor)}
      onClose={handleCategoryMenuClose}
      keepMounted
      PaperProps={{
        sx: {
          bgcolor: '#000',
          color: '#fff',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }
      }}
    >
      {categories.map((category) => (
        <MenuItem 
          key={category.id} 
          component={Link} 
          to={`/category/${category.id}`}
          onClick={handleCategoryMenuClose}
          sx={{ color: '#D4AF37' }}
        >
          {category.name}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          {/* Mobile menu button */}
          <IconButtonStyled
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButtonStyled>
          
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            <img src={BhaghiniLogo} alt="Bhaghini" height="40" />
          </Box>
          

          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <NavButton component={Link} to="/">
              Home
            </NavButton>
            <NavButton 
              aria-controls="categories-menu"
              aria-haspopup="true"
              onClick={handleCategoryMenuOpen}
              endIcon={<CategoryIcon />}
            >
              Categories
            </NavButton>
            <NavButton component={Link} to="/products">
              All Products
            </NavButton>
            <NavButton component={Link} to="/shops">
              Shops
            </NavButton>
          </Box>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <SearchBox>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>
          </form>
          
          {/* User Actions */}
          <Box sx={{ display: 'flex' }}>
            {/* Cart button */}
            <IconButtonStyled component={Link} to="/cart">
              <Badge badgeContent={totalItems} color="error" sx={{ '& .MuiBadge-badge': { bgcolor: '#D4AF37', color: '#000' } }}>
                <ShoppingCart />
              </Badge>
            </IconButtonStyled>
            
            {/* User account */}
            {currentUser ? (
              <IconButtonStyled
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircle />
              </IconButtonStyled>
            ) : (
              <NavButton component={Link} to="/login">
                Login
              </NavButton>
            )}
          </Box>
        </StyledToolbar>
      </StyledAppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Menus */}
      {profileMenu}
      {categoriesMenu}
    </>
  );
};

export default Header;
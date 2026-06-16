import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { authService } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Render navigation links only if authenticated
  if (!authService.isAuthenticated()) return null;

  return (
    <AppBar 
      position="sticky" 
      sx={{
        background: 'rgba(20, 24, 46, 0.7)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'none',
        top: 0,
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        {/* Brand/Logo */}
        <Box 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <LockPersonIcon sx={{ color: '#ab47bc', mr: 1.5, fontSize: 28 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.5px',
              background: 'linear-gradient(45deg, #ab47bc 30%, #29b6f6 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            SafeVault
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center' }}>
          <Button
            onClick={() => navigate('/')}
            startIcon={<DashboardIcon />}
            sx={{
              fontFamily: 'Inter, sans-serif',
              color: isActive('/') ? '#29b6f6' : '#a0aec0',
              fontWeight: isActive('/') ? 600 : 400,
              backgroundColor: isActive('/') ? 'rgba(41, 182, 246, 0.08)' : 'transparent',
              textTransform: 'none',
              px: { xs: 1.5, sm: 2.5 },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#29b6f6'
              }
            }}
          >
            {!isMobile && 'Dashboard'}
          </Button>

          <Button
            onClick={() => navigate('/add')}
            startIcon={<AddBoxIcon />}
            sx={{
              fontFamily: 'Inter, sans-serif',
              color: isActive('/add') ? '#ab47bc' : '#a0aec0',
              fontWeight: isActive('/add') ? 600 : 400,
              backgroundColor: isActive('/add') ? 'rgba(171, 71, 188, 0.08)' : 'transparent',
              textTransform: 'none',
              px: { xs: 1.5, sm: 2.5 },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ab47bc'
              }
            }}
          >
            {!isMobile && 'Add Password'}
          </Button>

          <Button
            onClick={() => navigate('/logs')}
            startIcon={<ListAltIcon />}
            sx={{
              fontFamily: 'Inter, sans-serif',
              color: isActive('/logs') ? '#ffb74d' : '#a0aec0',
              fontWeight: isActive('/logs') ? 600 : 400,
              backgroundColor: isActive('/logs') ? 'rgba(255, 183, 77, 0.08)' : 'transparent',
              textTransform: 'none',
              px: { xs: 1.5, sm: 2.5 },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffb74d'
              }
            }}
          >
            {!isMobile && 'Audit Logs'}
          </Button>

          <IconButton 
            onClick={handleLogout}
            title="Log Out"
            sx={{ 
              color: '#ef5350',
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(239, 83, 80, 0.08)'
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

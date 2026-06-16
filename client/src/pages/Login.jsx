import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Paper, Typography, TextField, Button, Alert, Link, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { authService } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !masterPassword) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await authService.login(email, masterPassword);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative',
        py: 6
      }}
    >
      {/* Visual background glowing orbs */}
      <div className="glow-orb glow-purple" />
      <div className="glow-orb glow-blue" />

      <Container maxWidth="xs">
        <Paper 
          className="glass-panel"
          sx={{ 
            p: 4.5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderColor: 'rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Lock Icon Badge */}
          <Box 
            sx={{ 
              m: 1, 
              backgroundColor: 'rgba(171, 71, 188, 0.12)', 
              borderRadius: '50%', 
              p: 2,
              border: '1px solid rgba(171, 71, 188, 0.25)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3
            }}
          >
            <LockPersonIcon sx={{ color: '#ab47bc', fontSize: 35 }} />
          </Box>

          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              fontFamily: 'Outfit, sans-serif', 
              fontWeight: 800, 
              letterSpacing: '-0.5px',
              mb: 1
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#a0aec0', 
              mb: 4, 
              textAlign: 'center',
              fontFamily: 'Inter'
            }}
          >
            Access your secure password credentials vault
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: '8px', border: '1px solid rgba(239, 83, 80, 0.2)', backgroundColor: 'rgba(239, 83, 80, 0.05)', color: '#ef5350' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& label': { color: '#718096' },
                '& label.Mui-focused': { color: '#29b6f6' },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#29b6f6' }
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Master Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#718096' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                mb: 4,
                '& label': { color: '#718096' },
                '& label.Mui-focused': { color: '#ab47bc' },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                  '&.Mui-focused fieldset': { borderColor: '#ab47bc' }
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #ab47bc 30%, #29b6f6 90%)',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(171, 71, 188, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(171, 71, 188, 0.5)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Unlock Vault'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2"
                sx={{ 
                  color: '#29b6f6', 
                  textDecoration: 'none',
                  fontFamily: 'Inter',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Don't have a vault account? Register
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Paper, Typography, TextField, Button, Alert, Link, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { authService } from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !masterPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (masterPassword !== confirmPassword) {
      setError('Master passwords do not match');
      return;
    }

    if (masterPassword.length < 8) {
      setError('Master password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      await authService.register(username, email, masterPassword);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Try a different username/email.');
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
          {/* Header Icon */}
          <Box 
            sx={{ 
              m: 1, 
              backgroundColor: 'rgba(41, 182, 246, 0.12)', 
              borderRadius: '50%', 
              p: 2,
              border: '1px solid rgba(41, 182, 246, 0.25)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3
            }}
          >
            <AppRegistrationIcon sx={{ color: '#29b6f6', fontSize: 35 }} />
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
            Create Vault
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
            Store, encrypt, and manage credentials with AES-256
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
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              name="masterPassword"
              label="Master Password"
              type={showPassword ? 'text' : 'password'}
              id="masterPassword"
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

            {/* Injected real-time strength feedback */}
            <PasswordStrengthMeter password={masterPassword} />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Master Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Initialize Vault'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/login" 
                variant="body2"
                sx={{ 
                  color: '#29b6f6', 
                  textDecoration: 'none',
                  fontFamily: 'Inter',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Already initialized? Access Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;

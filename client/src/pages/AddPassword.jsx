import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Paper, TextField, Button, 
  Grid, InputAdornment, IconButton, Alert, Snackbar 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import PasswordGenerator from '../components/PasswordGenerator';
import { passwordService } from '../services/api';

const AddPassword = () => {
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleSelectPassword = (generatedPass) => {
    setPassword(generatedPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!websiteName || !loginUsername || !password) {
      setError('Please fill in Website Name, Login Username, and Password');
      return;
    }

    try {
      setLoading(true);
      await passwordService.add(websiteName, websiteUrl, loginUsername, password);
      setSuccessSnackbar(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
      <div className="glow-orb glow-purple" />
      <div className="glow-orb glow-blue" />

      <Container maxWidth="lg">
        {/* Back navigation action */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            color: '#a0aec0',
            textTransform: 'none',
            fontFamily: 'Inter',
            mb: 4,
            '&:hover': {
              color: '#fff',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          Back to Dashboard
        </Button>

        <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 1 }}>
          Add Credentials
        </Typography>
        <Typography variant="body2" sx={{ color: '#a0aec0', fontFamily: 'Inter', mb: 5 }}>
          Create a new entry in your AES-256 encrypted password repository
        </Typography>

        <Grid container spacing={4}>
          {/* Left Panel: Form */}
          <Grid item xs={12} md={7}>
            <Paper 
              className="glass-panel"
              sx={{ 
                p: 4.5,
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#fff', mb: 3.5 }}>
                Credential Details
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3.5, borderRadius: '8px', border: '1px solid rgba(239, 83, 80, 0.2)', backgroundColor: 'rgba(239, 83, 80, 0.05)', color: '#ef5350' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Website Name"
                      placeholder="e.g., Google"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website URL"
                      placeholder="e.g., https://google.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
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
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Login Username / Email"
                      placeholder="Enter username or email address"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
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
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password or use generator"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    
                    {/* Live Strength Meter Under Form Input */}
                    <PasswordStrengthMeter password={password} />
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={<SaveIcon />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          background: 'linear-gradient(45deg, #ab47bc 30%, #29b6f6 90%)',
                          color: '#fff',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 15px rgba(171, 71, 188, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(171, 71, 188, 0.5)'
                          }
                        }}
                      >
                        {loading ? 'Saving...' : 'Save Credentials'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                          color: '#a0aec0',
                          textTransform: 'none',
                          borderRadius: '8px',
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: '#fff',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Right Panel: Generator */}
          <Grid item xs={12} md={5}>
            <PasswordGenerator onSelectPassword={handleSelectPassword} />
          </Grid>
        </Grid>
      </Container>

      {/* Success Notification */}
      <Snackbar
        open={successSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            borderRadius: '8px',
            fontFamily: 'Inter',
            border: '1px solid rgba(102, 187, 106, 0.2)',
            backgroundColor: '#1b5e20',
            color: '#fff'
          }}
        >
          Credentials saved successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddPassword;

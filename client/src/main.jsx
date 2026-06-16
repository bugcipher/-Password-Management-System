import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

// Create custom Material UI Dark Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ab47bc', // Elegant Purple
      light: '#df78ef',
      dark: '#790e8b'
    },
    secondary: {
      main: '#29b6f6', // Bright Neon Blue
      light: '#73e8ff',
      dark: '#0086c3'
    },
    background: {
      default: '#0d0f1e', // Custom space navy default
      paper: '#14182e'   // Custom glass card color
    },
    text: {
      primary: '#f5f6fa',
      secondary: '#a0aec0'
    },
    error: {
      main: '#ef5350'
    },
    success: {
      main: '#66bb6a'
    },
    warning: {
      main: '#ffb74d'
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h4: {
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 700
    },
    h5: {
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 600
    },
    h6: {
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 600
    },
    subtitle1: {
      fontFamily: 'Outfit, sans-serif'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontFamily: 'Inter, sans-serif',
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none' // Remove default MUI overlay gradient
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px'
          }
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

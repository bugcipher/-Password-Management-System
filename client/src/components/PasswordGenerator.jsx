import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Slider, FormControlLabel, Checkbox, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckIcon from '@mui/icons-material/Check';

const PasswordGenerator = ({ onSelectPassword }) => {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charPool = '';
    if (uppercase) charPool += upperChars;
    if (lowercase) charPool += lowerChars;
    if (numbers) charPool += numberChars;
    if (symbols) charPool += symbolChars;

    if (!charPool) {
      setGeneratedPassword('Please select at least one character type');
      return;
    }

    let password = '';
    // Ensure at least one of each selected type is included
    const activeTypes = [];
    if (uppercase) activeTypes.push(() => upperChars[Math.floor(Math.random() * upperChars.length)]);
    if (lowercase) activeTypes.push(() => lowerChars[Math.floor(Math.random() * lowerChars.length)]);
    if (numbers) activeTypes.push(() => numberChars[Math.floor(Math.random() * numberChars.length)]);
    if (symbols) activeTypes.push(() => symbolChars[Math.floor(Math.random() * symbolChars.length)]);

    // Generate remaining length randomly
    for (let i = 0; i < length; i++) {
      if (i < activeTypes.length) {
        password += activeTypes[i]();
      } else {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        password += charPool[randomIndex];
      }
    }

    // Shuffle characters
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    setGeneratedPassword(password);
    setCopied(false);
  };

  // Generate a password on component load
  useEffect(() => {
    generatePassword();
  }, [length, uppercase, lowercase, numbers, symbols]);

  const handleCopy = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)' }}>
      <Typography variant="subtitle1" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: '#ab47bc', mb: 2 }}>
        Secure Password Generator
      </Typography>

      {/* Generated Output Display */}
      <TextField
        fullWidth
        value={generatedPassword}
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={copied ? "Copied!" : "Copy to Clipboard"}>
                  <IconButton onClick={handleCopy} edge="end" sx={{ color: copied ? '#66bb6a' : '#29b6f6' }}>
                    {copied ? <CheckIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            sx: {
              fontFamily: 'monospace',
              fontSize: '1rem',
              letterSpacing: '1px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }
          }
        }}
      />

      {/* Slider for Password Length */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', color: '#a0aec0', fontFamily: 'Inter', mb: 1 }}>
          <span>Password Length:</span>
          <strong style={{ color: '#fff' }}>{length} characters</strong>
        </Typography>
        <Slider
          value={length}
          onChange={(e, val) => setLength(val)}
          min={8}
          max={32}
          step={1}
          sx={{
            color: '#ab47bc',
            '& .MuiSlider-thumb': {
              border: '2px solid currentColor'
            }
          }}
        />
      </Box>

      {/* Filter Checkboxes */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', mb: 3 }}>
        <FormControlLabel
          control={<Checkbox checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#ab47bc' } }} />}
          label={<span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>Uppercase (A-Z)</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#ab47bc' } }} />}
          label={<span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>Lowercase (a-z)</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={numbers} onChange={(e) => setNumbers(e.target.checked)} sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#ab47bc' } }} />}
          label={<span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>Numbers (0-9)</span>}
        />
        <FormControlLabel
          control={<Checkbox checked={symbols} onChange={(e) => setSymbols(e.target.checked)} sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#ab47bc' } }} />}
          label={<span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>Symbols (!@#$)</span>}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AutorenewIcon />}
          onClick={generatePassword}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.15)',
            color: '#fff',
            textTransform: 'none',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          Regenerate
        </Button>
        {onSelectPassword && (
          <Button
            fullWidth
            variant="contained"
            onClick={() => onSelectPassword(generatedPassword)}
            sx={{
              background: 'linear-gradient(45deg, #ab47bc 30%, #29b6f6 90%)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(171, 71, 188, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(171, 71, 188, 0.5)'
              }
            }}
          >
            Use Password
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PasswordGenerator;

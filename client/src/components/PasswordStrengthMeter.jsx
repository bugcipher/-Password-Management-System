import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Visual strength evaluator for passwords
 */
const PasswordStrengthMeter = ({ password }) => {
  const evaluatePassword = (pwd) => {
    if (!pwd) return { score: 0, label: 'No Password Entered', color: '#718096' };
    
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1; // Extra point for long password
    
    // Character type checks
    if (/[A-Z]/.test(pwd)) score += 1; // Has uppercase
    if (/[0-9]/.test(pwd)) score += 1; // Has numbers
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1; // Has special characters

    // Bound score to 5 max, 1 min for non-empty password
    score = Math.max(1, Math.min(score, 5));

    switch (score) {
      case 1:
        return { score, label: 'Weak', color: '#ef5350', feedback: 'Add numbers, symbols, and uppercase letters.' };
      case 2:
        return { score, label: 'Fair', color: '#ff9800', feedback: 'Include special symbols & make it longer.' };
      case 3:
        return { score, label: 'Good', color: '#ffca28', feedback: 'Getting secure. Add symbols or make it longer.' };
      case 4:
        return { score, label: 'Strong', color: '#66bb6a', feedback: 'Highly secure. Excellent combination.' };
      case 5:
        return { score, label: 'Very Strong', color: '#2e7d32', feedback: 'Bulletproof password!' };
      default:
        return { score: 0, label: 'Empty', color: '#718096', feedback: '' };
    }
  };

  const { score, label, color, feedback } = evaluatePassword(password);

  return (
    <Box sx={{ mt: 1.5, width: '100%' }}>
      {/* Label and score indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
        <Typography variant="caption" sx={{ color: '#a0aec0', fontFamily: 'Inter' }}>
          Password Strength:
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: color, 
            fontWeight: 700, 
            fontFamily: 'Inter',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Styled segments for strength visual */}
      <Box sx={{ display: 'flex', gap: '4px', height: '6px', width: '100%', mb: 1 }}>
        {[1, 2, 3, 4, 5].map((index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              borderRadius: '4px',
              backgroundColor: index <= score ? color : 'rgba(255, 255, 255, 0.08)',
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </Box>

      {/* Suggestion / Tip feedback */}
      {feedback && (
        <Typography variant="caption" sx={{ color: '#718096', display: 'block', fontStyle: 'italic', lineHeight: 1.2 }}>
          {feedback}
        </Typography>
      )}
    </Box>
  );
};

export default PasswordStrengthMeter;

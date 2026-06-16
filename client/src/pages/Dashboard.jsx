import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Paper, TextField, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, Button, 
  InputAdornment, Tooltip, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, Snackbar, Alert, Grid, Card, CardContent 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CheckIcon from '@mui/icons-material/Check';
import { passwordService } from '../services/api';

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({}); // Stores { password_id: decryptedText }
  const [copiedId, setCopiedId] = useState(null);
  
  // Modal states for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedDeleteWebsite, setSelectedDeleteWebsite] = useState('');

  // Notification states
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  const fetchPasswords = async () => {
    try {
      const data = await passwordService.getAll();
      setPasswords(data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to load password entries', 'error');
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleToggleVisibility = async (id) => {
    if (visiblePasswords[id] !== undefined) {
      // Hide
      const updated = { ...visiblePasswords };
      delete updated[id];
      setVisiblePasswords(updated);
    } else {
      // Show (Decrypt)
      try {
        const data = await passwordService.decrypt(id);
        setVisiblePasswords({
          ...visiblePasswords,
          [id]: data.decrypted_password
        });
      } catch (err) {
        console.error(err);
        showNotification('Failed to decrypt password', 'error');
      }
    }
  };

  const handleCopyPassword = async (id) => {
    try {
      let plainPassword = visiblePasswords[id];
      if (!plainPassword) {
        const data = await passwordService.decrypt(id);
        plainPassword = data.decrypted_password;
      }
      
      navigator.clipboard.writeText(plainPassword);
      setCopiedId(id);
      showNotification('Password copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
      showNotification('Failed to copy password', 'error');
    }
  };

  const openDeleteDialog = (id, website) => {
    setSelectedDeleteId(id);
    setSelectedDeleteWebsite(website);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
    setSelectedDeleteWebsite('');
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;
    try {
      await passwordService.delete(selectedDeleteId);
      showNotification('Credentials deleted successfully');
      // Remove from lists
      setPasswords(passwords.filter(p => p.password_id !== selectedDeleteId));
      if (visiblePasswords[selectedDeleteId]) {
        const updated = { ...visiblePasswords };
        delete updated[selectedDeleteId];
        setVisiblePasswords(updated);
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete password entry', 'error');
    } finally {
      closeDeleteDialog();
    }
  };

  // Filter passwords by website name in search query
  const filteredPasswords = passwords.filter(item => 
    item.website_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format website URL nicely
  const getCleanUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
      <div className="glow-orb glow-purple" />
      <div className="glow-orb glow-blue" />

      <Container maxWidth="lg">
        {/* Upper Header and Stats */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 5 }}>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 1 }}>
              Secure Credentials Vault
            </Typography>
            <Typography variant="body2" sx={{ color: '#a0aec0', fontFamily: 'Inter' }}>
              Manage and access all your encrypted login passwords securely
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add')}
            sx={{
              py: 1.2,
              px: 3,
              background: 'linear-gradient(45deg, #ab47bc 30%, #29b6f6 90%)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: 'Inter',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(171, 71, 188, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(171, 71, 188, 0.5)'
              }
            }}
          >
            Add New Password
          </Button>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'rgba(20, 24, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ backgroundColor: 'rgba(171, 71, 188, 0.1)', p: 1.5, borderRadius: '8px', border: '1px solid rgba(171, 71, 188, 0.2)' }}>
                  <VpnKeyIcon sx={{ color: '#ab47bc' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>{passwords.length}</Typography>
                  <Typography variant="caption" sx={{ color: '#a0aec0' }}>Total Passwords Saved</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search saved passwords by website name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#718096' }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'rgba(20, 24, 46, 0.4)',
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' }
              }
            }
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&.Mui-focused fieldset': { borderColor: '#29b6f6' }
            }
          }}
        />

        {/* Credentials Table */}
        <TableContainer 
          component={Paper} 
          className="glass-panel"
          sx={{ 
            borderColor: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              <TableRow>
                <TableCell sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit' }}>Website</TableCell>
                <TableCell sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit' }}>URL</TableCell>
                <TableCell sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit' }}>Username / Email</TableCell>
                <TableCell sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit' }}>Password</TableCell>
                <TableCell align="right" sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit', pr: 3 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPasswords.length > 0 ? (
                filteredPasswords.map((row) => (
                  <TableRow key={row.password_id} className="tr-hover" sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderColor: 'rgba(255,255,255,0.05)' }}>
                    {/* Website Column */}
                    <TableCell sx={{ color: '#fff', fontFamily: 'Inter', fontWeight: 600 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', color: '#ab47bc', fontWeight: 700, fontSize: '0.9rem' }}>
                          {row.website_name ? row.website_name.substring(0, 2).toUpperCase() : 'W'}
                        </Box>
                        {row.website_name}
                      </Box>
                    </TableCell>

                    {/* Website URL Column */}
                    <TableCell sx={{ color: '#29b6f6', fontFamily: 'Inter' }}>
                      {row.website_url ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <a href={getCleanUrl(row.website_url)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                            {row.website_url}
                          </a>
                          <OpenInNewIcon sx={{ fontSize: 14 }} />
                        </Box>
                      ) : (
                        <span style={{ color: '#718096', fontStyle: 'italic' }}>N/A</span>
                      )}
                    </TableCell>

                    {/* Username Column */}
                    <TableCell sx={{ color: '#fff', fontFamily: 'Inter' }}>
                      {row.login_username}
                    </TableCell>

                    {/* Password Display Column */}
                    <TableCell sx={{ color: '#fff', fontFamily: 'monospace', letterSpacing: visiblePasswords[row.password_id] ? '1px' : '3px' }}>
                      {visiblePasswords[row.password_id] ? visiblePasswords[row.password_id] : '••••••••••••'}
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title={visiblePasswords[row.password_id] ? "Hide Password" : "Show Password"}>
                          <IconButton onClick={() => handleToggleVisibility(row.password_id)} sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }}>
                            {visiblePasswords[row.password_id] ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={copiedId === row.password_id ? "Copied!" : "Copy Password"}>
                          <IconButton onClick={() => handleCopyPassword(row.password_id)} sx={{ color: copiedId === row.password_id ? '#66bb6a' : '#29b6f6', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }}>
                            {copiedId === row.password_id ? <CheckIcon /> : <ContentCopyIcon />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Password">
                          <IconButton onClick={() => openDeleteDialog(row.password_id, row.website_name)} sx={{ color: '#ef5350', '&:hover': { backgroundColor: 'rgba(239, 83, 80, 0.08)' } }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" sx={{ color: '#a0aec0', fontFamily: 'Inter', mb: 2 }}>
                      {searchQuery ? 'No matching passwords found.' : 'No credentials saved in vault.'}
                    </Typography>
                    {!searchQuery && (
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/add')}
                        sx={{
                          borderColor: 'rgba(171, 71, 188, 0.5)',
                          color: '#ab47bc',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#ab47bc',
                            backgroundColor: 'rgba(171, 71, 188, 0.05)'
                          }
                        }}
                      >
                        Add Your First Password
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
          PaperProps={{
            sx: {
              background: 'rgba(20, 24, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              color: '#fff'
            }
          }}
        >
          <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>
            Delete Saved Credentials?
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#a0aec0', fontFamily: 'Inter' }}>
              Are you sure you want to permanently delete the password credentials for <strong>{selectedDeleteWebsite}</strong>? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button onClick={closeDeleteDialog} sx={{ color: '#a0aec0', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ textTransform: 'none', borderRadius: '6px' }}>
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* SnackBar Alerts */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity} 
            sx={{ 
              borderRadius: '8px',
              fontFamily: 'Inter',
              border: notification.severity === 'success' ? '1px solid rgba(102, 187, 106, 0.2)' : '1px solid rgba(239, 83, 80, 0.2)',
              backgroundColor: notification.severity === 'success' ? '#1b5e20' : '#c62828',
              color: '#fff'
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip 
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { passwordService } from '../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await passwordService.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Format date helper
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  // Get stylized action tag
  const getActionChip = (action) => {
    switch (action) {
      case 'REGISTER':
        return (
          <Chip 
            label="User Registered" 
            sx={{ 
              background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', 
              color: '#fff', 
              fontWeight: 600,
              fontSize: '0.75rem'
            }} 
          />
        );
      case 'LOGIN':
        return (
          <Chip 
            label="User Login" 
            sx={{ 
              background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)', 
              color: '#fff', 
              fontWeight: 600,
              fontSize: '0.75rem'
            }} 
          />
        );
      case 'ADD_PASSWORD':
        return (
          <Chip 
            label="Password Added" 
            sx={{ 
              background: 'linear-gradient(45deg, #009688 30%, #00d2fc 90%)', 
              color: '#fff', 
              fontWeight: 600,
              fontSize: '0.75rem'
            }} 
          />
        );
      case 'VIEW_PASSWORD':
        return (
          <Chip 
            label="Password Decrypted" 
            sx={{ 
              background: 'linear-gradient(45deg, #ab47bc 30%, #f48fb1 90%)', 
              color: '#fff', 
              fontWeight: 600,
              fontSize: '0.75rem'
            }} 
          />
        );
      case 'DELETE_PASSWORD':
        return (
          <Chip 
            label="Password Deleted" 
            sx={{ 
              background: 'linear-gradient(45deg, #f44336 30%, #ff7043 90%)', 
              color: '#fff', 
              fontWeight: 600,
              fontSize: '0.75rem'
            }} 
          />
        );
      default:
        return <Chip label={action} sx={{ color: '#fff', fontWeight: 600 }} />;
    }
  };

  return (
    <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
      <div className="glow-orb glow-purple" />
      <div className="glow-orb glow-blue" />

      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ backgroundColor: 'rgba(255, 183, 77, 0.1)', p: 1, borderRadius: '8px', border: '1px solid rgba(255, 183, 77, 0.2)', display: 'flex', alignItems: 'center' }}>
            <HistoryIcon sx={{ color: '#ffb74d', fontSize: 28 }} />
          </Box>
          <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
            Audit Logs
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#a0aec0', fontFamily: 'Inter', mb: 5, pl: 7 }}>
          Track security operations, credentials additions, deletions, and access decryptions
        </Typography>

        {/* Logs Table */}
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
                <TableCell sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit' }}>Log ID</TableCell>
                <TableCell sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit' }}>Timestamp</TableCell>
                <TableCell sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit' }}>Operation Action</TableCell>
                <TableCell sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit' }}>Website Context</TableCell>
                <TableCell sx={{ color: '#a0aec0', fontWeight: 600, fontFamily: 'Outfit' }}>Client IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((row) => (
                  <TableRow key={row.log_id} className="tr-hover" sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderColor: 'rgba(255,255,255,0.05)' }}>
                    {/* Log ID */}
                    <TableCell sx={{ color: '#fff', fontFamily: 'monospace' }}>
                      #{row.log_id}
                    </TableCell>

                    {/* Timestamp */}
                    <TableCell sx={{ color: '#fff', fontFamily: 'Inter' }}>
                      {formatDate(row.timestamp)}
                    </TableCell>

                    {/* Action Chip */}
                    <TableCell>
                      {getActionChip(row.action)}
                    </TableCell>

                    {/* Website Context */}
                    <TableCell sx={{ color: '#fff', fontFamily: 'Inter', fontWeight: row.website_name ? 600 : 400 }}>
                      {row.website_name ? row.website_name : <span style={{ color: '#718096', fontStyle: 'italic' }}>N/A</span>}
                    </TableCell>

                    {/* IP Address */}
                    <TableCell sx={{ color: '#a0aec0', fontFamily: 'monospace' }}>
                      {row.ip_address || '127.0.0.1'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" sx={{ color: '#a0aec0', fontFamily: 'Inter' }}>
                      {loading ? 'Fetching activity records...' : 'No activity records found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default AuditLogs;

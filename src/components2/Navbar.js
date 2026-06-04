// Navbar.js
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Button, Menu, MenuItem, Tooltip, Drawer,
  Accordion, AccordionSummary, AccordionDetails, useMediaQuery
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState('Employee');
  const [mainAnchorEl, setMainAnchorEl] = useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [setupAnchorEl, setSetupAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navButtonStyle = (tabName) => ({
    color: 'white',
    backgroundColor: activeTab === tabName ? 'rgba(39, 37, 37, 0.74)' : 'transparent',
    fontWeight: activeTab === tabName ? 600 : 500,
    textTransform: 'none',
    borderRadius: 2,
    px: 2,
    py: 0.5,
    '&:hover': {
      backgroundColor: 'rgba(39, 37, 37, 0.74)',
    },
  });

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'rgba(39, 37, 37, 0.74)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Typography variant="h6" sx={{ color: 'grey', fontWeight: 'bold' }}>FlowSync</Typography>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button sx={navButtonStyle('Employee')} onClick={() => setActiveTab('Employee')}>
                  Employee
                </Button>

                {/* Main */}
                <Box onMouseEnter={(e) => setMainAnchorEl(e.currentTarget)} onMouseLeave={() => setMainAnchorEl(null)}>
                  <Button sx={navButtonStyle('Main')}>
                    Main
                    <KeyboardArrowDownIcon sx={{ color: 'white' }} />
                  </Button>
                  <Menu
                    anchorEl={mainAnchorEl}
                    open={Boolean(mainAnchorEl)}
                    onClose={() => setMainAnchorEl(null)}
                    MenuListProps={{
                      onMouseEnter: () => setMainAnchorEl(mainAnchorEl),
                      onMouseLeave: () => setMainAnchorEl(null),
                    }}
                    PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.7)', color: 'white' } }}
                  >
                    <MenuItem onClick={() => { setMainAnchorEl(null); navigate('/analytics'); }}>Analytics Hub</MenuItem>
                    <MenuItem onClick={() => { setMainAnchorEl(null); navigate('/organizationchart'); }}>Organization Chart</MenuItem>
                  </Menu>
                </Box>

                {/* Admin */}
                <Box onMouseEnter={(e) => setAdminAnchorEl(e.currentTarget)} onMouseLeave={() => setAdminAnchorEl(null)}>
                  <Button sx={navButtonStyle('Admin')}>
                    Admin
                    <KeyboardArrowDownIcon sx={{ color: 'white' }} />
                  </Button>
                  <Menu
                    anchorEl={adminAnchorEl}
                    open={Boolean(adminAnchorEl)}
                    onClose={() => setAdminAnchorEl(null)}
                    MenuListProps={{
                      onMouseEnter: () => setAdminAnchorEl(adminAnchorEl),
                      onMouseLeave: () => setAdminAnchorEl(null),
                    }}
                    PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.7)', color: 'white' } }}
                  >
                    <MenuItem onClick={() => { setAdminAnchorEl(null); navigate('/letter'); }}>General Letter</MenuItem>
                    <MenuItem onClick={() => { setAdminAnchorEl(null); navigate('/excelimport'); }}>Excel Import</MenuItem>
                    <MenuItem onClick={() => { setAdminAnchorEl(null); navigate('/bulletin'); }}>Bulletin Board</MenuItem>
                    <MenuItem onClick={() => { setAdminAnchorEl(null); navigate('/masscom'); }}>Mass Communication</MenuItem>
                  </Menu>
                </Box>

                {/* Setup */}
                <Box onMouseEnter={(e) => setSetupAnchorEl(e.currentTarget)} onMouseLeave={() => setSetupAnchorEl(null)}>
                  <Button sx={navButtonStyle('Setup')}>
                    Setup
                    <KeyboardArrowDownIcon sx={{ color: 'white' }} />
                  </Button>
                  <Menu
                    anchorEl={setupAnchorEl}
                    open={Boolean(setupAnchorEl)}
                    onClose={() => setSetupAnchorEl(null)}
                    MenuListProps={{
                      onMouseEnter: () => setSetupAnchorEl(setupAnchorEl),
                      onMouseLeave: () => setSetupAnchorEl(null),
                    }}
                    PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.7)', color: 'white' } }}
                  >
                    <MenuItem onClick={() => { setSetupAnchorEl(null); navigate('/company'); }}>Company Policies & Forms</MenuItem>
                  </Menu>
                </Box>
              </Box>
            )}
          </Box>

          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#fff' }}>
              <MenuIcon />
            </IconButton>
          )}

          <Tooltip title="Logout" onClick={() => navigate('/welcome')}>
            <IconButton sx={{ color: 'error.light' }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 250, bgcolor: 'rgba(20, 20, 20, 0.95)', color: '#fff', p: 2 } }}
      >
        <Box>
          <Accordion sx={{ bgcolor: 'transparent', color: '#fff' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              Main
            </AccordionSummary>
            <AccordionDetails>
              <Typography onClick={() => { navigate('/analytics'); setMobileOpen(false); }}>Analytics Hub</Typography>
              <Typography onClick={() => { navigate('/organizationchart'); setMobileOpen(false); }}>Organization Chart</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'transparent', color: '#fff' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              Admin
            </AccordionSummary>
            <AccordionDetails>
              <Typography onClick={() => { navigate('/letter'); setMobileOpen(false); }}>General Letter</Typography>
              <Typography onClick={() => { navigate('/excelimport'); setMobileOpen(false); }}>Excel Import</Typography>
              <Typography onClick={() => { navigate('/bulletin'); setMobileOpen(false); }}>Bulletin Board</Typography>
              <Typography onClick={() => { navigate('/masscom'); setMobileOpen(false); }}>Mass Communication</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ bgcolor: 'transparent', color: '#fff' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
              Setup
            </AccordionSummary>
            <AccordionDetails>
              <Typography onClick={() => { navigate('/company'); setMobileOpen(false); }}>Company Policies & Forms</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;

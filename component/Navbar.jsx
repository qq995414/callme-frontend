/* eslint-disable react/prop-types */
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

const NavBar = ({ toggleDrawer, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Open menu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Define menu items based on user gender_type
  const menuItems = user?.gender_type === 'MALE'
    ? ['消費紀錄', '儲值紀錄', '我的追蹤', '我的對話']
    : ['邀請名單', '直播紀錄', '我的對話', '提領紀錄', '詳細設定'];

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#84C1FF', zIndex: 50000 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ mr: 2, px: 5 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            打給我
          </Typography>

          {/* Display the avatar if logged in */}
          {user ? (
            <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen}>
              <AccountCircle />
            </IconButton>
          ) : (
            <>
              {/* Show login and register buttons if not logged in */}
              <Typography variant="button" color="inherit" sx={{ mx: 1, cursor: 'pointer' }}>
                登入
              </Typography>
              <Typography variant="button" color="inherit" sx={{ mx: 1, cursor: 'pointer' }}>
                註冊
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Add a Toolbar as a spacer to prevent content from being covered */}
      <Toolbar />

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={handleMenuClose}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NavBar;

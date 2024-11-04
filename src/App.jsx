import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Box, Button, CssBaseline, Dialog, DialogActions, DialogTitle, Drawer, Grid, IconButton, List, ListItem, ListItemText, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { alpha, styled, ThemeProvider, useTheme } from '@mui/material/styles';
import {
  StreamVideo,
  StreamVideoClient
} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginModal from '../component/LoginModal';
import RegisterModal from '../component/RegisterModal';
import About from './pages/About';
import Pay from './pages/Pay';

import ChatRoom from './pages/ChatRoom';
import Home from './pages/Home';
import Live from './pages/Live';
import Live2 from './pages/Live2';
import LiveDetail from './pages/LiveDetail';
import Register from './pages/Register';
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: '100%',
}));

const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [genderType, setGenderType] = useState(null);
  const [userToken, setUserToken] = useState("");
  const [user, setUser] = useState({
    id: '',
    name: '',
  });
  const apiKey = 'y6jpx4p876zg';
  const client = new StreamVideoClient({ apiKey });

  useEffect(() => {
    getLoginStatus()
  }, []);
  const getLoginStatus = () => {
    let callme = localStorage.getItem('callme');
    callme = callme ? JSON.parse(callme) : null;
    if (callme) {
      setLoggedIn(true);
      setGenderType(callme.gender_type === 'MALE' ? 'MALE' : 'FEMALE');
    }
  };

  const handleMenuClick = () => {
    if (!loggedIn) {
      openLoginModal()
    }
  };
  const handleMenuClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);
  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem('callme'); // Clear login info from localStorage
    setLoggedIn(false);               // Reset login state
    setGenderType(null);              // Clear gender type
    handleMenuClose();                // Close the profile menu
  };

  const menuItems = (
    <>
      <Button color="inherit" component={Link} to="/">首頁</Button>
      <Button color="inherit" component={Link} to="/live">開播中</Button>
      <Button color="inherit" component={Link} to="/register">成為主播</Button>
      <Button color="inherit" component={Link} to={loggedIn && "/pay"} onClick={handleMenuClick}>儲值</Button>
    </>
  );

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      MenuListProps={{
        sx: {
          padding: 0,
          '& .MuiMenuItem-root': {
            padding: theme.spacing(1, 3),  // Adjust padding for consistent look
          },
        }
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {genderType === 'MALE' ? (
        <>
          <MenuItem onClick={handleMenuClose}>消費紀錄</MenuItem>
          <MenuItem onClick={handleMenuClose}>儲值紀錄</MenuItem>
          <MenuItem onClick={handleMenuClose}>我的追蹤</MenuItem>
          <MenuItem onClick={handleMenuClose}>我的對話</MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={handleMenuClose}>邀請名單</MenuItem>
          <MenuItem onClick={handleMenuClose}>直播紀錄</MenuItem>
          <MenuItem onClick={handleMenuClose}>我的對話</MenuItem>
          <MenuItem onClick={handleMenuClose}>提領紀錄</MenuItem>
          <MenuItem onClick={handleMenuClose}>詳細設定</MenuItem>
        </>
      )}
      <MenuItem onClick={handleLogout}>登出</MenuItem>
    </Menu>
  );

  const mobileMenuItems = loggedIn ? (
    <>
      {genderType === 'MALE' ? (
        <>
          <ListItem button onClick={toggleDrawer(false)}>
            <ListItemText primary="消費紀錄" />
          </ListItem>
          <ListItem button onClick={toggleDrawer(false)}>
            <ListItemText primary="儲值紀錄" />
          </ListItem>
          <ListItem button onClick={toggleDrawer(false)}>
            <ListItemText primary="我的追蹤" />
          </ListItem>
          <ListItem button onClick={toggleDrawer(false)}>
            <ListItemText primary="我的對話" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem button onClick={toggleDrawer(false)}>
            <ListItemText primary="邀請名單" />
          </ListItem>
          <ListItem button onClick={toggleDrawer(false)}>
            <ListItemText primary="直播紀錄" />
          </ListItem>
          <ListItem button onClick={toggleDrawer(false)}>
            <ListItemText primary="我的對話" />
          </ListItem>
          <ListItem button onClick={toggleDrawer(false)}>
            <ListItemText primary="提領紀錄" />
          </ListItem>
          <ListItem button onClick={toggleDrawer(false)}>
            <ListItemText primary="詳細設定" />
          </ListItem>
        </>
      )}
      <ListItem button onClick={handleLogout}>
        <ListItemText primary="登出" />
      </ListItem>
    </>
  ) : (
    <>
      <ListItem button onClick={openLoginModal}>
        <LockOpenIcon sx={{ color: '#79FF79', mr: 1 }} />
        <ListItemText primary="登入" />
      </ListItem>
      <ListItem button onClick={openRegisterModal}>
        <AccountCircleIcon sx={{ color: '#79FF79', mr: 1 }} />
        <ListItemText primary="創建帳號" />
      </ListItem>
    </>
  );
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await client.connectUser(user, userToken);

        // 監聽來電事件
        client.on('call.created', (event) => {
          setIncomingCall(event.call);
        });
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    };

    initialize();

    // 清理連接
    return () => {
      client.disconnectUser();
    };
  }, []);

  const handleAcceptCall = async () => {
    if (incomingCall) {
      await incomingCall.join();
      setIncomingCall(null); // 重置來電狀態
    }
  };

  const handleDeclineCall = () => {
    setIncomingCall(null); // 拒絕來電
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" style={{ backgroundColor: '#DD8EA4' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="logo">
              <img src="/image/image/LOGO.png" alt="logo" style={{ height: '60px' }} />
            </IconButton>

            {isMobile ? (
              <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            ) : (
              <>
                {menuItems}
                {profileMenu}
              </>
            )}

            <div style={{ flexGrow: 1 }} />

            {!isMobile && (
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="暱稱/房間號" inputProps={{ 'aria-label': 'search' }} />
              </Search>
            )}

            {!isMobile && (
              loggedIn ? (
                <>
                  <IconButton color="inherit" onClick={handleMenuClick2}>
                    <AccountCircleIcon />
                  </IconButton>
                  {profileMenu}
                </>
              ) : (
                <>
                  <Button color="inherit">APP下載</Button>
                  <Button color="inherit">我的追蹤</Button>
                  <Button
                    onClick={openLoginModal}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: 'white',
                      padding: '8px 16px',
                      marginLeft: '10px',
                      borderRadius: '50px',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      '&:hover': { backgroundColor: '#1976D2' },
                      marginRight: '10px',
                    }}
                    startIcon={<LockOpenIcon />}
                  >
                    登入
                  </Button>
                  <Button
                    onClick={openRegisterModal}
                    variant="outlined"
                    sx={{
                      color: '#79FF79',
                      borderColor: '#79FF79',
                      padding: '8px 16px',
                      marginLeft: '10px',
                      borderRadius: '50px',
                      '&:hover': { backgroundColor: '#FFF', borderColor: '#006030', color: '#006030' },
                    }}
                    startIcon={<AccountCircleIcon />}
                  >
                    創建帳號
                  </Button>
                </>
              )
            )}
          </Toolbar>
        </AppBar>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250, bgcolor: '#DD8EA4', height: '100vh', color: '#fff' }}>
            <List>
              <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
                <ListItemText
                  primary="首頁"
                  sx={{
                    color: '#fff',
                    textShadow: '1px 1px 2px black, -1px -1px 2px black', // 黑色文字外框效果
                  }}
                />
              </ListItem>
              <ListItem button component={Link} to="/live" onClick={toggleDrawer(false)}>
                <ListItemText
                  primary="開播中"
                  sx={{
                    color: '#fff',
                    textShadow: '1px 1px 2px black, -1px -1px 2px black',
                  }}
                />
              </ListItem>
              <ListItem button component={Link} to="/register" onClick={toggleDrawer(false)}>
                <ListItemText
                  primary="成為主播"
                  sx={{
                    color: '#fff',
                    textShadow: '1px 1px 2px black, -1px -1px 2px black',
                  }}
                />
              </ListItem>
              <ListItem button component={Link} to={loggedIn && "/pay"} onClick={handleMenuClick}>
                <ListItemText
                  primary="儲值"
                  sx={{
                    color: '#fff',
                    textShadow: '1px 1px 2px black, -1px -1px 2px black',
                  }}
                />
              </ListItem>
            </List>
            {loggedIn &&
              <StreamVideo client={client}>
                {incomingCall && (
                  <Dialog open={true}>
                    <DialogTitle>Incoming Call</DialogTitle>
                    <DialogActions>
                      <Button onClick={handleDeclineCall} color="secondary">
                        Decline
                      </Button>
                      <Button onClick={handleAcceptCall} color="primary">
                        Accept
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </StreamVideo>
            }
            <Box sx={{ borderTop: '1px solid #444', mt: 2, pt: 2 }}>
              <List>
                {mobileMenuItems}
              </List>
            </Box>
          </Box>
        </Drawer>
        <LoginModal isOpen={isLoginOpen} handleClose={closeLoginModal} getLoginStatus={getLoginStatus} setUserToken={setUserToken} setUser={setUser} />
        <RegisterModal isOpen={isRegisterOpen} handleClose={closeRegisterModal} getLoginStatus={getLoginStatus} setUserToken={setUserToken} setUser={setUser} />

        <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/Pay" element={<Pay />} />

            <Route path="/live/:id" element={<LiveDetail />} />
            <Route path="/live" element={<Live />} />
            <Route path="/live2" element={<Live2 />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chatRoom" element={<ChatRoom />} />
          </Routes>
        </Box>

        <Box sx={{ backgroundColor: '#f5f5f5', py: 3, borderTop: '1px solid #ddd' }}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <Link href="#" underline="hover" color="inherit">
                隱私權保護政策
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" underline="hover" color="inherit">
                服務條款
              </Link>
            </Grid>
          </Grid>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
            Copyright © 2024
          </Typography>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;

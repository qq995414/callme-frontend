import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const LoginModal = ({ isOpen, handleClose, getLoginStatus, setUserToken, setUser }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://52.63.204.109:18083/auth/login', {
        account,
        password,
      });

      if (response.data.code === 20000) {
        console.log('登入成功:', response.data.message);
        // 將登入返回的 data 存入 localStorage，key 為 "callme"
        setUserToken(response.data.chat_token)
        setUser({
          id: response.data.chat_id,
          name: response.data.nickname,
        })
        localStorage.setItem('callme', JSON.stringify(response.data.data));

        handleClose(); // 成功後關閉模態框
        getLoginStatus()

      } else {
        console.error('登入失敗:', response.data.message);
      }
    } catch (error) {
      console.error('請求失敗:', error);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" component="h2" gutterBottom>
          登入
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="手機號碼"
            variant="outlined"
            fullWidth
            margin="normal"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <TextField
            label="密碼"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              padding: '10px 0',
              borderRadius: '50px',
              fontSize: '16px',
            }}
          >
            登入
          </Button>
        </form>

      </Box>
    </Modal>
  );
};

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default LoginModal;

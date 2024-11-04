import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

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

const RegisterModal = ({ isOpen, handleClose, getLoginStatus, setUserToken, setUser }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerificationDisabled, setIsVerificationDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  // Timer countdown
  useEffect(() => {
    if (isVerificationDisabled) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setIsVerificationDisabled(false);
            setTimer(60); // Reset timer for next use
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isVerificationDisabled]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Clear any previous error message
    try {
      const response = await axios.post('http://52.63.204.109:18083/auth/register', {
        account: phoneNumber,
        password,
        nickname,
        referral_code: referralCode,
      });

      if (response.data.code === 20000) {
        console.log('註冊成功:', response.data.message);
        const loginResponse = await axios.post('http://52.63.204.109:8081/auth/login', {
          account: phoneNumber,
          password,
        });

        if (loginResponse.data.code === 20000) {
          console.log('登入成功:', loginResponse.data.message);
          getLoginStatus()
          // 將登入返回的 data 存入 localStorage，key 為 "callme"
          localStorage.setItem('callme', JSON.stringify(loginResponse.data.data));

          handleClose(); // 成功後關閉模態框
        } else {
          console.error('登入失敗:', loginResponse.data.message);
        }

        localStorage.setItem('callme', JSON.stringify(response.data.data));

        handleClose(); // Close the modal after successful registration
      } else {
        setErrorMessage(response.data.message || '註冊失敗'); // Show error message
      }
    } catch (error) {
      setErrorMessage('請求失敗，請重試'); // Show error message
      console.error('請求失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setErrorMessage(''); // Clear any previous error message
    try {
      const response = await axios.post('http://52.63.204.109:18083/auth/send/sms_key', null, {
        params: { phone_number: phoneNumber },
      });

      if (response.data.code === 20000) {
        console.log('驗證碼發送成功:', response.data.message);
        setIsVerificationDisabled(true);
      } else {
        setErrorMessage(response.data.message || '驗證碼發送失敗'); // Show error message
      }
    } catch (error) {
      setErrorMessage('發送驗證碼失敗，請重試'); // Show error message
      console.error('發送驗證碼失敗:', error);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" component="h2" gutterBottom>
          註冊
        </Typography>
        {/* Display error message if exists */}

        <form onSubmit={handleRegister}>
          <TextField
            label="手機號碼"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
          <TextField
            label="暱稱"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <TextField
            label="推薦碼"
            variant="outlined"
            fullWidth
            margin="normal"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
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
            disabled={loading}
          >
            註冊
          </Button>
        </form>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            mt: 2,
            padding: '10px 0',
            borderRadius: '50px',
            fontSize: '16px',
          }}
          onClick={handleSendVerification}
          disabled={isVerificationDisabled || !phoneNumber}
        >
          {isVerificationDisabled ? `重新發送 (${timer}s)` : '發送驗證碼'}
        </Button>
        {errorMessage && (
          <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

      </Box>
    </Modal>
  );
};

RegisterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default RegisterModal;

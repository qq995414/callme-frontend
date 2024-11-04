import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Pay = () => {
  const [rechargeOptions, setRechargeOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recharge options on mount
  useEffect(() => {
    const fetchRechargeOptions = async () => {
      // Retrieve token from localStorage
      const storedData = JSON.parse(localStorage.getItem('callme'));
      const token = storedData?.token; // Access token from the parsed data

      try {
        const response = await axios.get('http://52.63.204.109:18083/index');

        if (response.data.code === 0) {
          setRechargeOptions(response.data.data);
        } else {
          console.error('Failed to fetch recharge options:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching recharge options:', error);
      }
    };
    fetchRechargeOptions();
  }, []);

  // Handle payment request
  const handlePay = async (rechargeType) => {
    setLoading(true);
    try {
      const response = await axios.post('http://52.63.204.109:18083/app/pay', null, {
        params: { rechargeType },
      });
      if (response.data.code === 0) {
        alert('支付成功！');
      } else {
        console.error('支付失敗:', response.data.message);
      }
    } catch (error) {
      console.error('支付請求失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        加值方案
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {rechargeOptions.map((option, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ backgroundColor: '#F7F9FC', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" align="center">
                  {option.coins} 金幣
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  價格: ${option.price} TWD
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePay(String.fromCharCode(65 + index))} // Convert index to letter (A, B, C, etc.)
                    disabled={loading}
                    sx={{ borderRadius: 50, minWidth: 120 }}
                  >
                    {loading ? '處理中...' : '立即購買'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Pay;

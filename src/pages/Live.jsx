import ChatIcon from '@mui/icons-material/Chat';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Box, Card, CardMedia, Container, Grid, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Live = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  // API 請求函數
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://52.63.204.109:18083/index/list', {
        params: { page, limit, order: 'asc', sort: 'id' },
      });
      if (response.data.success) {
        setUsers((prevUsers) => [...prevUsers, ...response.data.data.records]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('無法獲取主播列表:', error);
    } finally {
      setLoading(false);
    }
  };

  // 滾動偵測函數
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10) {
      if (!loading) {
        fetchUsers();
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 渲染用戶卡片的函數
  const renderUserCards = (users) => {
    return users.map((user) => (
      <Grid item xs={6} sm={6} md={4} lg={3} key={user.id}>
        <Link to={`/live/${user.id}`} style={{ textDecoration: 'none' }}>

          <Card sx={{ position: 'relative', maxWidth: 345, height: 360 }}>
            <CardMedia
              component="img"
              image={user.file_urls} // 使用API回傳的圖片URL
              alt={user.nickname}
              sx={{ height: '100%', width: '100%' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                p: 1,
                color: 'white',
                textShadow: '1px 1px 3px black',
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {user.nickname}
                </Typography>
                <Typography variant="body2">
                  <StarIcon sx={{ color: '#ffb400', verticalAlign: 'middle' }} /> {user.star}
                </Typography>
              </Box>

              {/* 標籤展示區域 */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {user.appearance.split(',').map((tag, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 1, m: 0.5, p: 0.5 }}
                  >
                    #{tag}
                  </Typography>
                ))}
              </Box>

              {/* 狀態按鈕區域 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                {!user.cannot_take_video_call && (
                  <IconButton color="primary">
                    <VideocamIcon />
                  </IconButton>
                )}
                {!user.cannot_take_call && (
                  <IconButton color="success">
                    <PhoneIcon />
                  </IconButton>
                )}
                <IconButton color="primary">
                  <ChatIcon />
                </IconButton>
              </Box>
            </Box>
          </Card>
        </Link>
      </Grid>
    ));
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Typography variant="h4" align="left" gutterBottom sx={{ color: '#666' }}>
          主播列表
        </Typography>
        <Typography variant="subtitle1" align="left" gutterBottom sx={{ color: '#333' }}>
          全球最優質的主播都在這
        </Typography>

        <Grid container spacing={3} justifyContent="left">
          {renderUserCards(users)}
        </Grid>

        {loading && (
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            加載中...
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Live;

import ChatIcon from '@mui/icons-material/Chat'; // 文字聊天圖標
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import VideocamIcon from '@mui/icons-material/Videocam'; // 視訊圖標
import { Avatar, Box, Button, Card, CardContent, CardMedia, Container, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// 分成四個陣列，分別代表為你推薦、新加入、閒置中、純聊天
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const App = () => {
  // 每個區塊都有自己的 visibleCount 狀態
  const [visibleRecommended, setVisibleRecommended] = useState(8);
  const [visibleNew, setVisibleNew] = useState(8);
  const [visibleChat, setVisibleChat] = useState(8);

  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [newUserPage, setNewUserPage] = useState(1);
  const [chatUserPage, setChatUserPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const recommendedResponse = await axios.get('http://52.63.204.109:18083/index/list', {
          params: { page: recommendedPage, limit: 10 }
        });
        console.log(recommendedResponse.data.data)
        setRecommendedUsers(recommendedResponse.data.data.records);

        const newUsersResponse = await axios.get('http://52.63.204.109:18083/index/is_online', {
          params: { page: newUserPage, limit: 10 }
        });
        setNewUsers(newUsersResponse.data.data);

        const chatUsersResponse = await axios.get('http://52.63.204.109:18083/index/pinned_picture');
        setChatUsers(chatUsersResponse.data.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUsers();
  }, [recommendedPage, newUserPage, chatUserPage]);
  // 函數來渲染用戶卡片
  const renderUserCards = (users, visibleCount) => {
    return users.slice(0, visibleCount).map((user) => (
      <Grid item xs={6} sm={6} md={4} lg={3} key={user.id}>

        <Link to={`/live/${user.id}`} style={{ textDecoration: 'none' }}>

          <Card sx={{ position: 'relative', maxWidth: 345, height: 270 }}>
            <CardMedia
              component="img"
              image={user.file_urls}
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
              {/* 文字内容 */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {user.nickname}
                </Typography>
                <Typography variant="body2">
                  <StarIcon sx={{ color: '#ffb400', verticalAlign: 'middle' }} /> {user.rating}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {(user.appearance || "").split(',').slice(0, 3).map((tag, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 1, m: 0.5, p: 0.5 }}
                  >
                    #{tag.trim()}
                  </Typography>
                ))}

              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                {user.state === 0 && (
                  <>
                    <IconButton color="primary">
                      <VideocamIcon />
                    </IconButton>
                    <IconButton color="primary">
                      <ChatIcon />
                    </IconButton>
                    <IconButton color="success">
                      <PhoneIcon />
                    </IconButton>
                  </>
                )}
                {user.state === 1 && (
                  <Box
                    sx={{
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                    }}
                  >
                    忙碌中
                  </Box>
                )}
                {user.state === 2 && (
                  <Box
                    sx={{
                      backgroundColor: 'gray',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                    }}
                  >
                    離線中
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Link>

      </Grid>
    ));
  };

  const renderCircleUserCards = (users) => {
    return (
      <Box sx={{ width: '93vw', maxWidth: '1200px', mt: 3 }}> {/* 确保外部容器宽度充足 */}
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }} // 设置自动切换为 4 秒
          spaceBetween={10}
          slidesPerView={3} // 默认展示 5 张
          style={{ width: '100%' }}
          breakpoints={{
            640: { slidesPerView: 4, spaceBetween: 10 },
            768: { slidesPerView: 4, spaceBetween: 10 },
            1024: { slidesPerView: 6, spaceBetween: 10 },
            1280: { slidesPerView: 8, spaceBetween: 10 },
          }}
        >
          {users.map((user) => (
            <SwiperSlide key={user.id}>
              <Card
                sx={{
                  textAlign: 'center',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(0,0,0,0)',
                  boxShadow: '0px 0px 0px ',
                  width: '100%',
                }}
              >
                <Link to={`/live/${user.id}`} style={{ textDecoration: 'none' }}>
                  <Avatar
                    src={user.file_urls}
                    alt={user.nickname}
                    sx={{
                      width: 100,
                      height: 100,
                      margin: '0 auto',
                      border: user.state === 0 ? '2px solid #4CAF50' : '2px solid gray',
                    }}
                  />
                </Link>
                <CardContent sx={{ padding: '8px 0' }}>
                  <Typography variant="h6" component="div" sx={{ fontSize: '16px' }}>
                    {user.nickname}
                  </Typography>


                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    );
  };
  return (
    <Container sx={{ display: 'flex' }}>
      {/* 左側選單列表 */}

      {/* 右側用戶卡片顯示區域 */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container justifyContent="left" >
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            coverflowEffect={{
              rotate: 0,       // 减小旋转角度以确保居中滑块更明显
              stretch: 0,
              depth: 300,      // 增加深度让旁边的滑块更小
              modifier: 1.5,   // 增加modifier让效果更加明显
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            loop={true}
            slidesPerView={3} // 居中并确保3个滑块同时显示
            initialSlide={chatUsers.length - 3} // 设置初始滑块为中间滑块，假设有9个滑块
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 10 },
              1024: { slidesPerView: 3, spaceBetween: 10 },
              1280: { slidesPerView: 5, spaceBetween: 10 },
            }}
            modules={[EffectCoverflow, Pagination]}
            className="mySwiper swiper1"
          >
            {chatUsers.map((imageUrl, index) => (
              <SwiperSlide key={"swiper" + index}>
                <img style={{ height: '100%' }} src={imageUrl} alt={`Slide ${index}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>
        <Grid container spacing={3} justifyContent="left">
          {renderCircleUserCards(recommendedUsers, visibleRecommended)}
        </Grid>
        <Typography variant="h4" align="left" gutterBottom sx={{ color: '#666' }}>
          主播列表
        </Typography>
        <Typography variant="subtitle1" align="left" gutterBottom sx={{ color: '#333' }}>
          全球最優質的主播都在這
        </Typography>

        {/* 為你推薦 */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, color: '#666' }}>
          為你推薦
        </Typography>
        <Grid container spacing={3} justifyContent="left">
          {renderUserCards(recommendedUsers, visibleRecommended)}
        </Grid>
        {visibleRecommended < recommendedUsers.length && (
          <Grid container justifyContent="left" sx={{ mt: 2 }}>
            <Button variant="contained" color="error" onClick={() => setVisibleRecommended(visibleRecommended + 8)}>
              查看更多
            </Button>
          </Grid>
        )}

        {/* 新加入 */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, color: '#666' }}>
          上線中
        </Typography>
        <Grid container spacing={3} justifyContent="left">
          {renderUserCards(newUsers, visibleNew)}
        </Grid>
        {visibleNew < newUsers.length && (
          <Grid container justifyContent="left" sx={{ mt: 2 }}>
            <Button variant="contained" color="error" onClick={() => setVisibleNew(visibleNew + 8)}>
              查看更多
            </Button>
          </Grid>
        )}

      </Box>
    </Container>
  );
};

export default App;

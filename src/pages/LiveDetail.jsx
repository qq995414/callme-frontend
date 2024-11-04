
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Box, Button, CardContent, Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Modal from "react-modal";
import { Link, useParams } from 'react-router-dom';
import 'swiper/css';

import { StyledFlexBox } from "../../component/Styles/Shared.styles";
const Live = () => {
  // 假数据 (mockData)
  const { id } = useParams(); // Extracts '28' from '/live/28'



  const [data, setData] = useState(null);
  const [mapStart, setMapStart] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imgOrders, setImgOrders] = useState(0);
  const imgOrdersRef = useRef(imgOrders);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://52.63.204.109:18083/index/detail/${id}`);
        const apiData = response.data.data;
        setData({
          name: apiData.nickname,
          onlineStatus: !apiData.is_online
            ? "離線中"
            : apiData.is_live
              ? "直播中"
              : "上線中", level: apiData.star,
          matchPercentage: 99, // Assuming matchPercentage is not in API response
          description: apiData.about_me,
          declarationTags: Array.isArray(apiData.statement)
            ? apiData.statement
            : apiData.statement
              ? apiData.statement.split(",")
              : [],
          appearanceTags: Array.isArray(apiData.appearance)
            ? apiData.appearance
            : apiData.appearance
              ? apiData.appearance.split(",")
              : [],
          file: apiData.file_urls.split(',').map((url, index) => ({
            type: url.endsWith('.mp4')
              ? "MP4" :
              "JPG",
            fileUrl: url,
            orders: index + 1,
          })),
          audioFile: apiData.mp3_url,
        });
        console.log(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Fetch data again if id changes
  useEffect(() => {
    imgOrdersRef.current = imgOrders;
  }, [imgOrders]);

  const handlePreviousImage = () => {
    const previousIndex = selectedImageIndex === 0 ? data.file.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(previousIndex);
  };

  const handleNextImage = () => {
    const nextIndex = selectedImageIndex === data.file.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImageIndex(nextIndex);
  };

  const handleImageClick = (index) => {
    setImgOrders(index);
  };
  const isDesktop = useMediaQuery('(min-width:900px)');

  return (
    <>
      {data &&
        <>
          <StyledFlexBox justifyContent="space-between" className="mobile-none" px={3} >
            <img src="/image/user/user-left.svg" onClick={() => {
              if (mapStart >= 4) {
                setMapStart(mapStart - 4)
              }
            }} alt="" />
            <StyledFlexBox width="100%">
              {data.file && data.file.length > 0 && imgOrders >= 0 && imgOrders < data.file.length && data.file[imgOrders].type === "JPG" && (
                <>
                  <div
                    key={"user" + data.id}
                    className="item"
                    style={{
                      // 设置背景图片
                      backgroundImage: `url('${data.file[imgOrders].fileUrl}')`,
                      backgroundSize: "auto 100%",
                      backgroundRepeat: "no-repeat",
                      widows: "100%",
                      aspectRatio: 1 / 1,
                      padding: "0.2rem",
                    }}
                    onClick={() => {
                      setSelectedImageIndex(data.file[imgOrders].orders - 1);
                      setIsImageModalOpen(true);
                    }}
                  >
                    <StyledFlexBox style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "end",
                      textShadow: "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                      flexDirection: "column"
                    }}>


                    </StyledFlexBox>
                  </div>
                </>
              )}
              {data.file && data.file.length > 0 && imgOrders >= 0 && imgOrders < data.file.length && data.file[imgOrders].type === "MP4" &&
                <>
                  {data.file && data.file.length > 0 && imgOrders >= 0 && imgOrders < data.file.length && data.file[imgOrders].type === "MP4" && (
                    <div
                      key={"user" + data.id}
                      className="item"
                      style={{
                        // 设置背景图片
                        backgroundImage: `url('${data.file[imgOrders].fileUrl}')`,
                        backgroundSize: "auto 50%",
                        width: "50%",
                        aspectRatio: 1 / 1,
                        padding: "0.2rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedImageIndex(data.file[imgOrders].orders - 1);
                        setIsImageModalOpen(true);
                      }}
                    >
                      <video
                        style={{
                          pointerEvents: "none", // 不接收任何鼠標事件
                        }}
                        controls width="100%" height="100%">
                        <source src={"" + data.file[imgOrders].fileUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {/* React-modal */}

                </>}

              <div className="UserGridJpg" style={{
                gridTemplateRows: data.file && data.file.length > 3 ? "repeat(2, 1fr)" : "repeat(2, 1fr)"
              }}>
                <>
                  {/* 图片 */}
                  {data.file &&
                    data.file.slice(0 + mapStart, 4 + mapStart).map((list, index) => (
                      <div
                        key={`file-${index}`}
                        style={{ width: "100%", overflow: "hidden", aspectRatio: "1/1" }}
                      >

                        <img
                          src={`${list.fileUrl}`}
                          style={{ width: "100%" }}
                          alt=""
                          onClick={() => {
                            setImgOrders(list.orders - 1);
                          }}
                        />
                        {index === 3 && data.file.length - 5 - imgOrders > 0 && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              width: "25%",
                              height: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                            }}
                          >
                            <span style={{ color: "white", fontSize: "24px" }}>其他{data.file.length - 4 - mapStart}張</span>
                          </div>
                        )}
                      </div>
                    ))}

                  {/* 图片模态框 */}

                </>
              </div>
            </StyledFlexBox>
            <img src="/image/user/user-right.svg"
              onClick={() => {
                if (mapStart < data.file.length - 4) {
                  setMapStart(mapStart + 4)
                }
              }} alt="" />
          </StyledFlexBox>
          <div className="mobile-show " >
            {data.file && data.file.length > 0
              && <>

                <StyledFlexBox
                  key={"user" + data.id}
                  className="item"
                  style={{
                    // 设置背景图片
                    backgroundImage: `url('${data.file[imgOrders].fileUrl}')`,
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat",
                    width: "100vw",
                    aspectRatio: 1 / 1,
                    padding: "0.2rem",
                    marginBottom: "-2rem"
                  }}
                  alignItems="end"

                >
                  <StyledFlexBox height="100%" alignItems="center"
                    onClick={() => {
                      if (imgOrders >= 1) {
                        setImgOrders(imgOrders - 1)
                      }
                    }}>
                    <img width="32px" src="/image/modal/back.svg " onClick={handlePreviousImage} />
                  </StyledFlexBox>
                  <StyledFlexBox style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "end",
                    flexDirection: "column"
                  }}
                    onClick={() => {
                      setSelectedImageIndex(data.file[imgOrders].orders - 1);
                      setIsImageModalOpen(true);
                    }}>



                  </StyledFlexBox>
                  <StyledFlexBox height="100%" alignItems="center"
                    onClick={() => {
                      if (imgOrders < data.file.length - 1) {
                        setImgOrders(imgOrders + 1)
                      }
                    }} >
                    <img width="32px" src="/image/modal/next.svg " />
                  </StyledFlexBox>
                </StyledFlexBox>
                <StyledFlexBox ml={2} width={"90vw"}
                >
                  {/*    <OwlCarousel className='owl-theme'
                nav
                dots={false}
                dotClass='none'
                items={3}

              >
                {data.file && data.file.map((item, DataIndex) => <>

                  <div className='item' style={{
                    backgroundImage: "url('" + item.fileUrl + "')",
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    aspectRatio: "1/1",
                    border: DataIndex == imgOrdersRef.current ? "2px solid #FFFFFF" : "2px solid #D1B193",
                    height: "auto"
                  }}
                    onClick={() => {
                      handleImageClick(DataIndex)
                    }}>
                  </div>

                </>

                )}
              </OwlCarousel> */}
                </StyledFlexBox>

              </>}

          </div>
          <hr
            className="mobile-none mobile-padding"
            style={{
              border: "1px solid #D1B193",
              marginTop: "1rem"
            }} />
          <StyledFlexBox width="100%">
            {/* 確保 data 和 data.file 存在 */}
            {data.file && data.file.map((item, DataIndex) => <>

              <div className='item mobile-show' style={{
                backgroundImage: "url('" + item.fileUrl + "')",
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
                width: "100%",
                aspectRatio: "1/1",
                border: DataIndex == imgOrdersRef.current ? "2px solid #FFFFFF" : "2px solid #D1B193",
                height: "auto"
              }}
                onClick={() => {
                  handleImageClick(DataIndex)
                }}>
              </div>
            </>

            )}


          </StyledFlexBox>


          {/*  </OwlCarousel> */}
          <Grid item xs={12} md={7}>
            <CardContent>
              {/* 用戶基本信息 */}
              <Typography variant={isDesktop ? "h4" : "h5"} fontWeight="bold" sx={{ textAlign: 'left', mb: 1 }}>
                {data.name}
              </Typography>

              <Box display="flex" justifyContent={"flex-start"} alignItems="center" mt={2}>

                <Typography
                  variant="body2"
                  sx={{
                    color: data.onlineStatus === "離線中"
                      ? "gray"
                      : data.onlineStatus === "直播中"
                        ? "red"
                        : "green",
                  }}
                >
                  ● {data.onlineStatus}
                </Typography>
              </Box>

              {/* 關注按鈕和匹配度 */}
              <Box display="flex" justifyContent={"flex-start"} mt={2}>
                <Button variant="outlined" size="small" sx={{ mr: 2 }}>
                  + 關注
                </Button>
              </Box>

              {/* 標籤展示 */}
              <Typography variant="h6" sx={{ mt: 4 }}>
                我先聲明
              </Typography>
              <Box display="flex" flexWrap="wrap">
                {data.declarationTags && data.declarationTags.map((tag, index) => (
                  <Typography key={index} variant="body2" sx={{ m: 0.5, backgroundColor: '#e0e0e0', borderRadius: 1, p: 0.5 }}>
                    #{tag}
                  </Typography>
                ))}
              </Box>

              <Typography variant="h6" sx={{ mt: 4 }}>
                外型
              </Typography>
              <Box display="flex" flexWrap="wrap">
                {data.appearanceTags && data.appearanceTags.map((tag, index) => (
                  <Typography key={index} variant="body2" sx={{ m: 0.5, backgroundColor: '#e0e0e0', borderRadius: 1, p: 0.5 }}>
                    #{tag}
                  </Typography>
                ))}
              </Box>

              {/* 個人描述 */}
              <Typography variant="h6" sx={{ mt: 4 }}>
                個人描述
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {data.description}
              </Typography>

              {/* 音頻播放器 */}
              <Typography variant="h6" sx={{ mt: 4 }}>
                聲音留言
              </Typography>
              <ReactAudioPlayer src={data.audioFile} controls style={{ width: '100%', marginTop: '8px', maxWidth: '300px' }} />
            </CardContent>
          </Grid>
          <Box display="flex" justifyContent="space-around" mt={3} pb={2} width="100%">
            <IconButton color="primary">
              <Link to={`/chatroom`} style={{ textDecoration: 'none' }}>
                <VideocamIcon />
              </Link>
            </IconButton>
            <IconButton color="primary">
              <Link to={`/chatroom`} style={{ textDecoration: 'none' }}>

                <CallIcon />
              </Link>

            </IconButton>
            <IconButton color="primary">
              <Link to={`/chatroom`} style={{ textDecoration: 'none' }}>

                <ChatIcon />
              </Link>

            </IconButton>
          </Box>
          <Modal
            isOpen={isImageModalOpen}
            onRequestClose={() => setIsImageModalOpen(false)}
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <div className="modal-close" onClick={() => setIsImageModalOpen(false)}>X</div>
            <div className="modal-next" ><img src="/image/modal/back.svg " onClick={handlePreviousImage} /></div>
            <div className="modal-back"><img src="/image/modal/next.svg " onClick={handleNextImage} /> </div>
            {data.file && data.file[selectedImageIndex] &&
              <>
                {data.file[selectedImageIndex].type === "MP4" ? (
                  <video controls width="100%" height="100%">
                    <source src={`${data.file[selectedImageIndex] && data.file[selectedImageIndex].fileUrl}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={`${data.file[selectedImageIndex] && data.file[selectedImageIndex].fileUrl}`} alt="" style={{ width: "100%", height: "100%" }} />
                )}                    </>
            }
          </Modal>
        </>}

    </>
  );
};

export default Live;

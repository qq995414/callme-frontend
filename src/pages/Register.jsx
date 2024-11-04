import AddIcon from '@mui/icons-material/Add';
import { Avatar, Backdrop, Box, Button, Card, CardContent, Checkbox, CircularProgress, Container, Divider, FormControl, FormControlLabel, FormGroup, Grid, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { ReactMediaRecorder } from "react-media-recorder";

const Register = () => {
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    nickname: '',
    gender_type: 'FEMALE',
    real_name: '',
    id_number: '',
    address: '',
    email: '',
    contactOption: 'address',
    description: '',
  });
  const [avatarFiles, setAvatarFiles] = useState([]);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [voiceURL, setVoiceURL] = useState(null);
  const [appearanceTags, setAppearanceTags] = useState([
    '高挑', '小隻馬', '清純', '性感', '可愛', '氣質', '活力',
    '古典美', '時尚', '陽光', '甜美', '纖細', '健康',
    '俏皮', '短髮', '豐滿', 'OL', '運動'
  ]);
  const declarationTags = ['不約見', '不聊色', '不電愛', '熟了有機會'];
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // Message for success or error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag && !appearanceTags.includes(customTag)) {
      setAppearanceTags((prev) => [...prev, customTag]);
      setSelectedTags((prev) => [...prev, customTag]);
      setCustomTag('');
    }
  };

  const handleAvatarChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + avatarFiles.length > 6) {
      alert('最多只能上傳6張圖片');
      return;
    }
    setAvatarFiles((prev) => [...prev, ...files]);
  };

  const uploadFile = async (file, fileType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    const response = await axios.post('http://52.63.204.109:18083/file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.id;
  };

  const uploadMultipleFiles = async (files, fileType) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('file_type', fileType);
    const response = await axios.post('http://52.63.204.109:18083/file/upload_multi', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.map((file) => file.id);
  };

  const handleCompleteRegister = async () => {
    if (avatarFiles.length < 1) {
      alert('請至少上傳1張圖片');
      return;
    }

    setLoading(true);
    setModalOpen(true);
    setModalMessage(''); // Clear previous messages
    try {
      // Step 3: Upload Avatars
      const avatarIds = await uploadMultipleFiles(avatarFiles, 'AVATAR');

      // Step 4: Upload ID Front and Back
      const idFrontId = idFront ? await uploadFile(idFront, 'ID_CARD') : null;
      const idBackId = idBack ? await uploadFile(idBack, 'ID_CARD') : null;

      // Step 5: Upload Voice Recording
      let voiceId = null;
      if (voiceURL) {
        const voiceBlob = await fetch(voiceURL).then((res) => res.blob());
        voiceId = await uploadFile(voiceBlob, 'MP3');
      }

      // Step 6: Final Registration Submission
      await axios.post('http://52.63.204.109:18083/auth/female_register', {
        account: formData.account,
        password: formData.password,
        nickname: formData.nickname,
        real_name: formData.real_name,
        id_number: formData.id_number,
        receiving_type: formData.contactOption === 'address',
        address: formData.contactOption === 'address' ? formData.address : '',
        email: formData.contactOption === 'email' ? formData.email : '',
        statement: declarationTags.filter((tag) => selectedTags.includes(tag)).join(','),
        appearance: appearanceTags.filter((tag) => selectedTags.includes(tag)).join(','),
        about_me: formData.description,
        file_ids: avatarIds.join(','),
        id_front_file_id: idFrontId,
        id_back_file_id: idBackId,
        mp3_id: voiceId,
      });

      setModalMessage('註冊及認證流程已完成'); // Success message
    } catch (error) {
      console.error('註冊過程中發生錯誤:', error);
      setModalMessage('註冊過程中發生錯誤，請檢查資料並重試'); // Error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ p: 3, boxShadow: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976D2' }}>
            女性用戶註冊
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* 註冊表單 */}
          <TextField
            label="帳號"
            name="account"
            value={formData.account}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="密碼"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="暱稱"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          {/* 通訊地址和郵件信箱二選一 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976D2', fontWeight: 'medium' }}>
            請選擇接收扣繳憑單的方式
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              name="contactOption"
              value={formData.contactOption}
              onChange={handleChange}
            >
              <FormControlLabel value="address" control={<Radio />} label="通訊地址" />
              {formData.contactOption === 'address' && (
                <TextField
                  label="通訊地址"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              )}
              <FormControlLabel value="email" control={<Radio />} label="郵件信箱" />
              {formData.contactOption === 'email' && (
                <TextField
                  label="郵件信箱"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              )}
            </RadioGroup>
          </FormControl>

          {/* 真實資料 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976D2', fontWeight: 'medium' }}>
            真實資料
          </Typography>
          <TextField
            label="真實姓名"
            name="real_name"
            value={formData.real_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="身分證號碼"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          {/* 標籤選擇 - 我先聲明 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976D2', fontWeight: 'medium' }}>
            我先聲明
          </Typography>
          <FormGroup row>
            {declarationTags.map((tag, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                }
                label={`#${tag}`}
              />
            ))}
          </FormGroup>

          {/* 標籤選擇 - 外型 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976D2', fontWeight: 'medium' }}>
            外型
          </Typography>
          <FormGroup row>
            {appearanceTags.map((tag, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                }
                label={`#${tag}`}
              />
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TextField
                size="small"
                placeholder="自訂標籤"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button onClick={addCustomTag} variant="contained" color="primary" size="small">
                <AddIcon fontSize="small" />
              </Button>
            </Box>
          </FormGroup>

          {/* 個人描述 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976D2', fontWeight: 'medium' }}>
            個人描述
          </Typography>
          <TextField
            label="描述"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          {/* 頭像上傳 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976D2', fontWeight: 'medium' }}>
            上傳頭像（最少1張，最多6張）
          </Typography>
          <input type="file" multiple accept="image/*" onChange={handleAvatarChange} />

          {/* 頭像縮圖 */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {avatarFiles.map((file, index) => (
              <Grid item xs={4} key={index}>
                <Avatar
                  src={URL.createObjectURL(file)}
                  variant="rounded"
                  sx={{ width: '100%', height: 'auto' }}
                />
              </Grid>
            ))}
          </Grid>

          {/* 身分證上傳 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976D2', fontWeight: 'medium' }}>
            上傳身分證（正反面）
          </Typography>
          <Box>
            <input type="file" accept="image/*" onChange={(e) => setIdFront(e.target.files[0])} style={{ marginRight: '10px' }} />
            <input type="file" accept="image/*" onChange={(e) => setIdBack(e.target.files[0])} />
          </Box>

          {/* 錄音留言 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, color: '#1976D2', fontWeight: 'medium' }}>
            錄音留言
          </Typography>
          <ReactMediaRecorder
            audio
            onStop={(url) => setVoiceURL(url)}
            render={({ status, startRecording, stopRecording }) => (
              <Box>
                <Button variant="contained" onClick={startRecording} color="primary" sx={{ mr: 2 }}>
                  開始錄音
                </Button>
                <Button variant="contained" onClick={stopRecording} color="secondary">
                  停止錄音
                </Button>
                <Typography variant="body2" sx={{ mt: 1, color: '#555' }}>
                  錄音狀態: {status}
                </Typography>
                {voiceURL && <audio src={voiceURL} controls />}
              </Box>
            )}
          />

          {/* 統一的註冊按鈕 */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCompleteRegister}
              fullWidth
              sx={{ fontWeight: 'bold', padding: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '開始註冊流程'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal for loading, success, or error messages */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Backdrop open={true} sx={{ color: '#fff', zIndex: 1000 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress color="inherit" />
              <Typography variant="h6" sx={{ mt: 2 }}>註冊中，請稍候...</Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mt: 2 }}>{modalMessage}</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setModalOpen(false)}
              >
                確認
              </Button>
            </Box>
          )}
        </Backdrop>
      </Modal>
    </Container>
  );
};

export default Register;

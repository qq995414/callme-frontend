import { Box, CircularProgress, Container, useMediaQuery } from '@mui/material';
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Channel, ChannelHeader, Chat, MessageInput, MessageList, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = 'y6jpx4p876zg';
const userToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTczMDY1NzQ1MDU3MXN5MTduIiwiZXhwIjoxNzMwNzQ0Mjc1LCJpYXQiOjE3MzA2NTc4NzUsImlzcyI6IlN0cmVhbSBDaGF0IEphdmEgU0RLIiwic3ViIjoiU3RyZWFtIENoYXQgSmF2YSBTREsifQ.Wrxx1sDdE2-pyhodYz25YwJj_W4LyVPJsjbdf0ib9IA';

const user = {
  id: '1730657450571sy17n',
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey });
const chatClient = StreamChat.getInstance(apiKey);

export default function App() {
  const isDesktop = useMediaQuery('(min-width:900px)');
  const [call, setCall] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStreamClients = async () => {
      try {
        // Connect user for video call
        await client.connectUser(user, userToken);
        const streamCall = client.call('default', 'V9l5NEZrtaKL');
        await streamCall.join({ create: true });
        setCall(streamCall);

        // Start recording automatically and keep it running
        startAndMaintainRecording(streamCall);

        // Connect user for chat
        await chatClient.connectUser(user, userToken);
        const newChannel = chatClient.channel('livestream', 'general', {
          name: '直播聊天室',
        });
        await newChannel.watch();
        setChannel(newChannel);

        setLoading(false);
      } catch (error) {
        console.error('初始化失敗:', error);
      }
    };

    initializeStreamClients();

    // Cleanup on unmount
    return () => {
      client.disconnectUser();
      chatClient.disconnectUser();
    };
  }, []);

  const startAndMaintainRecording = (streamCall) => {
    // Function to start recording if not already active
    const ensureRecording = async () => {
      try {
        // Check if recording is already started
        const recordingState = streamCall.state.transcribing;
        if (!recordingState) {
          // Start recording if not active
          await streamCall.startRecording();
          console.log('錄製已啟動');
        }
      } catch (error) {
        console.error('無法啟動錄製:', error);
      }
    };

    // Start recording initially
    ensureRecording();

    // Set an interval to ensure recording is maintained
    setInterval(ensureRecording, 5000); // 每5秒檢查一次錄製狀態
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: isDesktop ? 'row' : 'column' }}>
      {/* Video Call Section */}
      <Box
        sx={{
          flex: 3,
          bgcolor: 'black',
          borderRadius: 2,
          overflow: 'hidden',
          mb: isDesktop ? 0 : 2,
          mr: isDesktop ? 2 : 0,
        }}
      >
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <StreamTheme>
              <SpeakerLayout participantsBarPosition="bottom" />
              {/* Hide recording button */}
              <CallControls controls={{ record: false }} />
            </StreamTheme>
          </StreamCall>
        </StreamVideo>
      </Box>

      {/* Chat Section */}
      <Box
        sx={{
          flex: 2,
          bgcolor: 'white',
          borderRadius: 2,
          p: 2,
          height: isDesktop ? '500px' : 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Chat client={chatClient} theme="livestream dark">
          {channel && (
            <Channel channel={channel}>
              <Window>
                <ChannelHeader title="聊天室" />
                <MessageList />
                <MessageInput placeholder="傳送訊息..." />
              </Window>
            </Channel>
          )}
        </Chat>
      </Box>
    </Container>
  );
}

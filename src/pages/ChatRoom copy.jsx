import {
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';

const apiKey = 'y6jpx4p876zg';
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMTczMDU3Mjg3NDg2Nzc0ZDlvIiwiZXhwIjoxNzMwNzM3ODM2LCJpYXQiOjE3MzA2NTE0MzYsImlzcyI6IlN0cmVhbSBDaGF0IEphdmEgU0RLIiwic3ViIjoiU3RyZWFtIENoYXQgSmF2YSBTREsifQ.hgNRamjRz50H1-wNad9AWriYnSXdNuVDpyzo2dXUUyI';
const user = { id: '173057287486774d9o', name: 'Username' };

const client = new StreamVideoClient({ apiKey });

async function setupClient() {
  await client.connectUser(user, token);
}

export default function ChatRoom() {
  const [call, setCall] = useState(null);

  useEffect(() => {
    // Set up the client and call connection on component mount
    const initialize = async () => {
      await setupClient();
      const newCall = client.call('default', 'sample-call-id');
      await newCall.join({ create: true });
      setCall(newCall);
    };

    initialize();

    // Clean up on component unmount
    return () => client.disconnectUser();
  }, []);

  if (!call) return <div>Loading...</div>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI />
      </StreamCall>
    </StreamVideo>
  );
}

function CallUI() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  return callingState === CallingState.JOINED ? (
    <SpeakerLayout participantsBarPosition="bottom" />
  ) : (
    <div>Loading...</div>
  );
}

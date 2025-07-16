import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import socket from '../../socket/socket';

export default function Loader() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;

  const hasEmittedRef = useRef(false);
  const socketIdRef = useRef(null);

  useEffect(() => {
    const handleConnect = () => {
      socketIdRef.current = socket.id;
      console.log('🧷 Connected to socket:', socket.id);
    };

    socket.on('connect', handleConnect);
    if (socket.connected) handleConnect();

    return () => {
      socket.off('connect', handleConnect);
    };
  }, []);

  useEffect(() => {
    if (!user || hasEmittedRef.current) return;

    const timeout = setTimeout(() => {
      toast.info('❌ No online users found. Starting single player...');
     navigate('/play', {
  state: {
    user: { ...user, socketId: socket.id },
    opponent
  }
});

    }, 10000);

    // ✅ Set listener first
socket.on('matchFound', (opponent) => {
  console.log('🟡 Received matchFound with:', opponent);
  clearTimeout(timeout);

  const roomId = opponent.roomId; // ✅ from the one who receives `matchFound`
  const fullUser = { ...user, socketId: socket.id, roomId };
  const fullOpponent = { ...opponent };

  toast.success(`✅ Player Found: ${opponent.name}`);
  navigate('/play', {
    state: {
      user: fullUser,
      opponent: fullOpponent
    }
  });
});



    // ✅ THEN emit
    hasEmittedRef.current = true;
    console.log('🟢 Emitting findMatch with:', user);
    socket.emit('findMatch', user);

    return () => {
      clearTimeout(timeout);
      socket.off('matchFound');
    };
  }, [user]);

  return (
    <div className="loader-screen">
      <h2>🧠 Waiting for opponent...</h2>
      <div className="loading-bar"></div>
    </div>
  );
}

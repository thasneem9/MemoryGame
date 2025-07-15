import { useLocation } from 'react-router-dom';

export default function Play() {
  const { state } = useLocation();
  const { user, opponent } = state || {};

  return (
    <div className="play-screen">
      <div className="player">
        <div className="avatar">{user?.avatar}</div>
        <p>{user?.name}</p>
      </div>

      <h1>🧠 Memory Game Arena</h1>

      <div className="player">
        <div className="avatar">{opponent?.avatar}</div>
        <p>{opponent?.name}</p>
      </div>
    </div>
  );
}

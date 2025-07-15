import { useLocation } from 'react-router-dom';

export default function Play() {
  const { state } = useLocation();
  const { user, opponent } = state || {};

  return (
    <div className="play-screen">
      <div className="player">
      <img  className='avatar'src={user.avatar} alt={user.name} width={60} style={{ borderRadius: '50%' }} />

        <p>{user?.name}</p>
      </div>

      <h1>🧠 Memory Game Arena</h1>

      <div className="player">
        {opponent && (
  <img
    className="avatar"
    src={opponent.avatar}
    alt={opponent.name}
    width={60}
    style={{ borderRadius: '50%' }}
  />
)}

        <p>{opponent?.name}</p>
      </div>
    </div>
  );
}

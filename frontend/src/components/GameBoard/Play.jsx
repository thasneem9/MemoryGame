import { useLocation } from 'react-router-dom';
import MemoryBoard from './MemoryBoard'; // 📌 make sure this component exists
import './play.css'; // 📌 create this

export default function Play() {
  const { state } = useLocation();
  const { user, opponent } = state || {};

  return (
    <div className="play-screen">
      <div className="top-bar">
        <div className="player player-left">
          <img className="avatar" src={user.avatar} alt={user.name} />
          <p>{user.name}</p>
        </div>

        <h1 className="arena-title">🧠 Memory Game Arena</h1>

        <div className="player player-right">
          {opponent ? (
            <>
              <img className="avatar" src={opponent.avatar} alt={opponent.name} />
              <p>{opponent.name}</p>
            </>
          ) : (
            <p>Waiting...</p>
          )}
        </div>
      </div>

     {opponent && <MemoryBoard user={user} opponent={opponent} />}


    </div>
  );
}

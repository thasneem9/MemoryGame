import { useNavigate } from 'react-router-dom';
import './homepage.css';

function HomePage() {
  const navigate = useNavigate();

  const handlePlayWithFriend = () => {
    navigate('/setup');
  };

  const handleSinglePlayer = () => {
    // Later you could skip setup and go straight to /play
    navigate('/play');
  };

  return (
    <>
      <h1 className='game-heading'>Welcome to Memory Game</h1>
      <div className="select-player-container">
        <div className='select-player' onClick={handlePlayWithFriend}>
          Play with Friend
        </div>
        <div className='select-player' onClick={handleSinglePlayer}>
          Single Player
        </div>
      </div>
    </>
  );
}

export default HomePage;

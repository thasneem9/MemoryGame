import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import './playersetup.css'
export default function PlayerSetup() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const id = uuid(); // ✅ generate unique per player
    const user = { id, name, avatar: selectedAvatar };
    console.log('🔵 Sending user:', user);

    // ✅ navigate to loader with user data
    navigate('/loader', { state: { user } });
  };

  return (
    <div className="player-setup">
      <h2>Enter your username:</h2>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <h3>Select your avatar:</h3>
      <div className="avatar-options">
        {['🐸', '🦄', '👽'].map((icon) => (
          <button
            key={icon}
            className={selectedAvatar === icon ? 'selected' : ''}
            onClick={() => setSelectedAvatar(icon)}
          >
            {icon}
          </button>
        ))}
      </div>

      <button
        className="start-btn"
        disabled={!name || !selectedAvatar}
        onClick={handleSubmit}
      >
        Start Game
      </button>
    </div>
  );
}

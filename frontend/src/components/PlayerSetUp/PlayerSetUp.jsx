import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import './playersetup.css'
export default function PlayerSetup() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigate = useNavigate();

 const avatarList = [
  // Pixel-art characters
  { seed: 'Mario', style: 'pixel-art' },
  { seed: 'Link', style: 'pixel-art' },
  { seed: 'Luigi', style: 'pixel-art' },

  // Adventurer (D&D style fantasy faces)
  { seed: 'Archer', style: 'adventurer' },
  { seed: 'Mage', style: 'adventurer' },

  // Big-ears animal style
  { seed: 'Foxie', style: 'big-ears' },
  { seed: 'Bunny', style: 'big-ears' },

  // Bottts – robot faces
  { seed: 'BotX', style: 'bottts' },
  { seed: 'Cyborg', style: 'bottts' },

  // Funny emoji-style
  { seed: 'LOLFace', style: 'fun-emoji' },
];



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
  {avatarList.map(({ seed, style }) => {
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    return (
      <button
        key={seed}
        className={selectedAvatar === avatarUrl ? 'selected' : ''}
        onClick={() => setSelectedAvatar(avatarUrl)}
        title={seed} // Tooltip
      >
        <img src={avatarUrl} alt={seed} className="avatar-img" />
      </button>
    );
  })}
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

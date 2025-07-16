import { useEffect, useState } from 'react';
import './memoryboard.css';
import socket from '../../socket/socket';

const IMAGES = [
  '🍕', '🍔', '🍟', '🌮', '🍣',
  '🎮', '🧠', '🐉', '🪐', '👾',
  '⚔️', '🏰', '🦄', '🐸', '🧙‍♂️'
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MemoryBoard({ user, opponent }) {
      const roomId =  user.roomId;
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [scores, setScores] = useState({ [user.name]: 0, [opponent.name]: 0 });
  const [currentTurn, setCurrentTurn] = useState(null); // first turn by user

  if (!user?.socketId || !opponent?.socketId || !opponent?.roomId) {
  return <p style={{ color: 'white' }}>⛔ Waiting for full player info...</p>;
}
if (!user?.socketId || !opponent?.socketId || !user?.roomId) {
  console.warn('🚫 Not ready to mount MemoryBoard listeners');
  return <p style={{ color: 'white' }}>⏳ Initializing game...</p>;
}



useEffect(() => {
  console.log('🧠 MemoryBoard mounted!');
  console.log('✅ user.socketId:', user.socketId);
  console.log('✅ opponent.socketId:', opponent.socketId);
  console.log('✅ roomId:', user.roomId);

  // 🔁 Register ALL socket listeners IMMEDIATELY
  socket.on('boardInit', (board) => {
    console.log('🧩 Received boardInit:', board);
    setCards(board);
  });

socket.on('opponentFlipCard', (cardId) => {
  console.log('🔁 Opponent flipped card:', cardId);
  setCards(prev =>
    prev.map(card =>
      card.id === cardId ? { ...card, flipped: true } : card
    )
  );
});


  socket.on('cardsMatched', ({ ids, player }) => {
    console.log('🎯 Matched cards:', ids, 'by', player);
    setCards(prev =>
      prev.map(card =>
        ids.includes(card.id) ? { ...card, matched: true, flipped: false } : card
      )
    );
    setScores(prev => ({
      ...prev,
      [player]: prev[player] + 1,
    }));
  });

  socket.onAny((event, ...args) => {
  console.log(`📡 Received event: ${event}`, args);
});
socket.on('unmatchCards', ({ ids }) => {
  console.log('❌ Unmatched cards, flipping back:', ids);
  setTimeout(() => {
    setCards(prev =>
      prev.map(card =>
        ids.includes(card.id)
          ? { ...card, flipped: false }
          : card
      )
    );
  }, 1000); // Delay to allow flip animation to play before flipping back
});
socket.on('switchTurn', (data) => {
  console.log('🔄 Switching turn to:', data.turn);
  setCurrentTurn(data.turn);  // ✅ Now it works
});



  // 🔁 Only 1 player creates board AFTER listeners are ready
  if (user.socketId < opponent.socketId) {
    const board = shuffle([...IMAGES, ...IMAGES]).map((value, i) => ({
      id: i,
      value,
      flipped: false,
      matched: false,
    }));
    setCards(board);
    console.log('🧠 Generating + sending board to room:', user.roomId);
    socket.emit('initBoard', { board, roomId: user.roomId });
    socket.emit('switchTurn', { roomId, turn: user.socketId }); 
  }

  return () => {
    socket.off('boardInit');
    socket.off('opponentFlipCard');
    socket.off('cardsMatched');
      socket.off('unmatchCards'); // ✅ cleanup
  };
}, [user,opponent]);


  const flipCardLocally = (id) => {
    setCards(prev =>
      prev.map(card => (card.id === id ? { ...card, flipped: !card.flipped } : card))
    );
  };

const handleFlip = (id) => {
  if (currentTurn !== user.socketId) return; // Not your turn

  flipCardLocally(id);
  socket.emit('flipCard', { cardId: id, roomId });
  console.log(`🌀 ${user.name} clicked card ID ${id}`);

  const newFlipped = [...flipped, id];
  setFlipped(newFlipped);

  if (newFlipped.length === 2) {
    const [a, b] = newFlipped;
    const cardA = cards.find((c) => c.id === a);
    const cardB = cards.find((c) => c.id === b);

    if (cardA.value === cardB.value) {
      socket.emit('matchCards', { ids: [a, b], roomId, player: user.name });
      // stay on same turn
    } else {
      socket.emit('unmatchCards', { ids: [a, b], roomId });
      setTimeout(() => {
        setCards(prev =>
          prev.map(card =>
            card.id === a || card.id === b ? { ...card, flipped: false } : card
          )
        );
        setCurrentTurn(opponent.socketId); // switch turn after mismatch
        socket.emit('switchTurn', { roomId, turn: opponent.socketId });
      }, 1000);
    }

    setTimeout(() => setFlipped([]), 1000);
  }
};


  return (
    <div>
      <p style={{ color: '#fff', textAlign: 'center' }}>
  {currentTurn === null
    ? '⏳ Waiting for first turn...'
    : currentTurn === user.socketId
      ? "🎯 Your turn"
      : `🎯 ${opponent.name}'s turn...`}
</p>


      <div className="memory-board">
        {cards.map((card) => (
          <div
  key={card.id}
  className={`card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
  onClick={() => !card.flipped && !card.matched && handleFlip(card.id)}
>
  <div className="flip-inner">
    <div className="flip-front"></div>
    <div className="flip-back">{card.value}</div>
  </div>
</div>

        ))}
      </div>

     <div className="scoreboard">
  <div className={`player-block ${currentTurn === user.socketId ? 'active-turn' : ''}`}>
    <img src={user.avatar} alt={user.name} width="40" height="40" />
    <p>{user.name}: {scores[user.name]}</p>
  </div>
  <div className={`player-block ${currentTurn === opponent.socketId ? 'active-turn' : ''}`}>
    <img src={opponent.avatar} alt={opponent.name} width="40" height="40" />
    <p>{opponent.name}: {scores[opponent.name]}</p>
  </div>
</div>

    </div>
  );
}

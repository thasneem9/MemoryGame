import { useEffect, useState } from 'react';
import './memoryboard.css';

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

export default function MemoryBoard() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const all = shuffle([...IMAGES, ...IMAGES]).map((value, i) => ({
      id: i,
      value,
      flipped: false,
      matched: false,
    }));
    setCards(all);
  }, []);

  const handleFlip = (id) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, flipped: !card.flipped } : card))
    );
  };

  return (
    <div className="memory-board">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`card ${card.flipped ? 'flipped' : ''}`}
          onClick={() => handleFlip(card.id)}
        >
          <div className="flip-inner">
            <div className="flip-front"></div>
            <div className="flip-back">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

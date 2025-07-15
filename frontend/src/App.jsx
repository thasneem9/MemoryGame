// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import PlayerSetup from './components/PlayerSetUp/PlayerSetUp';
import Loader from './components/Loader/Loader';
import Play from './components/GameBoard/Play';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<PlayerSetup />} />
        <Route path="/loader" element={<Loader />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

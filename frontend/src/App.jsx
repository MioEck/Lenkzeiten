import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import Regelungen from './pages/Regelungen.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="regelungen" element={<Regelungen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

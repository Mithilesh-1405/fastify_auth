import './App.css';
import Homepage from './components/Homepage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Content from './pages/Content';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/protected' element={<Content />} />
      </Routes>
    </div>
  );
}

export default App;

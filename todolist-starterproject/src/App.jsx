import './App.css';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
// import UserPage from './pages/UserPage';
import TodoPage from './pages/TodoPage';
import NavBar from './components/NavBar';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<TodoPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

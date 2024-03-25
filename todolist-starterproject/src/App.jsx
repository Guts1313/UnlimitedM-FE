import './App.css';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
// import UserPage from './pages/UserPage';
import TodoPage from './pages/TodoPage';
import NavBar from './components/NavBar';
import UserPage from "./pages/UserPage.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<TodoPage />} />
            <Route path="/users" element={<UserPage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;

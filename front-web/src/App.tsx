// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import DetectionResultPage from "./pages/DetectionResultPage"
import DetectionProcessPage from "./pages/DetectionProcessPage";
import LoginPage from "./pages/Login";
import Setting from "./pages/Setting";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/detection" element={<DetectionProcessPage />} />
                <Route path="/data" element={<DetectionResultPage />} />
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/about" element={<About />} />
                <Route path="/settings" element={<Setting />} />
            </Routes>
        </Router>
    );
}

export default App;

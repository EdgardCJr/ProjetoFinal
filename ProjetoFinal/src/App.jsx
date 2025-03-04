import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // useLocation importado aqui
import { useContext } from "react";
import NotesPage from "./pages/NotesPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import NotesProvider from "./context/NotesContext";
import { UserContext, UserProvider } from "./context/NotesContext";
import './index.css';

function App() {
    return (
        <div id="app">
            <UserProvider>
                <NotesProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/" element={<><Navbar /><NotesPage /></>} /> 
                            <Route path="/users" element={<><Navbar /><UsersPage /></>} /> 
                        </Routes>
                    </Router>
                </NotesProvider>
            </UserProvider>
        </div>
    );
}

function Navbar() {
    const { current: user, logout } = useContext(UserContext);
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-buttons">
                {location.pathname !== "/login" && user ? (
                    <>
                        <span className="navbar-user">{user?.email}</span>
                        <button type="button" className="navbar-button" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : null}
            </div>
        </nav>
    );
}

export default App;

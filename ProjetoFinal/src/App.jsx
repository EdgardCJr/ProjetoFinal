import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import NotesPage from "./pages/NotesPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UserPage";
import NotesProvider, { NotesContext } from "./context/NotesContext";

function App() {
    return (
        <div id="app">
            <NotesProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/" element={<NotesPage />} />
                    </Routes>
                </Router>
            </NotesProvider>
        </div>
    );
}

function Navbar() {
    const { user, logout } = useContext(NotesContext);

    return (
        <nav>
            <a href="/">Home</a>
            <div>
                {user ? (
                    <>
                        <span>{user.email}</span>
                        <button type="button" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <a href="/login">Login</a>
                )}
            </div>
        </nav>
    );
}

export default App;
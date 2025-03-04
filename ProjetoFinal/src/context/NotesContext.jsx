import { createContext, useState, useEffect } from "react";
import Spinner from "../icons/Spinner";
import { db, auth } from "../appwrite/databases";

export const NotesContext = createContext();

const NotesProvider = ({ children }) => {
    const [selectedNote, setSelectedNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await db.notes.list();
        setNotes(response.documents);
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const session = await auth.login(email, password);
            setUser(session.userId);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = async () => {
        try {
            await auth.logout();
            setUser(null);
            setNotes([]);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const createUser = async (email, password, name) => {
        try {
            const user = await auth.createUser(email, password, name);
            setUser(user);
        } catch (error) {
            console.error("User creation failed", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await db.user.list();
            setUsers(response.documents);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const contextData = { notes, setNotes, selectedNote, setSelectedNote, login, logout, createUser, users, fetchUsers, user };

    return (
        <NotesContext.Provider value={contextData}>
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                    }}
                >
                    <Spinner size="100" />
                </div>
            ) : (
                children
            )}
        </NotesContext.Provider>
    );
};

export default NotesProvider;
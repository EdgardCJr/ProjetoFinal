import { createContext, useState, useEffect, useContext } from "react";
import Spinner from "../icons/Spinner";
import { db } from "../appwrite/databases";
import { ID } from "appwrite";
import { account } from "../appwrite/config";

export const NotesContext = createContext();

export const UserContext = createContext();


export function useUser() {
    return useContext(UserContext);
  }
  
  export function UserProvider(props) {
    const [user, setUser] = useState(null);

    async function login(email, password) {
      const loggedIn = await account.createEmailPasswordSession(email, password);
      setUser(loggedIn);
      window.location.replace("/");
    }
  
    async function logout() {
      await account.deleteSession("current");
      setUser(null);
      window.location.replace("/login");
    }
  
    async function register(email, password) {
      await account.create(ID.unique(), email, password);
      await login(email, password);
    }
    
    useEffect(() => {
    }, []);
  
    return (
      <UserContext.Provider value={{ current: user, login, logout, register }}>
        {props.children}
      </UserContext.Provider>
    );
  };

const NotesProvider = ({ children }) => {
    const [selectedNote, setSelectedNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await db.notes.list();
        setNotes(response.documents);
        setLoading(false);
    };

    const contextData = { notes, setNotes, selectedNote, setSelectedNote };

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
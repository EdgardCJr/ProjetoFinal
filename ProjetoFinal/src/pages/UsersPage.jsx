import { useContext, useEffect, useState } from "react";
import { NotesContext } from "../context/NotesContext";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
    const { users, fetchUsers, user, loading } = useContext(NotesContext);
    const navigate = useNavigate();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!user && !loading) {
            setRedirect(true);
        } else if (user) {
            fetchUsers();
        }
    }, [user, loading, fetchUsers]);

    useEffect(() => {
        if (redirect) {
            navigate("/login");
        }
    }, [redirect, navigate]);

    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator
    }

    return (
        <div className="users-page">
            <h2>Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.$id}>{user.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default UsersPage;

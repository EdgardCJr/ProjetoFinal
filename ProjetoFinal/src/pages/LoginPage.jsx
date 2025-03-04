import { useState } from "react";
import { useUser } from "../context/NotesContext";

export function Login() {
  const user = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false); 

  const handleRegister = async () => {
    try {
      await user.register(email, password);
      setRegistrationSuccess(true); 
      setTimeout(() => setRegistrationSuccess(false), 5000); 
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      alert("Erro ao registrar. Verifique seus dados.");
    }
  };

  return (
    <section className="login-container">
      <h1>Login ou Registro</h1>
      {registrationSuccess && (
        <p style={{ color: "green" }}>Usuário registrado com sucesso!</p>
      )} 
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <div>
          <button
            className="button"
            type="button"
            onClick={() => user.login(email, password)}
          >Login</button>
          <button
            className="button"
            type="button"
            onClick={handleRegister}
          >Registrar</button>
        </div>
      </form>
    </section>
  );
}

export default Login;
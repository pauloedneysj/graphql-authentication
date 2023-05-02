import reactLogo from "../assets/react.svg";
import "./SignInPage.css";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type User = {
  email: string;
  password: string;
};

type LoginResponse = {
  login: {
    token: string;
  };
};

const GET_LOGIN = gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default function SignIn() {
  const [signIn] = useMutation(GET_LOGIN, {
    onCompleted: (data: LoginResponse) => {
      localStorage.setItem("token", data.login.token);
      login();
    },
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const [user, setUser] = useState<User>();
  const [disabled, setDisabled] = useState(Boolean);

  useEffect(() => {
    setDisabled(user?.email === "" || user?.password === "");
  }, [user]);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn({
            variables: { ...user },
          });
        }}
      >
        <div>
          <label>Email</label>
        </div>
        <div>
          <input
            type="email"
            placeholder="Digite seu email"
            onChange={(e) => {
              setUser({
                ...user,
                email: e.target.value,
                password: user?.password ?? "",
              });
            }}
          />
        </div>
        <div>
          <label>Senha</label>
        </div>
        <div>
          <input
            type="password"
            placeholder="Digite sua senha"
            onChange={(e) => {
              setUser({
                ...user,
                email: user?.email ?? "",
                password: e.target.value,
              });
            }}
          />
        </div>
        <div className="card">
          <button disabled={disabled}>Entrar</button>
        </div>
      </form>
      <a onClick={() => navigate("/signup")}>Cadastrar-se</a>
    </div>
  );
}

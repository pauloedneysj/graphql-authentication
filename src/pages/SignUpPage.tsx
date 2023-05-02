import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./SignUpPage.css";

type User = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SignUpResponse = {
  signUp: {
    token: string;
  };
};

const GET_SIGNUP = gql`
  mutation SignUp(
    $email: String
    $password: String
    $firstName: String
    $lastName: String
  ) {
    signUp(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      token
    }
  }
`;

export default function SignUp() {
  const [addUser] = useMutation(GET_SIGNUP, {
    onCompleted: (data: SignUpResponse) => {
      localStorage.setItem("token", data.signUp.token);
      login();
    },
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const [newUser, setNewUser] = useState<User>();
  const [disabled, setDisabled] = useState(Boolean);

  useEffect(() => {
    setDisabled(
      newUser?.email === "" ||
        newUser?.password === "" ||
        newUser?.firstName === "" ||
        newUser?.lastName === ""
    );
  }, [{ ...newUser }]);

  return (
    <div className="App">
      <h1>Cadastro</h1>
      <form
        onSubmit={(e) => {
          addUser({ variables: { ...newUser } });
          e.preventDefault();
        }}
      >
        <div>
          <label htmlFor="">Email</label>
        </div>
        <div>
          <input
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: e.target.value,
                password: newUser?.password ?? "",
                firstName: newUser?.firstName ?? "",
                lastName: newUser?.lastName ?? "",
              })
            }
            type="email"
            placeholder="Digite seu email"
          />
        </div>
        <div>
          <label htmlFor="">Senha</label>
        </div>
        <div>
          <input
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: newUser?.email ?? "",
                password: e.target.value,
                firstName: newUser?.firstName ?? "",
                lastName: newUser?.lastName ?? "",
              })
            }
            type="password"
            placeholder="Digite sua senha"
          />
        </div>
        <div>
          <label htmlFor="">Nome</label>
        </div>
        <div>
          <input
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: newUser?.email ?? "",
                password: newUser?.password ?? "",
                firstName: e.target.value,
                lastName: newUser?.lastName ?? "",
              })
            }
            type="text"
            placeholder="Digite seu nome"
          />
        </div>
        <div>
          <label htmlFor="">Sobrenome</label>
        </div>
        <div>
          <input
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: newUser?.email ?? "",
                password: newUser?.password ?? "",
                firstName: newUser?.firstName ?? "",
                lastName: e.target.value,
              })
            }
            type="text"
            placeholder="Digite seu sobrenome"
          />
        </div>
        <div className="card">
          <button disabled={disabled}>Cadastrar</button>
        </div>
      </form>
      <a onClick={() => navigate("/signin")}>Entrar</a>
    </div>
  );
}

import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Context = {
  token: string | null;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Context>(null as never);

export const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = async () => {
    setToken(localStorage.getItem("token"));
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/signin", { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

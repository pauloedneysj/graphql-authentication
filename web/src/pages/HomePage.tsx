import { gql, NetworkStatus, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const GET_ME = gql`
  query Me {
    me {
      firstName
    }
  }
`;

export default function Home() {
  const { loading, networkStatus, data } = useQuery(GET_ME, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const { logout } = useAuth();

  return (
    <div>
      <h1>
        {loading || networkStatus === NetworkStatus.refetch
          ? "Aguardando..."
          : data.me.firstName
          ? `Bem vindo, ${data.me.firstName}!`
          : "Error"}
      </h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

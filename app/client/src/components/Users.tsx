import React from "react";
import { gql, useQuery } from "@apollo/client";

const FETCH_USERS = gql`
  query FETCH_USERS {
    users {
      id
      name
    }
  }
`;

interface User {
  name: string;
}


const Users = () => {
  const { data, loading, error } = useQuery(FETCH_USERS);
  console.log(data);
  if (loading) return <p>Loading</p>;
  if (error) return <div>error</div>;
  return (
    <div>
      {data.users.map((user: User, i: number) => (
        <div key={i}>{user.name}</div>
      ))}
    </div>
  );
};

export default Users;

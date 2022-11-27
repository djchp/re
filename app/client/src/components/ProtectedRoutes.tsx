import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Spinner, Stack } from "@chakra-ui/react";

const AUTH_CHECK = gql`
  query ME {
    me {
      id
    }
  }
`;

interface Props {
  children?: React.ReactNode;
}

const ProtectedRoutes = ({ children }: Props) => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(AUTH_CHECK);
  // const pdata = {...data}
  // console.log(data);
  // console.log(loading);
  // console.log(error);
  // if (error) return <p>{error.message}</p>;
  // if (!data) return <Navigate to="/login" />;
  // console.log(error)
  if (loading)
    return (
      <Stack justify="center" align="center" w="100%" h="100vh">
        <Spinner />
      </Stack>
    );
  if (!data?.me || error) {
    navigate("/signup");
  }

  return <Outlet />;
};

export default ProtectedRoutes;

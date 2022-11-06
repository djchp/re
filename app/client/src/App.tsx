import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import Users from "./components/Users";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { setContext } from "@apollo/client/link/context";
import Auth from "./pages/Auth";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Profile from "./pages/Profile";
import Tweet from "./pages/Tweet";
import UserProfile from "./pages/UserProfile";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const authLink = setContext(async (req, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Routes>
          <Route path="/signup" element={<Auth />} />
          <Route path="/login" />
          <Route element={<ProtectedRoutes />}>
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:profileName" element={<UserProfile />} />
            <Route path="/tweet/:tid" element={<Tweet />} />
            <Route path="/" element={<Home />}/>
          </Route>
        </Routes>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;

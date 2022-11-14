import { gql, useMutation } from "@apollo/client";
import {
  Stack,
  Image,
  useMediaQuery,
  VStack,
  ButtonGroup,
  Button,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import logo from "../utils/ttr.png";
import { TextInput } from "../components/Input";
import Login from "../components/Login";

const SIGNUP_MUTATION = gql`
  mutation signup($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

const Auth = () => {
  const [isMobile] = useMediaQuery("(min-width: 600px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);

  const initialValues = {
    email: "",
    name: "",
    password: "",
    confirmPassowrd: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid").required("Email required"),
    password: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Password Required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
    name: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Name Required"),
  });

  return (
    <>
      <Heading display="flex" justifyContent="center" bg="gray.100">
        <div>Sign in to fake twitter!</div>
      </Heading>
      <Stack display="flex" flexDir={isMobile ? "row" : "column"} paddingTop="20px">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (value, { setSubmitting }) => {
            const vals = { ...value };
            setSubmitting(true);
            const response = await signup({
              variables: vals,
            });
            localStorage.setItem("token", response.data.signup.token);
            setSubmitting(false);
            navigate("/cp");
          }}
        >
          <VStack as={Form} m="auto" justify="center">
            <TextInput
              name="email"
              label="email"
              type="email"
              placeholder="email"
            />
            <TextInput
              name="name"
              label="name"
              type="name"
              placeholder="name"
            />
            <TextInput
              name="password"
              label="password"
              type="password"
              placeholder="password"
            />
            <TextInput
              name="confirmPassword"
              label="confirmPassword"
              type="password"
              placeholder="Confirm Password"
            />
            <ButtonGroup>
              <Button size="sm" type="submit">
                Create Account
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onOpen();
                }}
              >
                Have an account? Log in
              </Button>
            </ButtonGroup>
          </VStack>
        </Formik>
        <Image src={logo} boxSize="800px" objectFit="contain" />
      </Stack>
      <Login isOpen={isOpen} onClose={onClose}/>
    </>
  );
};

export default Auth;

import { gql, useMutation } from "@apollo/client";
import { Button, VStack } from "@chakra-ui/react";
import {  Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { TextInput } from "./Input";
import { useCallback } from "react";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
type Props = {
  isOpen: boolean;
  onClose: any;
};

const Login = ({ isOpen, onClose }: Props) => {
  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const navigate = useNavigate();
  const [login, {error, data}] = useMutation(LOGIN_MUTATION);
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid").required("Email required"),
    password: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Password Required"),
  });

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered={true} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Log in to fake twitter</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const response = await login({
              variables: values,
            });
            
            localStorage.setItem("token", response.data.login.token);
            setSubmitting(false);
            navigate("/");
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
              name="password"
              label="password"
              type="password"
              placeholder="password"
            />
            <ModalBody></ModalBody>

            <ModalFooter justifyContent="center">
              {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button> */}
              <Button variant="outline" color="red" type="submit">
                Login
              </Button>
            </ModalFooter>
          </VStack>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default Login;

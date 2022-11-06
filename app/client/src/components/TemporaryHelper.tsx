import { useMutation, gql } from "@apollo/client";
import { FETCH_ME } from "../pages/Profile";
import { Form, Formik } from "formik";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
} from "@chakra-ui/react";
import { TextInput } from "./Input";
import { useCallback } from "react";

const CREATE_PROFILE = gql`
  mutation createProfile(
    $description: String
    $photo: String
    $profileSite: String
  ) {
    createProfile(
      description: $description
      photo: $photo
      profileSite: $profileSite
    ) {
      id
    }
  }
`;

interface InitialValues {
  description: string;
  photo: string;
  profileSite: string;
}

type Props = {
  isOpen: boolean;
  onClose: any;
};

const TemporaryHelper = ({ isOpen, onClose }: Props) => {
  const [createProfile] = useMutation(CREATE_PROFILE, {
    refetchQueries: [{ query: FETCH_ME }],
  });
  const InitialValues: InitialValues = {
    description: "",
    photo: "",
    profileSite: "",
  };
  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered={true} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Profile</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={InitialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const response = await createProfile({
              variables: values,
            });

            setSubmitting(false);
          }}
        >
          <VStack as={Form} m="auto" justify="center">
            <TextInput
              name="description"
              label="description"
              type="description"
              placeholder="description"
            />
            <TextInput
              name="photo"
              label="photo"
              type="text"
              placeholder="photo"
            />
            <TextInput
              name="profileSite"
              label="profileSite"
              type="text"
              placeholder="profile site"
            />
            <ModalBody></ModalBody>

            <ModalFooter justifyContent="center">
              {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
        Close
      </Button> */}
              <Button variant="outline" color="red" type="submit">
                Create profile
              </Button>
            </ModalFooter>
          </VStack>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default TemporaryHelper;

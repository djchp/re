import { useMutation, gql, useQuery } from "@apollo/client";
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

const UPDATE_PROFILE = gql`
  mutation updateProfile(
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
  id: Number;
  description: string;
  photo: string;
  profileSite: string;
}

type Props = {
  isOpen: boolean;
  onClose: any;
};

const SetUpProfile = ({ isOpen, onClose }: Props) => {
  const { loading, error, data } = useQuery(FETCH_ME);

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: FETCH_ME }],
  });
  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  if (loading) return <p>Loading</p>;
 

  const InitialValues: InitialValues = {
    id: data.me.Profile?.id,
    description: data.me.Profile?.description,
    photo: data.me.Profile?.photo,
    profileSite: data.me.Profile?.profileSite,
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered={true} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set Up Profile</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={InitialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const response = await updateProfile({
              variables: values,
            });

            setSubmitting(false);
          }}
        >
          <VStack as={Form} m="auto" justify="center">
            <ModalBody>
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
            </ModalBody>

            <ModalFooter justifyContent="center">
              {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
        Close
      </Button> */}
              <Button variant="outline" color="red" type="submit">
                Set Up Profile
              </Button>
            </ModalFooter>
          </VStack>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default SetUpProfile;

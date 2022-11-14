import { useMutation, gql } from "@apollo/client";
import { Form, Formik } from "formik";
import {
  ModalFooter,
  ModalBody,
  Button,
  VStack,
  Stack,
} from "@chakra-ui/react";
import { TextInput } from "../components/Input";
import { useNavigate } from "react-router-dom";

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

const CreateProfile = () => {
  const navigate = useNavigate();

  const [createProfile] = useMutation(CREATE_PROFILE);
  const InitialValues: InitialValues = {
    description: "",
    photo: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
    profileSite: "",
  };

  return (
    <Stack w="100%" h="100%">
      <Formik
        initialValues={InitialValues}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await createProfile({
            variables: {...values, photo: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"},
          });
          if (response.data) navigate("/");
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
            name="profileSite"
            label="profileSite"
            type="text"
            placeholder="profile site"
          />
          <Button variant="outline" color="red" type="submit">
            Create profile
          </Button>
        </VStack>
      </Formik>
    </Stack>
  );
};

export default CreateProfile;

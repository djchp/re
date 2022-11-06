import { useMutation, gql } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Divider,
  Stack,
  Text,
} from "@chakra-ui/react";

import { TweetInput } from "./TweetInput";
import { FETCH_TWEETS } from "./Tweets";

export const CREATE_TWEET = gql`
  mutation createTweet($body: String) {
    createTweet(body: $body) {
      id
    }
  }
`;

interface InitialValues {
  body: string;
}

type Props = {
  isOpen: boolean;
  onClose: any;
};

const CreateTweetModal = ({ isOpen, onClose }: Props) => {
  const [createTweet] = useMutation(CREATE_TWEET, {refetchQueries: [{ query: FETCH_TWEETS }]});
  const InitialValues: InitialValues = {
    body: "",
  };

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered={true} size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="19px">
        <ModalCloseButton />
        <ModalHeader></ModalHeader>
        <Formik
          initialValues={InitialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const response = await createTweet({
              variables: values,
            });

            setSubmitting(false);
          }}
        >
          <Stack as={Form} justify="center">
            <Stack>
              <ModalBody>
                <TweetInput
                  name="body"
                  label="body"
                  type="body"
                  placeholder="What`s happening ?"
                />
              </ModalBody>
            </Stack>

            <Divider />
            <ModalFooter
              as={Flex}
              justifyContent="flex-end"
              w="100%"
              marginTop="0"
              padding="6px"
            >
              <Button
                variant="outline"
                color="white"
                backgroundColor="#1D9BF0"
                type="submit"
                borderRadius="full"
              >
                <Text as="b">Tweet</Text>
              </Button>
            </ModalFooter>
          </Stack>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default CreateTweetModal;

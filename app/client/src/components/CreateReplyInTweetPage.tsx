import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import { TWEET_QUERY } from "../pages/Tweet";
import { TweetInput } from "./TweetInput";

export const CREATE_REPLY = gql`
  mutation createReply($body: String!, $tweetId: Int!) {
    createReply(body: $body, tweetId: $tweetId) {
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
  tbody: string;
  name: string;
  photo: string;
  tid: number;
  aphoto: string;
  tTime: string;
};

const CreateReplyInTweetPage = ({
  isOpen,
  onClose,
  tbody,
  name,
  photo,
  tid,
  aphoto,
  tTime,
}: Props) => {
  const [createReply] = useMutation(CREATE_REPLY, {
    refetchQueries: [{query: TWEET_QUERY}]
  });

  const InitialValues: InitialValues = {
    body: "",
  };
  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);
  console.log(tid);
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered={true} size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="20px">
        <ModalCloseButton />
        <ModalHeader></ModalHeader>
        <HStack as={Flex} align="flex-start" padding="8px 24px 0px 24px">
          <Image src={photo} boxSize="40px" borderRadius="full" />
          <Stack
            paddingLeft="16px"
            as={Flex}
            justify="flex-start"
            w="100%"
            h="100%"
          >
            <HStack>
              <Text as="b">{name}</Text>
              <Text fontSize="12px">{tTime}</Text>
            </HStack>
            <Stack>
              <Text>{tbody}</Text>
            </Stack>
          </Stack>
        </HStack>
        <Stack>
          <HStack w="100%" h="30px" paddingLeft="24px">
            <Stack w="45px" h="40px" as={Flex} flexDir="column" align="center">
              <Stack
                backgroundColor="rgb(207, 217, 222)"
                w="2px"
                h="50px"
              ></Stack>
            </Stack>
            <Stack w="100%" paddingLeft="16px">
              <Text>Replying to placeholder profile link {name}</Text>
            </Stack>
          </HStack>
        </Stack>
        <Formik
          initialValues={InitialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await createReply({
              variables: { ...values, tweetId: tid },
            });
            
            setSubmitting(false);
          }}
        >
          <Stack as={Form} justify="center">
            <Stack>
              <ModalBody>
                <HStack as={Flex} align="flex-start">
                  <Image src={photo} boxSize="40px" borderRadius="full" />
                  <TweetInput
                    name="body"
                    label="body"
                    type="body"
                    placeholder="Tweet your reply"
                  />
                </HStack>
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
                <Text as="b">Reply</Text>
              </Button>
            </ModalFooter>
          </Stack>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default CreateReplyInTweetPage;

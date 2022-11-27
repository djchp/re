import { gql, useMutation, useQuery } from "@apollo/client";
import { ArrowBackIcon } from "@chakra-ui/icons";
import CommentIcon from "@mui/icons-material/Comment";

import {
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { formatDistance, formatRelative, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateReply, { CREATE_REPLY } from "../components/CreateReply";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";
import Navbar from "../components/Navbar";
import { FETCH_ME } from "./Profile";
import { TweetInput } from "../components/TweetInput";
import { Form, Formik } from "formik";
import CreateReplyInTweetPage from "../components/CreateReplyInTweetPage";
import Trends from "../components/Trends";

export const TWEET_QUERY = gql`
  query tweet($tweetId: Int) {
    tweet(id: $tweetId) {
      id
      createdAt
      body
      author {
        name
        Profile {
          photo
        }
      }
      replies {
        id
        createdAt
        body
        user {
          id
          name
          Profile {
            photo
          }
        }
      }
      likes {
        id
        user {
          name
        }
      }
    }
  }
`;
interface likedTweet {
  id: number;
  tweet: {
    id: number;
    body: string;
  };
}
type defaultValue = {
  aphoto: string;
  name: string;
  photo: string;
  tTime: string;
  tbody: string;
  tid: number;
};
interface InitialValues {
  body: string;
}

interface Reply {
  id: number;
  body: string;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    Profile: {
      photo: string;
    };
  };
}

const Tweet = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tid } = useParams();
  const { data, loading, error } = useQuery(TWEET_QUERY, {
    variables: { tweetId: parseInt(tid!) },
    fetchPolicy: "cache-and-network",
  });
  const InitialValues: InitialValues = {
    body: "",
  };
  const [createReply] = useMutation(CREATE_REPLY, {
    refetchQueries: [
      { query: TWEET_QUERY, variables: { tweetId: parseInt(tid!) } },
    ],
  });
  const {
    data: meData,
    loading: meLoading,
    error: meError,
  } = useQuery(FETCH_ME);
  const [isLargerThan1020] = useMediaQuery("(min-width: 1020px)");
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<defaultValue>({
    aphoto: "",
    name: "",
    photo: "",
    tTime: "",
    tbody: "",
    tid: 0,
  });

  if (loading)
    return (
      <Stack justify="center" align="center" w="100%" h="100vh">
        <Spinner />
      </Stack>
    );

  if (meLoading)
    return (
      <Stack justify="center" align="center" w="100%" h="100vh">
        <Spinner />
      </Stack>
    );
  // console.log(data);
  if (isLargerThan1020) {
    return (
      <>
        <Grid
          templateAreas={`"Navbar Main Trends"`}
          gridTemplateColumns={`0.7fr 549px 0.7fr`}
          h="100vh"
        >
          <GridItem area={`Navbar`} pl="2">
            <Navbar />
          </GridItem>
          <GridItem
            area={`Main`}
            borderRight="1px solid rgba(235,235,235,0.61)"
            borderLeft="1px solid rgba(235,235,235,0.61)"
          >
            <Stack
              as={Flex}
              flexDir="row"
              marginLeft="10px"
              position="sticky"
              top="0"
              backgroundColor="white"
              opacity="0.9"
              cursor="pointer"
              alignItems="center"
            >
              <IconButton
                aria-label="Heading"
                icon={<ArrowBackIcon />}
                onClick={() => {
                  navigate(-1);
                }}
                borderRadius="full"
                marginTop="8px"
                backgroundColor="transparent"
              />

              <Stack
                marginLeft="10px"
                position="sticky"
                top="0"
                backgroundColor="rgba(255, 255, 255, 0.85)"
                cursor="pointer"
                backdropFilter="blur(12px)"
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                <Heading size="md" padding="10px">
                  Tweet
                </Heading>
              </Stack>
            </Stack>
            <Stack as={Flex} flexDir="column">
              <Stack padding="0 16px 0 16px">
                <HStack>
                  <Image
                    src={data.tweet.author.Profile.photo}
                    alt="Author photo"
                    boxSize="50px"
                    borderRadius="full"
                  />
                  <Stack as={Flex} flexDir="column">
                    <Text
                      as="b"
                      fontSize="17px"
                      onClick={() => {
                        navigate(`/profile/${data.tweet.author.name}`);
                      }}
                      cursor="pointer"
                    >
                      {data.tweet.author.name}
                    </Text>
                    <Text fontSize="13px">@{data.tweet.author.name}</Text>
                  </Stack>
                </HStack>
                <Stack marginBottom="20px">
                  <Text fontSize="23px">{data.tweet.body}</Text>
                </Stack>
                <Stack borderBottom="1px solid rgb(239, 243, 244)">
                  <Text color="rgb(83, 100, 113)" margin="10px 0 10px 0">
                    {formatRelative(
                      subDays(new Date(data.tweet.createdAt), 3),
                      new Date()
                    )}
                  </Text>
                </Stack>
                <HStack
                  borderBottom="1px solid rgb(239, 243, 244)"
                  paddingBottom="10px"
                >
                  <Text as="b">{data.tweet.likes.length}</Text>
                  <Text>Likes</Text>
                </HStack>
                <HStack
                  borderBottom="1px solid rgb(239, 243, 244)"
                  as={Flex}
                  justify="space-around"
                >
                  <Stack
                    padding="4px"
                    borderRadius="full"
                    onClick={() => {
                      onOpen();
                      setModalState({
                        photo: meData.me.Profile?.photo,
                        name: data.tweet.author.name,
                        tid: Number(tid),
                        tbody: data.tweet.body,
                        aphoto: data.tweet.author.Profile.photo,
                        tTime: formatDistance(
                          subDays(new Date(data.tweet.createdAt), 0),
                          new Date()
                        ),
                      });
                    }}
                    _hover={{
                      color: "rgb(66, 179, 224)",
                      backgroundColor: "rgb(178, 230, 251)",
                    }}
                  >
                    <CommentIcon />
                  </Stack>
                  <Stack _hover={{ color: "rgb(249, 24, 128)" }}>
                    {meData.me.likedTweets
                      .map((tweett: likedTweet) => tweett.tweet.id)
                      .includes(Number(tid)) ? (
                      <HStack>
                        <DeleteButton
                          id={
                            meData.me.likedTweets.filter(
                              (l: any) => l.tweet.id === Number(tid)
                            )[0].id
                          }
                        />
                        <Text color="rgb(249, 24, 128)">
                          {data.tweet.likes.length}
                        </Text>
                      </HStack>
                    ) : (
                      <HStack>
                        <LikeButton id={Number(tid)} />{" "}
                        <Text>{data.tweet.likes.length}</Text>
                      </HStack>
                    )}
                  </Stack>
                </HStack>
              </Stack>
            </Stack>
            <Stack borderBottom="1px solid rgb(239, 243, 244)">
              <Formik
                initialValues={InitialValues}
                onSubmit={async (values, { setSubmitting,resetForm }) => {
                  setSubmitting(true);
                  await createReply({
                    variables: { ...values, tweetId: Number(tid) },
                  });

                  setSubmitting(false);
                  resetForm({values: InitialValues})
                }}
              >
                <Stack as={Form}>
                  <Stack>
                    <Stack>
                      <HStack
                        as={Flex}
                        padding="12px 16px 0 16px"
                        align="flex-start"
                      >
                        <Stack as={Flex} w="60px" h="100%" flexGrow="0">
                          <Image
                            src={meData.me.Profile?.photo}
                            boxSize="50px"
                            borderRadius="full"
                          />
                        </Stack>
                        <TweetInput
                          name="body"
                          label="body"
                          type="body"
                          placeholder="Tweet your reply"
                        />
                      </HStack>
                      <Stack
                        as={Flex}
                        align="flex-end"
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
                          w="fit-content"
                        >
                          <Text as="b">Reply</Text>
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Formik>
            </Stack>
            <Stack>
              {data.tweet.replies?.map((reply: Reply, i: number) => (
                <Stack
                  w="100%"
                  borderBottom="1px solid rgb(239, 243, 244)"
                  key={i}
                  marginTop="0.1rem"
                  padding="12px 16px 0 16px"
                >
                  <HStack as={Flex} align="flex-start">
                    <Image
                      src={reply.user.Profile.photo}
                      boxSize="40px"
                      borderRadius="full"
                    />

                    <VStack w="100%">
                      <HStack as={Flex} align="flex-start" w="100%">
                        <Text as="b">{reply.user.name}</Text>
                        <Text>
                          {formatDistance(
                            subDays(new Date(reply.createdAt), 0),
                            new Date()
                          )}{" "}
                          ago
                        </Text>
                      </HStack>
                      <Stack as={Flex} align="flex-start" w="100%">
                        <Text>Replying to @{data.tweet.author.name}</Text>
                      </Stack>
                      <Stack as={Flex} justify="flex-start" w="100%">
                        <Text overflowWrap="anywhere">{reply.body}</Text>
                      </Stack>
                      <HStack w="100%" as={Flex} justify="space-around">
                        {/* <Stack
                          padding="4px"
                          borderRadius="full"
                          onClick={() => {
                            onOpen();
                            setModalState({
                              photo: meData.me.Profile?.photo,
                              name: tweet.author.name,
                              tid: tweet.id,
                              tbody: tweet.body,
                              aphoto: tweet.author.Profile.photo,
                              tTime: formatDistance(
                                subDays(new Date(tweet.createdAt), 0),
                                new Date()
                              ),
                            });
                          }}
                          _hover={{
                            color: "rgb(66, 179, 224)",
                            backgroundColor: "rgb(178, 230, 251)",
                          }}
                        >
                          <CommentIcon />
                        </Stack> */}
                      </HStack>
                    </VStack>
                  </HStack>
                </Stack>
              ))}
              <CreateReplyInTweetPage
                isOpen={isOpen}
                onClose={onClose}
                photo={modalState.photo}
                name={modalState.name}
                tid={modalState.tid}
                tbody={modalState.tbody}
                aphoto={modalState.aphoto}
                tTime={modalState.tTime}
              />
            </Stack>
          </GridItem>
          <GridItem area={`Trends`}>
            <Trends />
          </GridItem>
        </Grid>
      </>
    );
  } else {
    return (
      <Grid
        templateAreas={`"Navbar Main "`}
        gridTemplateColumns={`0.6fr 4fr `}
        h="100vh"
      >
        <GridItem area={`Navbar`} pl="2">
          <Navbar />
        </GridItem>
        <GridItem
          area={`Main`}
          borderRight="1px solid rgba(235,235,235,0.61)"
          borderLeft="1px solid rgba(235,235,235,0.61)"
        >
          <Stack
            as={Flex}
            flexDir="row"
            marginLeft="10px"
            position="sticky"
            top="0"
            backgroundColor="white"
            opacity="0.9"
            cursor="pointer"
            alignItems="center"
          >
            <IconButton
              aria-label="Heading"
              icon={<ArrowBackIcon />}
              onClick={() => {
                navigate(-1);
              }}
              borderRadius="full"
              marginTop="8px"
              backgroundColor="transparent"
            />

            <Stack
              marginLeft="10px"
              position="sticky"
              top="0"
              backgroundColor="rgba(255, 255, 255, 0.85)"
              cursor="pointer"
              backdropFilter="blur(12px)"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <Heading size="md" padding="10px">
                Tweet
              </Heading>
            </Stack>
          </Stack>
          <Stack as={Flex} flexDir="column">
            <Stack padding="0 16px 0 16px">
              <HStack>
                <Image
                  src={data.tweet.author.Profile.photo}
                  alt="Author photo"
                  boxSize="50px"
                  borderRadius="full"
                />
                <Stack as={Flex} flexDir="column">
                  <Text
                    as="b"
                    fontSize="17px"
                    onClick={() => {
                      navigate(`/profile/${data.tweet.author.name}`);
                    }}
                    cursor="pointer"
                  >
                    {data.tweet.author.name}
                  </Text>
                  <Text fontSize="13px">@{data.tweet.author.name}</Text>
                </Stack>
              </HStack>
              <Stack marginBottom="20px">
                <Text fontSize="23px">{data.tweet.body}</Text>
              </Stack>
              <Stack borderBottom="1px solid rgb(239, 243, 244)">
                <Text color="rgb(83, 100, 113)" margin="10px 0 10px 0">
                  {formatRelative(
                    subDays(new Date(data.tweet.createdAt), 3),
                    new Date()
                  )}
                </Text>
              </Stack>
              <HStack
                borderBottom="1px solid rgb(239, 243, 244)"
                paddingBottom="10px"
              >
                <Text as="b">{data.tweet.likes.length}</Text>
                <Text>Likes</Text>
              </HStack>
              <HStack
                borderBottom="1px solid rgb(239, 243, 244)"
                as={Flex}
                justify="space-around"
              >
                <Stack
                  padding="4px"
                  borderRadius="full"
                  onClick={() => {
                    onOpen();
                    setModalState({
                      photo: meData.me.Profile?.photo,
                      name: data.tweet.author.name,
                      tid: Number(tid),
                      tbody: data.tweet.body,
                      aphoto: data.tweet.author.Profile.photo,
                      tTime: formatDistance(
                        subDays(new Date(data.tweet.createdAt), 0),
                        new Date()
                      ),
                    });
                  }}
                  _hover={{
                    color: "rgb(66, 179, 224)",
                    backgroundColor: "rgb(178, 230, 251)",
                  }}
                >
                  <CommentIcon />
                </Stack>
                <Stack _hover={{ color: "rgb(249, 24, 128)" }}>
                  {meData.me.likedTweets
                    .map((tweett: likedTweet) => tweett.tweet.id)
                    .includes(Number(tid)) ? (
                    <HStack>
                      <DeleteButton
                        id={
                          meData.me.likedTweets.filter(
                            (l: any) => l.tweet.id === Number(tid)
                          )[0].id
                        }
                      />
                      <Text color="rgb(249, 24, 128)">
                        {data.tweet.likes.length}
                      </Text>
                    </HStack>
                  ) : (
                    <HStack>
                      <LikeButton id={Number(tid)} />{" "}
                      <Text>{data.tweet.likes.length}</Text>
                    </HStack>
                  )}
                </Stack>
              </HStack>
            </Stack>
          </Stack>
          <Stack borderBottom="1px solid rgb(239, 243, 244)">
            <Formik
              initialValues={InitialValues}
              onSubmit={async (values, { setSubmitting,resetForm }) => {
                setSubmitting(true);
                await createReply({
                  variables: { ...values, tweetId: Number(tid) },
                });

                setSubmitting(false);
                resetForm({values: InitialValues})
              }}
            >
              <Stack as={Form}>
                <Stack>
                  <Stack>
                    <HStack
                      as={Flex}
                      padding="12px 16px 0 16px"
                      align="flex-start"
                    >
                      <Stack as={Flex} w="60px" h="100%" flexGrow="0">
                        <Image
                          src={meData.me.Profile?.photo}
                          boxSize="50px"
                          borderRadius="full"
                        />
                      </Stack>
                      <TweetInput
                        name="body"
                        label="body"
                        type="body"
                        placeholder="Tweet your reply"
                      />
                    </HStack>
                    <Stack
                      as={Flex}
                      align="flex-end"
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
                        w="fit-content"
                      >
                        <Text as="b">Reply</Text>
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Formik>
          </Stack>
          <Stack>
            {data.tweet.replies?.map((reply: Reply, i: number) => (
              <Stack
                w="100%"
                borderBottom="1px solid rgb(239, 243, 244)"
                key={i}
                marginTop="0.1rem"
                padding="12px 16px 0 16px"
              >
                <HStack as={Flex} align="flex-start">
                  <Image
                    src={reply.user.Profile.photo}
                    boxSize="40px"
                    borderRadius="full"
                  />

                  <VStack w="100%">
                    <HStack as={Flex} align="flex-start" w="100%">
                      <Text as="b">{reply.user.name}</Text>
                      <Text>
                        {formatDistance(
                          subDays(new Date(reply.createdAt), 0),
                          new Date()
                        )}{" "}
                        ago
                      </Text>
                    </HStack>
                    <Stack as={Flex} align="flex-start" w="100%">
                      <Text>Replying to @{data.tweet.author.name}</Text>
                    </Stack>
                    <Stack as={Flex} justify="flex-start" w="100%">
                      <Text overflowWrap="anywhere">{reply.body}</Text>
                    </Stack>
                    <HStack w="100%" as={Flex} justify="space-around">
                      {/* <Stack
                          padding="4px"
                          borderRadius="full"
                          onClick={() => {
                            onOpen();
                            setModalState({
                              photo: meData.me.Profile?.photo,
                              name: tweet.author.name,
                              tid: tweet.id,
                              tbody: tweet.body,
                              aphoto: tweet.author.Profile.photo,
                              tTime: formatDistance(
                                subDays(new Date(tweet.createdAt), 0),
                                new Date()
                              ),
                            });
                          }}
                          _hover={{
                            color: "rgb(66, 179, 224)",
                            backgroundColor: "rgb(178, 230, 251)",
                          }}
                        >
                          <CommentIcon />
                        </Stack> */}
                    </HStack>
                  </VStack>
                </HStack>
              </Stack>
            ))}
            <CreateReplyInTweetPage
              isOpen={isOpen}
              onClose={onClose}
              photo={modalState.photo}
              name={modalState.name}
              tid={modalState.tid}
              tbody={modalState.tbody}
              aphoto={modalState.aphoto}
              tTime={modalState.tTime}
            />
          </Stack>
        </GridItem>
      </Grid>
    );
  }
};

export default Tweet;

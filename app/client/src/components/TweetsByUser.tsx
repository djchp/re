import { useQuery, gql } from "@apollo/client";
import {
  Flex,
  HStack,
  Image,
  Link,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { formatDistance, subDays } from "date-fns";
import CommentIcon from "@mui/icons-material/Comment";
import LikeButton from "./LikeButton";
import { FETCH_ME } from "../pages/Profile";
import DeleteButton from "./DeleteButton";
import CreateReply from "./CreateReply";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

export const FETCH_USERTWEETS = gql`
  query FETCH_USERTWEETS($tweetsbyuserId: Int) {
    tweetsbyuser(id: $tweetsbyuserId) {
      id
      createdAt
      body
      likes {
        id
      }
      author {
        name
        id
        Profile {
          id
          photo
        }
      }
    }
  }
`;
interface Tweet {
  id: number;
  createdAt: Date;
  body: string;
  likes: [];
  author: {
    name: string;
    id: number;
    Profile: {
      photo: string;
    };
  };
}

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
type Props = {
  userId: number;
};

const TweetsByUser = ({ userId }: Props) => {
  const { data, loading, error } = useQuery(FETCH_USERTWEETS, {
    variables: {
      tweetsbyuserId: userId,
    },
  });
  const { data: lData, loading: lLoading, error: lError } = useQuery(FETCH_ME);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  if (lLoading)
    return (
      <Stack justify="center" align="center" w="100%" h="100vh">
        <Spinner />
      </Stack>
    );
  // console.log(lData.me);
  // console.log(
  //   data.tweets.map(
  //     (tweet: Tweet, i: number) =>
  //       lData.me.likedTweets.filter((l: any) => l.tweet.id === tweet.id)[0]
  //   )
  // );
  return (
    <Stack as={Flex}>
      {data.tweetsbyuser?.map((tweet: Tweet, i: number) => (
        <Stack
          w="100%"
          borderBottom="1px solid rgb(239, 243, 244)"
          key={i}
          cursor="pointer"
          marginTop="0.1rem"
        >
          <Link
            as={RouterLink}
            to={`/tweet/${tweet.id}`}
            _hover={{ backgroundColor: "rgb(234, 238, 239)" }}
            padding="10px"
          >
            <HStack as={Flex} align="flex-start">
              <Image
                src={tweet.author.Profile?.photo}
                boxSize="40px"
                borderRadius="full"
              />

              <VStack w="100%">
                <HStack as={Flex} align="flex-start" w="100%">
                  <Text as="b">{tweet.author.name}</Text>
                  <Text>
                    {formatDistance(
                      subDays(new Date(tweet.createdAt), 0),
                      new Date()
                    )}{" "}
                    ago
                  </Text>
                </HStack>
                <Stack as={Flex} justify="flex-start" w="100%">
                  <Text overflowWrap="anywhere">{tweet.body}</Text>
                </Stack>
                <HStack w="100%" as={Flex} justify="space-around">
                  <Stack
                    padding="4px"
                    borderRadius="full"
                    onClick={() => {
                      onOpen();
                      setModalState({
                        photo: lData.me.Profile?.photo,
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
                  </Stack>
                  <Stack _hover={{ color: "rgb(249, 24, 128)" }}>
                    {lData.me.likedTweets
                      .map((tweett: likedTweet) => tweett.tweet.id)
                      .includes(tweet.id) ? (
                      <HStack>
                        <DeleteButton
                          id={
                            lData.me.likedTweets.filter(
                              (l: any) => l.tweet.id === tweet.id
                            )[0].id
                          }
                        />
                        <Text color="rgb(249, 24, 128)">
                          {tweet.likes.length}
                        </Text>
                      </HStack>
                    ) : (
                      <HStack>
                        <LikeButton id={tweet.id} />{" "}
                        <Text>{tweet.likes.length}</Text>
                      </HStack>
                    )}
                  </Stack>
                </HStack>
              </VStack>
            </HStack>
          </Link>
        </Stack>
      ))}
      <CreateReply
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
  );
};

export default TweetsByUser;

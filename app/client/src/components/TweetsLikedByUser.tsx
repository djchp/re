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
import { useNavigate } from "react-router-dom";

export const TWEETS_LIKEDBYUSER = gql`
  query TWEETS_LIKEDBYUSER($tweetslikedbyuserId: Int) {
    tweetslikedbyuser(id: $tweetslikedbyuserId) {
      id
      tweet {
        id
        body
        createdAt
        likes {
          id
        }
        author {
          id
          name
          Profile {
            id
            photo
          }
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
interface tweetExtract {
  id: number;
  tweet: {
    id: number;
    createdAt: Date;
    body: string;
    author: {
      id: number;
      name: string;
      Profile: {
        id: number;
        photo: string;
      };
    };
    likes: Array<any>;
  };
}

const TweetsLikedByUser = ({ userId }: Props) => {
  const { data, loading, error } = useQuery(TWEETS_LIKEDBYUSER, {
    variables: {
      tweetslikedbyuserId: userId,
    },
  });
  let extractedTweets: object[] = [];
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
  const navigate = useNavigate();
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

  //   const extractTweets = () => {
  //     data.forEach((t: tweetExtract) =>
  //     extractedTweets.push(t.tweet));
  //   };

  //   extractTweets();

  // console.log(lData.me);
  // console.log(
  //   data.tweets.map(
  //     (tweet: Tweet, i: number) =>
  //       lData.me.likedTweets.filter((l: any) => l.tweet.id === tweet.id)[0]
  //   )
  // );

  return (
    <Stack as={Flex}>
      {data.tweetslikedbyuser?.map((t: tweetExtract, i: number) => (
        <Stack
          w="100%"
          borderBottom="1px solid rgb(239, 243, 244)"
          key={i}
          cursor="pointer"
          marginTop="0.1rem"
        >
          <Stack
            onClick={() => {
              navigate(`/tweet/${t.tweet.id}`);
            }}
            _hover={{ backgroundColor: "rgb(234, 238, 239)" }}
            padding="10px"
          >
            <HStack as={Flex} align="flex-start">
              <Image
                src={t.tweet.author.Profile?.photo}
                boxSize="40px"
                borderRadius="full"
              />

              <VStack w="100%">
                <HStack as={Flex} align="flex-start" w="100%">
                  <Text
                    as="b"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${t.tweet.author.name}`);
                    }}
                  >
                    {t.tweet.author.name}
                  </Text>
                  <Text>
                    {formatDistance(
                      subDays(new Date(t.tweet.createdAt), 0),
                      new Date()
                    )}{" "}
                    ago
                  </Text>
                </HStack>
                <Stack as={Flex} justify="flex-start" w="100%">
                  <Text overflowWrap="anywhere">{t.tweet.body}</Text>
                </Stack>
                <HStack w="100%" as={Flex} justify="space-around">
                  <Stack
                    padding="4px"
                    borderRadius="full"
                    onClick={(e) => {
                        e.stopPropagation()
                      onOpen();
                      setModalState({
                        photo: lData.me.Profile?.photo,
                        name: t.tweet.author.name,
                        tid: t.tweet.id,
                        tbody: t.tweet.body,
                        aphoto: t.tweet.author.Profile.photo,
                        tTime: formatDistance(
                          subDays(new Date(t.tweet.createdAt), 0),
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
                      .includes(t.tweet.id) ? (
                      <HStack>
                        <DeleteButton
                          id={
                            lData.me.likedTweets.filter(
                              (l: any) => l.tweet.id === t.tweet.id
                            )[0].id
                          }
                        />
                        <Text color="rgb(249, 24, 128)">
                          {t.tweet.likes.length}
                        </Text>
                      </HStack>
                    ) : (
                      <HStack>
                        <LikeButton id={t.tweet.id} />{" "}
                        <Text>{t.tweet.likes.length}</Text>
                      </HStack>
                    )}
                  </Stack>
                </HStack>
              </VStack>
            </HStack>
          </Stack>
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

export default TweetsLikedByUser;

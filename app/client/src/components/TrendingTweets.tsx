import { gql, useQuery } from "@apollo/client";
import {
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

const FETCH_TRENDING = gql`
  query FETCH_TRENDING {
    trendingtweets {
      id
      body
      likes {
        id
      }
    }
  }
`;

type Tweet = {
  id: number;
  body: string;
  likes: [
    id: number
  ]
}

const TrendingTweets = () => {
  const { data, loading, error } = useQuery(FETCH_TRENDING);

  if (loading)
    return (
      <Stack justify="center" align="center" w="100%" h="100vh">
        <Spinner />
      </Stack>
    );

  return (
    <Stack backgroundColor="rgb(247, 249, 249)" borderRadius="16px" w="350px">
      <Text as="b" fontSize="22px" padding="12px 16px 4px 16px">
        Trending tweets
      </Text>
      {data.trendingtweets.map((t: Tweet, i: number) => (
        <VStack padding="6px 16px 6px 16px" key={i} as={Flex} align="flex-start">
          <Text as='b'>{t.body}</Text>
          <Text>{t.likes.length} likes</Text>
        </VStack>
      ))}
    </Stack>
  );
};

export default TrendingTweets;

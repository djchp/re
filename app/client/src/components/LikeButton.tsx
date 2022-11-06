import { Stack } from "@chakra-ui/react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { gql, useMutation } from "@apollo/client";
import { FETCH_TWEETS } from "./Tweets";
import { FETCH_ME } from "../pages/Profile";

const LIKE_TWEET_MUTATION = gql`
  mutation likeTweet($id: Int) {
    likeTweet(id: $id) {
      id
    }
  }
`;

interface Props {
  id: number;
}

const LikeButton = ({ id }: Props) => {
  const [likeTweet] = useMutation(LIKE_TWEET_MUTATION, {
    refetchQueries: [{ query: FETCH_TWEETS }, { query: FETCH_ME }],
  });

  // const handleLike = async (e) => {
  //   await likeTweet({
  //     variables: { id },
  //   });
  // };

  return (
    <Stack
      onClick={async (e) => {
        e.stopPropagation();
        await likeTweet({
          variables: { id },
        });
      }}
      _hover={{ backgroundColor: "rgb(249, 24, 128, 0.1)" }}
      cursor="pointer"
      borderRadius="full"
      padding="5px"
    >
      <FavoriteBorderIcon />
    </Stack>
  );
};

export default LikeButton;

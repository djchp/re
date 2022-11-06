import { gql, useMutation } from "@apollo/client";
import { FETCH_TWEETS } from "./Tweets";
import { Stack, Text } from "@chakra-ui/react";
import { FETCH_ME } from "../pages/Profile";
import FavoriteIcon from "@mui/icons-material/Favorite";
const DISLIKE_TWEET_MUTATION = gql`
  mutation dislikeTweet($id: Int) {
    dislikeTweet(id: $id) {
      id
    }
  }
`;

interface Props {
  id: number;
}

const DeleteButton = ({ id }: Props) => {
  const [dislikeTweet] = useMutation(DISLIKE_TWEET_MUTATION, {
    refetchQueries: [{ query: FETCH_TWEETS }, { query: FETCH_ME }],
  });

  // const handleDislike = async () => {
  //   await dislikeTweet({
  //     variables: { id },
  //   });
  // };

  return (
    <Stack
      onClick={async (e) => {
        e.stopPropagation();
        await dislikeTweet({
          variables: { id },
        });
      }}
      _hover={{ backgroundColor: "rgb(249, 24, 128, 0.1)" }}
      cursor="pointer"
      borderRadius="full"
      padding="5px"
      color="rgb(249, 24, 128)"
    >
      <FavoriteIcon />
    </Stack>
  );
};

export default DeleteButton;

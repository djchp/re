import { Stack } from "@chakra-ui/react";
import PeopleToFollow from "./PeopleToFollow";
import TrendingTweets from "./TrendingTweets";

const Trends = () => {
  return (
    <Stack padding="4%" top="0" position="sticky">
      <TrendingTweets />
      <PeopleToFollow />
    </Stack>
  );
};

export default Trends;

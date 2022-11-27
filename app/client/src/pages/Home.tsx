import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import { TweetInput } from "../components/TweetInput";
import { CREATE_TWEET } from "../components/CreateTweetModal";
import Tweets, { FETCH_TWEETS } from "../components/Tweets";
import Trends from "../components/Trends";

interface InitialValues {
  body: string;
}

const Home = () => {
  const [createTweet] = useMutation(CREATE_TWEET, {
    refetchQueries: [{ query: FETCH_TWEETS }],
  });
  const [isLargerThan1020] = useMediaQuery("(min-width: 1020px)");
  const InitialValues: InitialValues = {
    body: "",
  };

  if (isLargerThan1020) {
    return (
      <>
        <Grid
          templateAreas={`"Navbar Main Trends"`}
          gridTemplateColumns={`0.6fr 600px 0.8fr`}
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
              marginLeft="10px"
              position="sticky"
              top="0"
              backgroundColor="rgba(255, 255, 255, 0.85)"
              cursor="pointer"
              backdropFilter="blur(12px)"
            >
              <Heading
                size="md"
                padding="10px 0 10px 0"
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                Home
              </Heading>
            </Stack>
            <Stack borderBottom="1px solid rgb(239, 243, 244)">
              <Formik
                initialValues={InitialValues}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  setSubmitting(true);
                  await createTweet({
                    variables: values,
                  });
                  
                  // console.log(values);
                  setSubmitting(false);
                  resetForm({values: InitialValues})
                }}
              >
                <Stack as={Form}>
                  <Stack>
                    <TweetInput
                      name="body"
                      label="body"
                      type="body"
                      placeholder="What`s happening ?"
                    />
                  </Stack>
                  <Stack as={Flex} align="flex-end" paddingBottom="10px">
                    <Button
                      variant="outline"
                      color="white"
                      backgroundColor="#1D9BF0"
                      type="submit"
                      borderRadius="full"
                      w="fit-content"
                    >
                      <Text as="b">Tweet</Text>
                    </Button>
                  </Stack>
                </Stack>
              </Formik>
            </Stack>
            <Tweets />
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
          <Stack marginLeft="10px">
            <Heading size="md" padding="10px">
              Home
            </Heading>
          </Stack>
          <Stack borderBottom="1px solid rgb(239, 243, 244)">
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
              <Stack as={Form}>
                <Stack>
                  <TweetInput
                    name="body"
                    label="body"
                    type="body"
                    placeholder="What`s happening ?"
                  />
                </Stack>
                <Stack as={Flex} align="flex-end" paddingBottom="10px">
                  <Button
                    variant="outline"
                    color="white"
                    backgroundColor="#1D9BF0"
                    type="submit"
                    borderRadius="full"
                    w="fit-content"
                  >
                    <Text as="b">Tweet</Text>
                  </Button>
                </Stack>
              </Stack>
            </Formik>
          </Stack>

          <Tweets />
        </GridItem>
      </Grid>
    );
  }
};

export default Home;

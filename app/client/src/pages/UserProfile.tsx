import { gql, useQuery } from "@apollo/client";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { formatDistance, subDays } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Trends from "../components/Trends";
import TweetsByUser from "../components/TweetsByUser";
import TweetsLikedByUser from "../components/TweetsLikedByUser";

export const FETCH_USER = gql`
  query FETCH_USER($profileName: String) {
    user(profileName: $profileName) {
      name
      id
      email
      likedTweets {
        tweet {
          body
          author {
            name
          }
          likes {
            id
          }
        }
      }
      Profile {
        description
        photo
        createdAt
      }
      tweets {
        id
      }
    }
  }
`;

const UserProfile = () => {
  const { profileName } = useParams();
  const {
    loading: pLoading,
    error: pError,
    data: pData,
  } = useQuery(FETCH_USER, {
    variables: {
      profileName: profileName,
    },
  });
  const navigate = useNavigate();
  const [isLargerThan1020] = useMediaQuery("(min-width: 1020px)");
  if (pLoading)
    return (
      <Stack justify="center" align="center" w="100%" h="100vh">
        <Spinner />
      </Stack>
    );

  if (isLargerThan1020) {
    return (
      <>
        <Grid
          templateAreas={`"Navbar Main Trends"`}
          gridTemplateColumns={isLargerThan1020 ? "0.6fr 598px 0.7fr" : "0.6fr 4fr"}
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
            <Stack>
              {/* Heading */}
              <Stack
                as={Flex}
                flexDir="row"
                alignItems="center"
                h="-webkit-fit-content"
              >
                <IconButton
                  aria-label="go back"
                  icon={<ArrowBackIcon />}
                  borderRadius="50%"
                  marginLeft="1rem"
                  backgroundColor="transparent"
                  onClick={() => {
                    navigate(-1);
                  }}
                />
                <Stack pl="2rem" w="80%">
                  <Heading size="md">{pData.user.name}</Heading>
                  <Text paddingBottom="9px">{pData.user.tweets.length} tweets</Text>
                </Stack>
              </Stack>
              <Divider />
              <Stack paddingLeft="1rem" paddingTop="40px">
                <Image
                  src={pData.user.Profile?.photo}
                  boxSize="140px"
                  borderRadius="full"
                  border="5px solid"
                />
              </Stack>
              <Stack as={Flex} direction="row" paddingLeft="16px">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  role="img"
                >
                  <path
                    d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"
                    fill="white"
                    stroke="rgb(83, 100, 113)"
                  />
                </svg>
                <Text>
                  Joined{" "}
                  {formatDistance(
                    subDays(new Date(pData.user.Profile.createdAt), 3),
                    new Date(),
                    { addSuffix: true }
                  )}
                </Text>
              </Stack>
              {/* under image  */}
              <Stack>
                <Heading size="md" marginLeft="1rem">
                  {pData.user.name}
                </Heading>
              </Stack>
              <HStack paddingLeft="1rem">
                <Text>... following</Text>
                <Text>... followers</Text>
              </HStack>
              <Stack w="100%" as={Flex}>
                <Tabs>
                  <TabList w="100%" padding="0 16px 0 16px">
                    <Tab
                      w="50%"
                      _hover={{ backgroundColor: "rgb(234, 238, 239)" }}
                      margin="0 100px 0 100px"
                    >
                      Tweets
                    </Tab>
                    <Tab
                      w="50%"
                      _hover={{ backgroundColor: "rgb(234, 238, 239)" }}
                      margin="0 100px 0 100px"
                    >
                      Likes
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <TweetsByUser userId={pData.user.id}/>
                    </TabPanel>
                    <TabPanel>
                      <TweetsLikedByUser userId={pData.user.id}/>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Stack>
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
      <>
        <Grid
          templateAreas={`"Navbar Main"`}
          gridTemplateColumns={isLargerThan1020 ? "0.6fr 598px 0.7fr" : "0.6fr 4fr"}
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
            <Stack>
              {/* Heading */}
              <Stack
                as={Flex}
                flexDir="row"
                alignItems="center"
                h="-webkit-fit-content"
              >
                <IconButton
                  aria-label="go back"
                  icon={<ArrowBackIcon />}
                  borderRadius="50%"
                  marginLeft="1rem"
                  backgroundColor="transparent"
                  onClick={() => {
                    navigate(-1);
                  }}
                />
                <Stack pl="2rem" w="80%">
                  <Heading size="md">{pData.user.name}</Heading>
                  <Text paddingBottom="9px">{pData.user.tweets.length} tweets</Text>
                </Stack>
              </Stack>
              <Divider />
              <Stack paddingLeft="1rem" paddingTop="40px">
                <Image
                  src={pData.user.Profile?.photo}
                  boxSize="140px"
                  borderRadius="full"
                  border="5px solid"
                />
              </Stack>
              <Stack as={Flex} direction="row" paddingLeft="16px">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  role="img"
                >
                  <path
                    d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"
                    fill="white"
                    stroke="rgb(83, 100, 113)"
                  />
                </svg>
                <Text>
                  Joined{" "}
                  {formatDistance(
                    subDays(new Date(pData.user.Profile.createdAt), 3),
                    new Date(),
                    { addSuffix: true }
                  )}
                </Text>
              </Stack>
              {/* under image  */}
              <Stack>
                <Heading size="md" marginLeft="1rem">
                  {pData.user.name}
                </Heading>
              </Stack>
              <HStack paddingLeft="1rem">
                <Text>... following</Text>
                <Text>... followers</Text>
              </HStack>
              <Stack w="100%" as={Flex}>
                <Tabs>
                  <TabList w="100%" padding="0 16px 0 16px">
                    <Tab
                      w="50%"
                      _hover={{ backgroundColor: "rgb(234, 238, 239)" }}
                      margin="0 50px 0 50px"
                    >
                      Tweets
                    </Tab>
                    <Tab
                      w="50%"
                      _hover={{ backgroundColor: "rgb(234, 238, 239)" }}
                      margin="0 50px 0 50px"
                    >
                      Likes
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <TweetsByUser userId={pData.user.id}/>
                    </TabPanel>
                    <TabPanel>
                      <TweetsLikedByUser userId={pData.user.id}/>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Stack>
            </Stack>
          </GridItem>
        </Grid>
      </>
    );
  }
  
};

export default UserProfile;

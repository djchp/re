import {
  Button,
  Flex,
  HStack,
  Image,
  Link,
  Portal,
  Spacer,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CreateTweetModal from "./CreateTweetModal";
import { useLazyQuery, useQuery } from "@apollo/client";
import { FETCH_ME } from "../pages/Profile";
import { FETCH_TWEETS } from "./Tweets";

const Navbar = () => {
  const { loading, error, data } = useQuery(FETCH_ME);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [navbarIcons] = useMediaQuery("(min-width: 1300px)");

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signup");
  };
  const [refetch, {data: rdata, error: rerror, loading: rloading}] = useLazyQuery(FETCH_TWEETS, {
    fetchPolicy: "network-only"
  })
  const RefreshPage = () => {
    refetch()
  }

  if (loading)
    return (
      <Stack justify="center" align="center" w="100%" h="100vh">
        <Spinner />
      </Stack>
    );

  return (
    <>
      <Stack
        as={Flex}
        h="100vh"
        align="flex-end"
        paddingRight={`${navbarIcons ? "30px" : "5px"}`}
        position="sticky"
        top="0"
        w={`${navbarIcons ? "275px" : null}`}
        marginLeft={`${navbarIcons ? "240px" : null}`}
        marginRight="0"
      >
        <Stack as={Flex} w={`${navbarIcons ? "205px" : null}`}>
          <Link
            as={RouterLink}
            to="/"
            w="max-content"
            _hover={{ backgroundColor: "rgb(212, 216, 217)" }}
            transition="all 0.1s linear"
            borderRadius="full"
            // h="5vh"
            padding="12px"
            onClick={() => {
              RefreshPage()
            }} 
          >
            {
              <HStack>
                <HomeOutlinedIcon />
                {navbarIcons ? <Text fontSize="xl">Home</Text> : ""}
              </HStack>
            }
          </Link>
        </Stack>
        <Stack as={Flex} w={`${navbarIcons ? "205px" : null}`}>
          <Link
            as={RouterLink}
            to="/"
            w="max-content"
            _hover={{ backgroundColor: "rgb(212, 216, 217)" }}
            transition="all 0.1s linear"
            borderRadius="full"
            // h="5vh"
            padding="12px"
          >
            <HStack>
              <TagOutlinedIcon />
              {navbarIcons ? <Text fontSize="xl">Explore</Text> : ""}
            </HStack>
          </Link>
        </Stack>
        <Stack as={Flex} alignContent="center" w={`${navbarIcons ? "205px" : null}`}>
          <Link
            as={RouterLink}
            to="/"
            w="max-content"
            _hover={{ backgroundColor: "rgb(212, 216, 217)" }}
            transition="all 0.1s linear"
            borderRadius="full"
            // h="5vh"
            padding="12px"
          >
            <HStack>
              <NotificationsNoneOutlinedIcon />
              {navbarIcons ? <Text fontSize="xl">Notifications</Text> : ""}
            </HStack>
          </Link>
        </Stack>
        <Stack as={Flex} alignContent="center" w={`${navbarIcons ? "205px" : null}`}>
          <Link
            as={RouterLink}
            to="/profile"
            w="max-content"
            _hover={{ backgroundColor: "rgb(212, 216, 217)" }}
            transition="all 0.1s linear"
            borderRadius="full"
            // h="5vh"
            padding="12px"
          >
            <HStack>
              <Person2OutlinedIcon />
              {navbarIcons ? <Text fontSize="xl">Profile</Text> : ""}
            </HStack>
          </Link>
        </Stack>
        <Stack as={Flex} alignContent="center" w={`${navbarIcons ? "205px" : null}`}>
          <Link
            as={RouterLink}
            to="/profile"
            w="max-content"
            _hover={{ backgroundColor: "rgb(212, 216, 217)" }}
            transition="all 0.1s linear"
            borderRadius="full"
            // h="5vh"
            padding="12px"
          >
            <HStack>
              <MoreHorizOutlinedIcon />
              {navbarIcons ? <Text fontSize="xl">More</Text> : ""}
            </HStack>
          </Link>
        </Stack>
        <Stack
          as={Flex}
          _hover={{ backgroundColor: "rgb(26, 140, 216)" }}
          cursor="pointer"
          backgroundColor="rgb(29, 155, 240)"
          borderRadius="full"
          padding="8px"
          marginTop="16px"
          onClick={() => {
            onOpen();
          }}
          w={`${navbarIcons ? "205px" : ""}`}
          justify="center"
          align="center"
          
        >
          {navbarIcons ? (
            <Stack w="100%" as={Flex} align="center">
              <Text color="white" as="b" w="fit-content">
                Tweet
              </Text>
            </Stack>
          ) : (
            <ModeEditOutlineOutlinedIcon />
          )}
        </Stack>
        <Spacer />
        <Stack>
          <Popover>
            <PopoverTrigger>
              {navbarIcons ? (
                <HStack
                  padding="12px"
                  cursor="pointer"
                  _hover={{ backgroundColor: "rgb(212, 216, 217)" }}
                  borderRadius="full"
                  marginBottom="15px"
                >
                  <Stack>
                    <Image
                      src={data?.me.Profile?.photo}
                      boxSize="40px"
                      borderRadius="full"
                    />
                  </Stack>
                  <VStack>
                    <Text margin="0" as="b">
                      {data.me.name}
                    </Text>
                  </VStack>
                  <Stack>
                    <MoreHorizOutlinedIcon />
                  </Stack>
                </HStack>
              ) : (
                <HStack
                  paddingBottom="12px"
                  cursor="pointer"
                  _hover={{ backgroundColor: "rgb(212, 216, 217)" }}
                  borderRadius="full"
                  marginBottom="15px"
                >
                  <Stack>
                    <Image
                      src={data.me.Profile?.photo}
                      boxSize="40px"
                      borderRadius="full"
                    />
                  </Stack>
                </HStack>
              )}
            </PopoverTrigger>
            <Portal>
              <PopoverContent borderRadius="10px">
                <PopoverArrow />
                <PopoverHeader padding="12px">
                  <HStack>
                    <Stack>
                      <Image
                        src={data.me.Profile?.photo}
                        boxSize="40px"
                        borderRadius="full"
                      />
                    </Stack>
                    <VStack>
                      <Text margin="0" as="b">
                        {data.me.name}
                      </Text>
                    </VStack>
                  </HStack>
                </PopoverHeader>
                <PopoverBody padding="0px">
                  <Stack
                    padding="16px"
                    cursor="pointer"
                    _hover={{ backgroundColor: "rgb(212, 216, 217)" }}
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    <Text>Log out</Text>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Stack>
        <CreateTweetModal isOpen={isOpen} onClose={onClose} />
      </Stack>
    </>
  );
};

export default Navbar;

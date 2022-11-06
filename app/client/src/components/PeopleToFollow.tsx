import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Flex,
  HStack,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const FOLLOW_USERSQUERY = gql`
  query FOLLOW_USERSQUERY {
    userstofollow {
      id
      name
      Profile {
        id
        photo
      }
    }
  }
`;

type User = {
  id: number;
  name: string;
  Profile: {
    id: number;
    photo: string;
  };
};

const PeopleToFollow = () => {
  const navigate = useNavigate()
  const { data, loading, error } = useQuery(FOLLOW_USERSQUERY);
  if (loading)
    return (
      <Stack justify="center" align="center" w="100%" h="100vh">
        <Spinner />
      </Stack>
    );
  return (
    <Stack backgroundColor="rgb(247, 249, 249)" borderRadius="16px" w="350px">
      <Text as="b" fontSize="22px" padding="12px 16px 4px 16px">
        Who to follow
      </Text>
      {data.userstofollow.map((u: User) => (
        <HStack
          padding="6px 16px 6px 16px"
          _hover={{ backgroundColor: "rgb(186, 186, 186)" }}
          cursor="pointer"
          onClick={() => {
            navigate(`/profile/${u.name}`)
          }}
        >
          <Image src={u.Profile?.photo} boxSize="48px" borderRadius="full" />

          <HStack as={Flex} justify="space-between" w="100%">
            <Stack>
              <Text as="b">{u.name}</Text>
              <Text>{u.name}</Text>
            </Stack>
            <Stack>
              <Button
                backgroundColor="black"
                color="white"
                borderRadius="full"
                size="sm"
                padding="0px 16px 0px 16px"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                Follow
              </Button>
            </Stack>
          </HStack>
        </HStack>
      ))}
    </Stack>
  );
};

export default PeopleToFollow;

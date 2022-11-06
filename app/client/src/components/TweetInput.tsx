import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";

import { AutoSize } from "./helpers/AutoSize";
import { useField } from "formik";
import { Flex } from "@chakra-ui/react";

type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};
const TweetInput = ({ label, ...props }: InputProps) => {
  const [field, meta] = useField(props);

  return (
    <FormControl w="100%" as={Flex} justifyContent="flex-start">
      {/* <FormLabel>{label}</FormLabel> */}
      <AutoSize
        {...field}
        {...props}
        border="none"
        _focusVisible={{ border: "none" }}
       
      />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export { TweetInput };

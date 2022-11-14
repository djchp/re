import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";

import { Field, useField } from "formik";

type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
};
const TextInput = ({ label, defaultValue, ...props }: InputProps) => {
  const [field, meta] = useField(props);

  return (
    <FormControl w="20rem">
      <FormLabel>{label}</FormLabel>
      <Input as={Field} {...field} {...props} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export { TextInput };

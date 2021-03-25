import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  ComponentWithAs,
  InputProps,
  TextareaProps,
} from "@chakra-ui/react";
import { useField } from "formik";
import { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> & {
  name: string;
  label?: string;
  textarea?: boolean;
  mb?: number;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  let InputOrTextarea:
    | ComponentWithAs<"input", InputProps>
    | ComponentWithAs<"textarea", TextareaProps> = Input;
  if (textarea) {
    InputOrTextarea = Textarea;
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      {label ? <FormLabel htmlFor={field.name}>{label}</FormLabel> : null}
      <InputOrTextarea
        {...field}
        id={field.name}
        placeholder={props.placeholder}
        {...props}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

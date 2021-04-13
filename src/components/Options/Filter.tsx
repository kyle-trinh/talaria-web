import {
  Popover,
  PopoverTrigger,
  Button,
  Icon,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { RiFilter2Fill } from "react-icons/ri";

interface valuesField {
  [key: string]: string;
}

interface FilterProps {
  setFilter: Dispatch<SetStateAction<string>>;
  defaultValues: valuesField;
}

export default function Filter({
  setFilter,
  defaultValues,
  children,
}: PropsWithChildren<FilterProps>) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  return (
    <Popover
      placement="bottom-end"
      returnFocusOnClose={false}
      isOpen={filterOpen}
      onClose={() => setFilterOpen(false)}
      closeOnBlur={true}
      onOpen={() => setFilterOpen(true)}
    >
      <PopoverTrigger>
        <Button _hover={{ backgroundColor: "gray.300" }}>
          <Icon as={RiFilter2Fill} />
        </Button>
      </PopoverTrigger>
      <Formik
        initialValues={defaultValues}
        onSubmit={(values) => {
          const arr = [];
          for (const item in values) {
            if (values[item]) {
              arr.push(
                `${item.replace("From", "[gte]").replace("To", "[lte]")}=${
                  values[item]
                }`
              );
            }
          }
          setFilter(arr.join("&"));
          setFilterOpen(false);
        }}
      >
        {(props) => (
          <Form>
            <PopoverContent>
              <PopoverCloseButton />
              <PopoverHeader>Make selection</PopoverHeader>
              <PopoverBody height="400px" overflow="auto">
                {children}
              </PopoverBody>
              <PopoverFooter>
                <VStack alignItems="stretch">
                  <Button type="submit" colorScheme="teal">
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      for (const el in defaultValues) {
                        props.setFieldValue(el, "");
                      }
                      setFilter("");
                      setFilterOpen(false);
                    }}
                  >
                    Reset
                  </Button>
                </VStack>
              </PopoverFooter>
            </PopoverContent>
          </Form>
        )}
      </Formik>
    </Popover>
  );
}

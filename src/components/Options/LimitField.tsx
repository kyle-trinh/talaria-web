import {
  Popover,
  PopoverTrigger,
  Button,
  Icon,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  CheckboxGroup,
  VStack,
  Checkbox,
  PopoverFooter,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { BiSelectMultiple } from "react-icons/bi";
import { ITEM_FIELDS, ITEM_FIELD_MAP_2, ITEM_DEFAULT } from "../../constants";

interface fieldType {
  full: string;
  type: string;
}

interface mapType {
  [key: string]: fieldType;
}

interface LimitFieldProps {
  selected: Array<string>;
  setSelected: any;
  fields: Array<string>;
  defaults: Array<string>;
  map: mapType;
}

export default function LimitField({
  selected,
  setSelected,
  fields,
  defaults,
  map,
}: LimitFieldProps) {
  const [selectedOpen, setSelectedOpen] = React.useState(false);
  return (
    <Popover
      placement="bottom-end"
      returnFocusOnClose={false}
      isOpen={selectedOpen}
      onClose={() => setSelectedOpen(false)}
      closeOnBlur={true}
      onOpen={() => setSelectedOpen(true)}
    >
      <PopoverTrigger>
        <Button _hover={{ backgroundColor: "gray.300" }}>
          <Icon as={BiSelectMultiple} />
        </Button>
      </PopoverTrigger>
      <Formik
        initialValues={{ checked: selected }}
        onSubmit={(values) => {
          setSelected(values.checked);
          setSelectedOpen(false);
        }}
      >
        {(props) => (
          <Form>
            <PopoverContent>
              <PopoverCloseButton />
              <PopoverHeader>Make your selection</PopoverHeader>
              <PopoverBody height="400px" overflow="auto">
                <CheckboxGroup
                  colorScheme="teal"
                  defaultValue={props.values.checked}
                  onChange={(value) => {
                    props.setFieldValue("checked", value);
                  }}
                  value={props.values.checked}
                >
                  <VStack alignItems="stretch" spacing="6px">
                    {ITEM_FIELDS.map((field) => (
                      <Checkbox
                        value={field}
                        px="20px"
                        colorScheme="teal"
                        borderRadius="lg"
                        textTransform="capitalize"
                        key={field}
                        // onChange={(e) => e.target.checked }
                      >
                        {map[field].full}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              </PopoverBody>
              <PopoverFooter>
                <VStack alignItems="stretch">
                  <Button colorScheme="teal" type="submit">
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      props.setFieldValue("checked", fields);
                      setSelected(fields);
                      setSelectedOpen(false);
                    }}
                  >
                    Select All
                  </Button>
                  <Button
                    onClick={() => {
                      props.setFieldValue("checked", defaults);
                      setSelected(defaults);
                      setSelectedOpen(false);
                    }}
                  >
                    Reset to default
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

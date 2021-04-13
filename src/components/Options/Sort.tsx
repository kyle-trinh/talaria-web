import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Button,
  Icon,
  PopoverFooter,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React, { Dispatch, SetStateAction } from "react";
import { GrSort } from "react-icons/gr";
import { ITEM_FIELD_MAP, SELECT_STYLE } from "../../constants";

const sortable = ["_id", "createdAt", "pricePerItem", "updatedAt", "orderDate"];
interface fieldType {
  full: string;
  type: string;
}

interface mapType {
  [key: string]: fieldType;
}

interface SortProps {
  setSort: Dispatch<SetStateAction<string>>;
  map: mapType;
}

export default function Sort({ setSort, map }: SortProps) {
  const [sortOpen, setSortOpen] = React.useState(false);
  return (
    <Popover
      placement="bottom-end"
      returnFocusOnClose={false}
      isOpen={sortOpen}
      onClose={() => setSortOpen(false)}
      closeOnBlur={true}
      onOpen={() => setSortOpen(true)}
    >
      <PopoverTrigger>
        <Button _hover={{ backgroundColor: "gray.300" }}>
          <Icon as={GrSort} />
        </Button>
      </PopoverTrigger>
      <Formik
        initialValues={{ field: "_id", order: "desc" }}
        onSubmit={(values) => {
          setSort(`${values.field}:${values.order}`);
          setSortOpen(false);
        }}
      >
        {() => (
          <Form>
            <PopoverContent>
              <PopoverCloseButton />
              <PopoverHeader>Make selection</PopoverHeader>
              <PopoverBody>
                <VStack spacing="8px">
                  <Field
                    as="select"
                    placeholder="select option"
                    name="field"
                    id="field"
                    style={SELECT_STYLE}
                  >
                    {sortable.map((el) => (
                      <option key={el} value={el}>
                        {map[el].full}
                      </option>
                    ))}
                  </Field>
                  <Field
                    as="select"
                    placeholder="select option"
                    name="order"
                    style={SELECT_STYLE}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </Field>
                </VStack>
              </PopoverBody>
              <PopoverFooter>
                <VStack alignItems="stretch">
                  <Button type="submit" colorScheme="teal">
                    Submit
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

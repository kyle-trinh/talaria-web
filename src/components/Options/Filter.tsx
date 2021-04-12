import {
  Popover,
  PopoverTrigger,
  Button,
  Icon,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  FormControl,
  FormLabel,
  PopoverFooter,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React, { Dispatch, SetStateAction } from "react";
import { RiFilter2Fill } from "react-icons/ri";
import { SELECT_STYLE } from "../../constants";
import { InputField } from "../InputField";

interface FilterProps {
  setFilter: Dispatch<SetStateAction<string>>;
}

export default function Filter({ setFilter }: FilterProps) {
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
        initialValues={{
          pricePerItemFrom: "",
          pricePerItemTo: "",
          createdAtFrom: "",
          createdAtTo: "",
          warehouse: "",
          status: "",
          website: "",
          orderAccount: "",
        }}
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
          console.log(arr);
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
                <InputField
                  name="pricePerItemFrom"
                  label="Price From"
                  type="number"
                  placeholder="$0"
                />
                <InputField
                  name="pricePerItemTo"
                  label="To"
                  type="number"
                  placeholder="$999"
                />
                <InputField
                  name="createdAtFrom"
                  label="Created at from"
                  type="date"
                  placeholder="created at"
                />
                <InputField
                  name="createdAtTo"
                  label="To"
                  type="date"
                  placeholder="created at to"
                />
                <FormControl>
                  <FormLabel htmlFor="warehouse">Warehouse</FormLabel>
                  <Field
                    as="select"
                    placeholder="select option"
                    style={SELECT_STYLE}
                    id="warehouse"
                    name="warehouse"
                  >
                    <option value="">Select an option</option>
                    <option value="60528fdd27ae2f0b7f0d843c">
                      UNIHAN 1909 LINH NG
                    </option>
                  </Field>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="warehouse">Status</FormLabel>
                  <Field
                    as="select"
                    placeholder="select option"
                    style={SELECT_STYLE}
                    name="status"
                    id="status"
                  >
                    <option value="">Select one option</option>
                    <option value="not-yet-ordered">Not Ordered Yet</option>
                    <option value="ordered">Ordered</option>
                    <option value="on-the-way-to-warehouse">
                      On the way to Warehouse
                    </option>
                    <option value="on-the-way-to-viet-nam">
                      On the way to VN
                    </option>
                    <option value="arrived-at-viet-nam">Arrived at VN</option>
                    <option value="done">Done</option>
                    <option value="returning">Returning</option>
                    <option value="returned">Returned</option>
                  </Field>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="website">Order website</FormLabel>
                  <Field
                    as="select"
                    placeholder="select option"
                    style={SELECT_STYLE}
                    name="website"
                    id="website"
                  >
                    <option value="">Choose one</option>
                    <option value="amazon">Amazon</option>
                    <option value="sephora">Sephora</option>
                    <option value="ebay">Ebay</option>
                    <option value="bestbuy">Best buy</option>
                    <option value="costco">Costco</option>
                    <option value="walmart">Walmart</option>
                    <option value="assisting">Others</option>
                  </Field>
                </FormControl>
              </PopoverBody>
              <PopoverFooter>
                <VStack alignItems="stretch">
                  <Button type="submit" colorScheme="teal">
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      props.setFieldValue("pricePerItemFrom", "");
                      props.setFieldValue("pricePerItemTo", "");
                      props.setFieldValue("createdAtFrom", "");
                      props.setFieldValue("createdAtTo", "");
                      props.setFieldValue("warehouse", "");
                      props.setFieldValue("status", "");
                      props.setFieldValue("website", "");
                      props.setFieldValue("orderAccount", "");
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

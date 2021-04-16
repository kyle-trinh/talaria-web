import {
  Box,
  Button,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { RiUser5Fill, RiMoreFill } from "react-icons/ri";
import Header from "../../components/Header";
import { InputField } from "../../components/InputField";
import NextLink from "next/link";
import {
  BASE_URL,
  ITEM_FIELD_MAP,
  ITEM_DEFAULT,
  ITEM_FIELD_MAP_2,
  ITEM_FIELDS,
  SELECT_STYLE,
} from "../../constants";
import { useQuery } from "react-query";
import { client } from "../../utils/api-client";
import { truncate } from "../../utils/index";
import { FreezeCol, Sort, LimitField } from "../../components/Options";
import Filter from "../../components/Options/Filter";
import { TableCeil } from "../../components/styles/Table";
import ContentHeader from "../../components/ContentHeader";
export interface I_Item {
  _id: string;
  createdAt: string;
  name: string;
  link: string;
  pricePerItem: string;
  actPricePerItem: string;
  quantity: string;
  tax: string;
  usShippingFee: string;
  extraShippingCost: string;
  estWgtPerItem: string;
  actWgtPerItem: string;
  actualCost: string;
  trackingLink: string;
  invoiceLink: string;
  orderDate: string;
  arrvlAtWarehouseDate: string;
  customerRcvDate: string;
  returnDate: string;
  returnArrvlDate: string;
  notes: string;
  status: string;
  website: string;
  commissionRate: string;
  itemType: string;
  orderAccount: string;
  warehouse: string;
  transaction: string;
  updatedAt: string;
}

const FilterInput = () => (
  <VStack spacing="8px">
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
        <option value="60528fdd27ae2f0b7f0d843c">UNIHAN 1909 LINH NG</option>
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
        <option value="on-the-way-to-warehouse">On the way to Warehouse</option>
        <option value="on-the-way-to-viet-nam">On the way to VN</option>
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
  </VStack>
);

const Items = () => {
  const [freezeNo, setFreezeNo] = useState(4);
  const [selected, setSelected] = useState(ITEM_DEFAULT);
  const [sort, setSort] = useState("_id:desc");
  const [fieldName, fieldOrder] = sort.split(":");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [filter, setFilter] = useState("");
  const { status, data, error } = useQuery(
    ["items", page, selected, sort, filter],
    () =>
      client(
        `${BASE_URL}/items?page=${page}&limit=${limit}&fields=${selected}&sort=${
          fieldOrder === "desc" ? "-" : ""
        }${fieldName}${filter && `&${filter}`}`
      )
  );
  return (
    <>
      <Header title="Items" />
      <ContentHeader title="Items" />
      <Box
        gridArea="main"
        bg="white"
        borderBottomLeftRadius="2xl"
        borderBottomRightRadius="xl"
        display="flex"
        justifyContent="flex-start"
        padding="10px 40px"
        flexDirection="column"
        overflow="auto"
      >
        <Box>
          <Box display="flex" justifyContent="space-between">
            <Box w={500}>
              <Formik
                initialValues={{ search: "" }}
                onSubmit={(values) => console.log(values)}
              >
                {() => (
                  <Form>
                    <InputField
                      type="text"
                      name="search"
                      placeholder="Search for items..."
                    />
                  </Form>
                )}
              </Formik>
            </Box>
            <HStack spacing={2} align="stretch">
              <NextLink href="/items/create" passHref>
                <Button colorScheme="teal">Add items +</Button>
              </NextLink>
              <FreezeCol freezeNo={freezeNo} setFreezeNo={setFreezeNo} />
              <Filter
                setFilter={setFilter}
                defaultValues={{
                  pricePerItemFrom: "",
                  pricePerItemTo: "",
                  createdAtFrom: "",
                  createdAtTo: "",
                  warehouse: "",
                  status: "",
                  website: "",
                  orderAccount: "",
                }}
              >
                <FilterInput />
              </Filter>
              <Sort setSort={setSort} map={ITEM_FIELD_MAP_2} />
              <LimitField
                selected={selected}
                setSelected={setSelected}
                fields={ITEM_FIELDS}
                defaults={ITEM_DEFAULT}
                map={ITEM_FIELD_MAP_2}
              />
            </HStack>
          </Box>
          {status === "loading" ? (
            <Spinner position="absolute" top="50%" left="50%" />
          ) : status === "error" ? (
            <span>{(error as Error).message}</span>
          ) : (
            <Box marginTop={8} w="100%">
              <Box
                position="relative"
                overflow="auto hidden"
                whiteSpace="nowrap"
                minH="500px"
                fontSize="14px"
              >
                <Table>
                  <Thead>
                    <Tr>
                      {selected.map((field, index) => {
                        return (
                          <TableCeil
                            key={index}
                            index={index}
                            freezeNo={freezeNo}
                          >
                            {ITEM_FIELD_MAP[field as keyof I_Item]}
                          </TableCeil>
                        );
                        // if (index < freezeNo) {
                        //   return (
                        //     <Th
                        //       key={index}
                        //       position="sticky"
                        //       backgroundColor="gray.300"
                        //       maxW={200}
                        //       minW={200}
                        //       left={200 * index}
                        //       textTransform="capitalize"
                        //     >
                        //       {ITEM_FIELD_MAP[field as keyof I_Item]}
                        //     </Th>
                        //   );
                        // } else {
                        //   return (
                        //     <Th
                        //       key={index}
                        //       backgroundColor="gray.200"
                        //       textTransform="capitalize"
                        //     >
                        //       {ITEM_FIELD_MAP[field as keyof I_Item]}
                        //     </Th>
                        //   );
                        // }
                      })}
                      <Th
                        right={0}
                        position="sticky"
                        maxW="100px"
                        minW="100px"
                        backgroundColor="gray.300"
                        borderTopRightRadius={6}
                        borderBottomRightRadius={6}
                        textTransform="capitalize"
                      >
                        Actions
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.data.data.map((single: I_Item) => (
                      <Tr key={single._id}>
                        {selected.map((field, index) => {
                          const [output, fullStr] = truncate(
                            single[field as keyof I_Item],
                            16,
                            ITEM_FIELD_MAP_2[field as keyof I_Item].type
                          );
                          if (index < freezeNo) {
                            return (
                              <Td
                                position="sticky"
                                maxW={200}
                                minW={200}
                                left={200 * index}
                                backgroundColor="gray.50"
                                key={index}
                              >
                                <Tooltip label={fullStr} aria-label="A tooltip">
                                  <span>{output}</span>
                                </Tooltip>
                              </Td>
                            );
                          } else {
                            return <Td key={index}>{output}</Td>;
                          }
                        })}
                        <Td
                          right={0}
                          position="sticky"
                          maxW="100px"
                          minW="100px"
                          textTransform="capitalize"
                          bg="gray.50"
                          _hover={{ zIndex: 1 }}
                        >
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="More options"
                              icon={<RiMoreFill />}
                              variant="outline"
                              size="xs"
                              borderRadius="50%"
                            />
                            <MenuList>
                              <MenuItem>View details</MenuItem>
                              <MenuItem>Edit</MenuItem>
                              <MenuItem>Delete</MenuItem>
                              <MenuItem>Charge</MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <HStack alignItems="center" justifyContent="flex-end" mt="16px">
                <Button
                  disabled={page === 1}
                  colorScheme="teal"
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>
                <p>
                  {page} of {Math.ceil(data.data.totalCount / limit)}
                </p>
                <Button
                  colorScheme="teal"
                  disabled={page === Math.ceil(data.data.totalCount / limit)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </HStack>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Items;

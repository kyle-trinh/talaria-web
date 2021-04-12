import {
  Box,
  Button,
  HStack,
  VStack,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Checkbox,
  CheckboxGroup,
  PopoverFooter,
  PopoverArrow,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { RiUser5Fill, RiFilter2Fill, RiMoreFill } from "react-icons/ri";
import { GrCurrency, GrSort } from "react-icons/gr";
import { BiSelectMultiple } from "react-icons/bi";
import Header from "../../components/Header";
import { InputField } from "../../components/InputField";
import NextLink from "next/link";
import { BASE_URL } from "../../constants";
import { useQuery } from "react-query";
import { client } from "../../utils/api-client";
import { truncate } from "../../utils/index";
import FreezeCol from "../../components/FreezeCol";

const fieldStyle = {
  border: "1px solid var(--chakra-colors-gray-200)",
  width: "100%",
  display: "block",
  padding: "8px 8px",
  borderRadius: "6px",
  textTransform: "capitalize",
};

const sortable = ["_id", "createdAt", "pricePerItem", "updatedAt", "orderDate"];

const fieldConverter = {
  _id: "id",
  createdAt: "created at",
  name: "name",
  link: "link",
  pricePerItem: "price per item",
  actPricePerItem: "actual price per item",
  quantity: "quantity",
  tax: "tax",
  usShippingFee: "us shipping fee",
  extraShippingCost: "extra shipping cost",
  estWgtPerItem: "estimated weight/item",
  actWgtPerItem: "actual weight/item",
  actualCost: "actual cost",
  trackingLink: "tracking link",
  invoiceLink: "invoice link",
  orderDate: "order date",
  arrvlAtWarehouseDate: "arrived at warehouse",
  customerRcvDate: "customer reception",
  returnDate: "return date",
  returnArrvlDate: "return arrival",
  notes: "notes",
  status: "status",
  website: "website",
  commissionRate: "comission rate",
  itemType: "item type",
  orderAccount: "order account",
  warehouse: "warehouse",
  transaction: "transaction",
  updatedAt: "updated at",
};

const defaultFields = [
  {
    name: "_id",
    type: "internalLink",
    full: "id",
  },
  {
    name: "createdAt",
    type: "string",
    full: "created at",
  },
  {
    name: "name",
    type: "string",
    full: "name",
  },
  {
    name: "link",
    type: "externalLink",
    full: "link",
  },
  {
    name: "pricePerItem",
    type: "string",
    full: "price/item",
  },
  {
    name: "quantity",
    type: "number",
    full: "quantity",
  },
  {
    name: "tax",
    type: "string",
    full: "tax",
  },
  {
    name: "usShippingFee",
    type: "string",
    full: "us shipping fee",
  },
];

const fieldsCopy = [
  {
    name: "_id",
    type: "internalLink",
    full: "id",
  },
  {
    name: "createdAt",
    type: "string",
    full: "created at",
  },
  {
    name: "name",
    type: "string",
    full: "name",
  },
  {
    name: "link",
    type: "externalLink",
    full: "link",
  },
  {
    name: "pricePerItem",
    type: "string",
    full: "price/item",
  },
  {
    name: "actPricePerItem",
    type: "string",
    full: "actual price/item",
  },
  {
    name: "quantity",
    type: "number",
    full: "quantity",
  },
  {
    name: "tax",
    type: "string",
    full: "tax",
  },
  {
    name: "usShippingFee",
    type: "string",
    full: "us shipping fee",
  },
  {
    name: "extraShippingCost",
    type: "string",
    full: "extra shipping",
  },
  {
    name: "estWgtPerItem",
    type: "string",
    full: "estimated weight/item",
  },
  {
    name: "actWgtPerItem",
    type: "string",
    full: "actual weight/item",
  },
  {
    name: "actualCost",
    type: "string",
    full: "actual cost",
  },
  {
    name: "trackingLink",
    type: "externalLink",
    full: "tracking link",
  },
  {
    name: "invoiceLink",
    type: "externalLink",
    full: "invoice link",
  },
  {
    name: "orderDate",
    type: "string",
    full: "order date",
  },
  {
    name: "arrvlAtWarehouseDate",
    type: "string",
    full: "arrived at warehouse",
  },
  {
    name: "customerRcvDate",
    type: "string",
    full: "customer reception",
  },
  {
    name: "returnDate",
    type: "string",
    full: "return date",
  },
  {
    name: "returnArrvlDate",
    type: "string",
    full: "return arrival",
  },
  {
    name: "notes",
    type: "string",
    full: "notes",
  },
  {
    name: "status",
    type: "badge",
    full: "status",
  },
  {
    name: "website",
    type: "badge",
    full: "website",
  },
  {
    name: "commissionRate",
    type: "string",
    full: "commission rate",
  },
  {
    name: "itemType",
    type: "badge",
    full: "item type",
  },
  {
    name: "orderAccount",
    type: "internalLink",
    full: "order account",
  },
  {
    name: "warehouse",
    type: "internalLink",
    full: "warehouse",
  },
  {
    name: "transaction",
    type: "internalLink",
    full: "transaction",
  },
  {
    name: "updatedAt",
    type: "string",
    full: "updated at",
  },
];

const Items = () => {
  const [freezeNo, setFreezeNo] = useState(4);
  const [selected, setSelected] = useState(
    defaultFields.map((field) => field.name)
  );
  const [sort, setSort] = useState("_id:desc");
  const [fieldName, fieldOrder] = sort.split(":");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [selectedOpen, setSelectedOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
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
      <Box
        gridArea="header"
        bg="white"
        borderTopLeftRadius="2xl"
        borderTopRightRadius="xl"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="0 40px"
      >
        <Box textStyle="title" as="h1">
          Items
        </Box>
        <Box>
          <Icon as={RiUser5Fill} w={45} h={45} color="gray" />
        </Box>
      </Box>
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
                          `${item
                            .replace("From", "[gte]")
                            .replace("To", "[lte]")}=${values[item]}`
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
                              style={fieldStyle}
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
                              style={fieldStyle}
                              name="status"
                              id="status"
                            >
                              <option value="">Select one option</option>
                              <option value="not-yet-ordered">
                                Not Ordered Yet
                              </option>
                              <option value="ordered">Ordered</option>
                              <option value="on-the-way-to-warehouse">
                                On the way to Warehouse
                              </option>
                              <option value="on-the-way-to-viet-nam">
                                On the way to VN
                              </option>
                              <option value="arrived-at-viet-nam">
                                Arrived at VN
                              </option>
                              <option value="done">Done</option>
                              <option value="returning">Returning</option>
                              <option value="returned">Returned</option>
                            </Field>
                          </FormControl>
                          <FormControl>
                            <FormLabel htmlFor="website">
                              Order website
                            </FormLabel>
                            <Field
                              as="select"
                              placeholder="select option"
                              style={fieldStyle}
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
                  {(props) => (
                    <Form>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader>Make selection</PopoverHeader>
                        <PopoverBody>
                          <VStack spacing="8px">
                            <Field
                              as="select"
                              placeholder="select option"
                              name="field"
                              id="field"
                              style={{
                                border:
                                  "1px solid var(--chakra-colors-gray-400)",
                                width: "100%",
                                display: "block",
                                padding: "6px 6px",
                                borderRadius: "6px",
                                textTransform: "capitalize",
                              }}
                            >
                              {sortable.map((el) => (
                                <option key={el} value={el}>
                                  {fieldConverter[el]}
                                </option>
                              ))}
                            </Field>
                            <Field
                              as="select"
                              placeholder="select option"
                              name="order"
                              style={{
                                border:
                                  "1px solid var(--chakra-colors-gray-400)",
                                width: "100%",
                                display: "block",
                                padding: "6px 6px",
                                borderRadius: "6px",
                                textTransform: "capitalize",
                              }}
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
                              {fieldsCopy.map((field) => (
                                <Checkbox
                                  value={field.name}
                                  px="20px"
                                  colorScheme="teal"
                                  borderRadius="lg"
                                  textTransform="capitalize"
                                  key={field.name}
                                  // onChange={(e) => e.target.checked }
                                >
                                  {field.full}
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
                                props.setFieldValue(
                                  "checked",
                                  fieldsCopy.map((field) => field.name)
                                );
                                setSelected(
                                  fieldsCopy.map((field) => field.name)
                                );
                                setSelectedOpen(false);
                              }}
                            >
                              select all
                            </Button>
                            <Button
                              onClick={() => {
                                props.setFieldValue(
                                  "checked",
                                  defaultFields.map((field) => field.name)
                                );
                                setSelected(
                                  defaultFields.map((field) => field.name)
                                );
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
            </HStack>
          </Box>
          {status === "loading" ? (
            <Spinner position="absolute" top="50%" left="50%" />
          ) : status === "error" ? (
            <span>{error.message}</span>
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
                        if (index < freezeNo) {
                          return (
                            <Th
                              key={index}
                              position="sticky"
                              backgroundColor="gray.300"
                              maxW={200}
                              minW={200}
                              left={200 * index}
                              textTransform="capitalize"
                            >
                              {fieldConverter[field]}
                            </Th>
                          );
                        } else {
                          return (
                            <Th
                              key={index}
                              backgroundColor="gray.200"
                              textTransform="capitalize"
                            >
                              {fieldConverter[field]}
                            </Th>
                          );
                        }
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
                    {data.data.data.map((single: IItem & { _id: string }) => (
                      <Tr key={single._id}>
                        {selected.map((field, index) => {
                          const [output, fullStr] = truncate(
                            single[field],
                            16,
                            fieldsCopy.find((el) => el.name === field)?.type
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

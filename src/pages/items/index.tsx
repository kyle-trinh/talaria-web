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
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { RiUser5Fill, RiFilter2Fill, RiMoreFill } from "react-icons/ri";
import { GrCurrency, GrSort } from "react-icons/gr";
import Header from "../../components/Header";
import { InputField } from "../../components/InputField";
import NextLink from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { BASE_URL } from "../../constants";
import { useQuery } from "react-query";
import { client } from "../../utils/api-client";
import { truncate } from "../../utils/index";
import ExternalLink from "../../components/ExternalLink";

function serialize(input: string | number, type: string, number: number) {
  if (input !== undefined) {
    if (type === "string") {
      return [
        `${input.toString().slice(0, number)} ${
          input.toString().length >= number ? "..." : ""
        }`,
        input,
      ];
    } else if (type === "date") {
      return [
        new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
          new Date(input)
        ),
        new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
          new Date(input)
        ),
      ];
    } else if (type === "usd" || type === "vnd") {
      return [
        new Intl.NumberFormat("us-US", {
          style: "currency",
          currency: type,
        }).format(input),
        new Intl.NumberFormat("us-US", {
          style: "currency",
          currency: type,
        }).format(input),
      ];
    } else if (type === "link") {
      return [
        <span>
          <ExternalLink href={input.toString()}>
            {input.slice(0, number) + "..."}
          </ExternalLink>
        </span>,
        input,
      ];
    } else if (type === "percent") {
      return [input + "%", input + "%"];
    } else if (type === "kg") {
      return [input + "kg", input + "kg"];
    } else if (type === "badge") {
      return [input, input];
    } else {
      return [input, input];
    }
  }
  return ["-", "-"];
}

const fields = [
  "_id",
  "createdAt",
  "name",
  "pricePerItem",
  "quantity",
  "link",
  "status",
  "usShippingFee",
  "tax",
  "extraShippingCost",
  "actWgtPerItem",
  "website",
  "itemType",
  "estWgtPerItem",
  "customId",
  "actualCost",
  "orderAccount",
  "orderDate",
  "transaction",
];

const fieldsCopy = [
  {
    name: "createdAt",
    type: "string",
    full: "created at",
  },
  {
    name: "updatedAt",
    type: "string",
    full: "updated at",
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
    name: "customId",
    type: "string",
    full: "id",
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
];

const Items = () => {
  const [freezeNo, setFreezeNo] = useState(4);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const { status, data, error, isFetching } = useQuery(["items", page], () =>
    client(`${BASE_URL}/items?page=${page}&limit=${limit}`)
  );
  return (
    <>
      <Header title="Dashboard" />
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
              <Menu>
                <MenuButton as={Button}>Freeze Columns ({freezeNo})</MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setFreezeNo(2)}>2</MenuItem>
                  <MenuItem onClick={() => setFreezeNo(3)}>3</MenuItem>
                  <MenuItem onClick={() => setFreezeNo(4)}>4</MenuItem>
                  <MenuItem onClick={() => setFreezeNo(5)}>5</MenuItem>
                  <MenuItem onClick={() => setFreezeNo(6)}>6</MenuItem>
                </MenuList>
              </Menu>
              <Button variant="link" _hover={{ backgroundColor: "gray.200" }}>
                <Icon as={RiFilter2Fill} />
              </Button>
              <Button variant="link" _hover={{ backgroundColor: "gray.200" }}>
                <Icon as={GrSort} />
              </Button>
              <Button variant="link" _hover={{ backgroundColor: "gray.200" }}>
                <Icon as={BsThreeDots} />
              </Button>
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
                      {fieldsCopy.map((field, index) => {
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
                              {field.full}
                            </Th>
                          );
                        } else {
                          return (
                            <Th
                              key={index}
                              backgroundColor="gray.200"
                              textTransform="capitalize"
                            >
                              {field.full}
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
                        {fieldsCopy.map((field, index) => {
                          const [output, fullStr] = truncate(
                            single[field.name],
                            16,
                            field.type
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
                                {/* {output} */}
                                <Tooltip label={fullStr} aria-label="A tooltip">
                                  {output}
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

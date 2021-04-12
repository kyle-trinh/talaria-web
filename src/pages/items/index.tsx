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
import { RiUser5Fill, RiMoreFill } from "react-icons/ri";
import Header from "../../components/Header";
import { InputField } from "../../components/InputField";
import NextLink from "next/link";
import {
  BASE_URL,
  ITEM_FIELD_MAP,
  ITEM_DEFAULT,
  ITEM_FIELD_MAP_2,
} from "../../constants";
import { useQuery } from "react-query";
import { client } from "../../utils/api-client";
import { truncate } from "../../utils/index";
import { FreezeCol, Sort, LimitField } from "../../components/Options";
import Filter from "../../components/Options/Filter";

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
              <Filter setFilter={setFilter} />
              <Sort setSort={setSort} map={ITEM_FIELD_MAP} />
              <LimitField selected={selected} setSelected={setSelected} />
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
                              {ITEM_FIELD_MAP[field]}
                            </Th>
                          );
                        } else {
                          return (
                            <Th
                              key={index}
                              backgroundColor="gray.200"
                              textTransform="capitalize"
                            >
                              {ITEM_FIELD_MAP[field]}
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
                            ITEM_FIELD_MAP_2[field].type
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

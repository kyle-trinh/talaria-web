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
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { RiUser5Fill, RiFilter2Fill } from "react-icons/ri";
import { GrSort } from "react-icons/gr";
import Header from "../../components/Header";
import { InputField } from "../../components/InputField";
import NextLink from "next/link";
import { BsThreeDots } from "react-icons/bs";

const data = [
  {
    createdAt: "2021-03-18T04:55:47.831Z",
    quantity: 10,
    tax: 0,
    usShippingFee: 0,
    extraShippingCost: 0,
    actWgtPerItem: 0,
    status: "ordered",
    website: "amazon",
    itemType: "others",
    _id: "6052dd783de14606771428cf",
    name: "Lược màu tím",
    link:
      "https://www.amazon.com/dp/B01NA7KNTS/ref=twister_B01EY97QUE?_encoding=UTF8&th=",
    pricePerItem: 10.99,
    estWgtPerItem: 0.34,
    customId: "item-1",
    actualCost: 1425392.87794954,
    orderAccount: "604fd95ca213d706709c716a",
    orderDate: "2021-03-18T15:42:16.572Z",
    transaction: "605374d8cd74a8055229f4af",
  },
];

const fields = [
  "createdAt",
  "quantity",
  "tax",
  "usShippingFee",
  "extraShippingCost",
  "actWgtPerItem",
  "status",
  "website",
  "itemType",
  "_id",
  "name",
  "link",
  "pricePerItem",
  "estWgtPerItem",
  "customId",
  "actualCost",
  "orderAccount",
  "orderDate",
  "transaction",
];

const Items = () => {
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
        padding="20px 40px"
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
              <Button
                variant="link"
                padding="0 6px"
                _hover={{ backgroundColor: "gray.200" }}
              >
                Freeze Column
              </Button>
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
          <Box marginTop={8} w="100%">
            <Box position="relative" overflow="auto" whiteSpace="nowrap">
              <Table>
                <Thead>
                  <Tr>
                    {fields.map((field, index) => {
                      if (index < 4) {
                        return (
                          <Th
                            position="sticky"
                            backgroundColor="teal"
                            maxW={200}
                            minW={200}
                            left={200 * index}
                            color="#fff"
                            textTransform="capitalize"
                            borderTopLeftRadius={index === 0 ? 50 : 0}
                            borderBottomLeftRadius={index === 0 ? 50 : 0}
                          >
                            {field}
                          </Th>
                        );
                      } else {
                        return (
                          <Th color="#fff" backgroundColor="teal">
                            {field}
                          </Th>
                        );
                      }
                    })}
                    <Th
                      right={0}
                      position="sticky"
                      maxW="100px"
                      minW="100px"
                      backgroundColor="teal"
                      color="#fff"
                      borderTopRightRadius={50}
                      borderBottomRightRadius={50}
                    >
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((single) => (
                    <Tr>
                      {fields.map((field, index) => {
                        if (index < 4) {
                          return (
                            <Td
                              position="sticky"
                              maxW={200}
                              minW={200}
                              left={200 * index}
                              backgroundColor="#fff"
                            >
                              {single[field]}
                            </Td>
                          );
                        } else if (index === fields.length - 1) {
                          return (
                            <Td
                              position="sticky"
                              maxW={200}
                              minW={200}
                              right={0}
                              backgroundColor="#fff"
                            >
                              {single[field]}
                            </Td>
                          );
                        } else {
                          return <Td>{single[field]}</Td>;
                        }
                      })}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Items;

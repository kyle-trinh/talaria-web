import { Box, Icon } from "@chakra-ui/react";
import React from "react";
import { RiUser5Fill } from "react-icons/ri";

interface Props {
  title: string;
}

export default function ContentHeader({ title }: Props) {
  return (
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
        {title}
      </Box>
      <Box>
        <Icon as={RiUser5Fill} w={45} h={45} color="gray" />
      </Box>
    </Box>
  );
}

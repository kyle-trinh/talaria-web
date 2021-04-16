import React from "react";
import { Box } from "@chakra-ui/react";

export default function ContentBody({ ...props }) {
  return (
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
      {...props}
    />
  );
}

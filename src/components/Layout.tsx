import { Flex, useColorMode, Grid, Box } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const bgColor = { light: "teal.600", dark: "gray.900" };

  const color = { light: "black", dark: "white" };
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      height="100vh"
    >
      {router.pathname !== "/login" && "/register" ? (
        <Grid
          templateRows="7.2rem auto"
          templateColumns="15rem auto"
          height="92vh"
          width="90%"
          bg="#E9ECF5"
          templateAreas="'sidebar header' 'sidebar main'"
          borderRadius="xl"
          boxShadow="xl"
        >
          <Box gridArea="sidebar">sidebar</Box>
          <Box
            gridArea="header"
            bg="white"
            borderTopLeftRadius="2xl"
            borderTopRightRadius="xl"
          >
            <p>
              <Link href="/login">
                <a>Link</a>
              </Link>
            </p>
            <Link href="/">
              <a>Home</a>
            </Link>
          </Box>
          <Box
            gridArea="main"
            bg="white"
            borderBottomLeftRadius="2xl"
            borderBottomRightRadius="xl"
          >
            {children}
          </Box>
        </Grid>
      ) : (
        children
      )}
    </Flex>
  );
};

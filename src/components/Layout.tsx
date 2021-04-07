import { Flex, useColorMode, Grid, Box } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Sidebar } from "./Sidebar";

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  console.log(router);

  const bgColor = { light: "teal.500", dark: "gray.900" };

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
      {router.pathname !== "/login" && router.pathname !== "/register" ? (
        <Grid
          templateRows="7.2rem auto"
          templateColumns="8rem auto"
          height="92vh"
          width="90vw"
          bg="#E9ECF5"
          templateAreas="'sidebar header' 'sidebar main'"
          borderRadius="xl"
          boxShadow="xl"
        >
          <Sidebar />
          {children}
        </Grid>
      ) : (
        <Grid
          height="92vh"
          width="90%"
          bg="#E9ECF5"
          borderRadius="xl"
          boxShadow="xl"
          gridTemplateColumns="repeat(2, 1fr)"
          overflow="auto"
        >
          <Flex
            bg="#fff"
            borderRadius="3xl"
            alignItems="center"
            justifyContent="center"
          >
            {children}
          </Flex>
          <Flex
            direction="column"
            position="relative"
            alignItems="center"
            justifyContent="center"
          >
            <Image src="/images/logo.png" alt="logo" width={100} height={100} />
            <Image
              src="/images/login-photo.svg"
              alt="login"
              height={550}
              width={550}
            />
          </Flex>
        </Grid>
      )}
    </Flex>
  );
};

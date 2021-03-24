import { Button, Grid, Flex, Box } from "@chakra-ui/react";
import { useMutation, QueryClient } from "react-query";
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { client } from "../utils/api-client";
import { dehydrate } from "react-query/hydration";
import Image from "next/image";
import { Form, Formik } from "formik";
import { InputField } from "../components/InputField";
import { makeUseVisualState } from "framer-motion/types/motion/utils/use-visual-state";

interface LoginProps {}

const Login = () => {
  const route = useRouter();
  const { mutate, isLoading } = useMutation(
    (data: { email: string; password: string }) =>
      fetch("http://localhost:4444/api/v1/users/signin", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    {
      onSuccess: () => {
        console.log("success?");
        route.push("/profile");
      },
      onError: (error) => {
        console.log("ERROR: ", error);
      },
    }
  );

  return (
    <Grid
      height="92vh"
      width="90%"
      bg="#E9ECF5"
      borderRadius="xl"
      boxShadow="xl"
      gridTemplateColumns="repeat(2, 1fr)"
      overflow="hidden"
    >
      <Flex
        bg="#fff"
        borderRadius="3xl"
        alignItems="center"
        justifyContent="center"
      >
        <Box maxW="400" w="100%">
          <Box textStyle="h1" textAlign="center" color="teal.600" mb={20}>
            Login
          </Box>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values) => await mutate(values)}
          >
            {() => (
              <Form>
                <InputField
                  name="email"
                  placeholder="Email"
                  label="Email"
                  type="text"
                  mb={5}
                />
                <InputField
                  name="password"
                  placeholder="Password"
                  label="Password"
                  type="password"
                  mb={5}
                />
                <Button
                  colorScheme="teal"
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Submitting"
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
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
  );
};
export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
}: GetServerSidePropsContext) {
  if (req.cookies?.jwt) {
    try {
      const queryClient = new QueryClient();
      await queryClient.fetchQuery("userProfile", () =>
        client("http://localhost:4444/api/v1/users/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: req.cookies?.jwt && `Bearer ${req.cookies.jwt}`,
          },
        })
      );

      return {
        props: { dehydratedState: dehydrate(queryClient) },
        redirect: {
          destination: "/profile",
          permanenet: false,
        },
      };
    } catch (err) {
      return {
        props: {},
      };
    }
  } else {
    return {
      props: {},
    };
  }
};

export default Login;

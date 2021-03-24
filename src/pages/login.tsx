import { Input, Button } from "@chakra-ui/react";
import { useMutation, QueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { client } from "../utils/api-client";
import { dehydrate } from "react-query/hydration";

interface LoginProps {}

const Login = () => {
  const route = useRouter();
  const { data, mutate, isLoading } = useMutation(
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
        route.push("/profile");
      },
    }
  );

  const [formData, setFormData] = useState({ email: "", password: "" });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Input
        type="text"
        name="email"
        width="400px"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
      />
      <Input
        type="password"
        name="password"
        width="400px"
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
      />
      <Button
        onClick={async () => {
          mutate(formData);
        }}
      >
        Submit
      </Button>
      {isLoading ? "loading..." : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </form>
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

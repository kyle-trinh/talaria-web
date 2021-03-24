import { withIronSession } from "next-iron-session";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { QueryClient, useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
import { client } from "../utils/api-client";

const Profile = () => {
  const { data } = useQuery("userProfile", () =>
    client("http://localhost:4444/api/v1/users/me", {
      method: "GET",
      credentials: "include",
    })
  );
  return data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null;
};

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
}: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  try {
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
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default Profile;

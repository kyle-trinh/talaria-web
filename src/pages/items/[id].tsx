import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import Header from "../../components/Header";
import { BASE_URL } from "../../constants";
import { client } from "../../utils/api-client";

export default function ItemDetail() {
  // TODO: Should I make this page?
  const route = useRouter();
  const { status, data, error } = useQuery(["item", route.query.id], () =>
    client(`${BASE_URL}/items/${route.query.id}`)
  );

  return status === "loading" ? "loading" : JSON.stringify(data, null, 2);
}

import { useQuery, useMutation } from "react-query";
import { BASE_URL } from "../constants";
import { client } from "./api-client";

function useItems(
  options: any,
  page: number,
  selected: string[],
  sort: string,
  filter: string,
  limit: number
) {
  const [fieldName, fieldOrder] = sort.split(":");
  const { data, status, error } = useQuery(
    ["items", page, selected, sort, filter, limit],
    () =>
      client(
        `${BASE_URL}/items?page=${page}&limit=${limit}&fields=${selected}&sort=${
          fieldOrder === "desc" ? "-" : ""
        }${fieldName}${filter && `&${filter}`}`
      ),
    { ...options }
  );

  return { data, status, error };
}

function useDeleteItem(options: any) {
  return useMutation(
    (data: string) =>
      client(`${BASE_URL}/items/${data}`, {
        method: "DELETE",
        credentials: "include",
      }),
    { ...options }
  );
}

export { useItems, useDeleteItem };

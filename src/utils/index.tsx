import ExternalLink from "../components/ExternalLink";
import Link from "next/link";

function truncate(str: string | number, num: number, field: string) {
  if (dateFields.includes(field) && str) {
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
      new Date(str)
    );
  }
  if (!str) {
    return "-";
  }
  if (linkFields.includes(field) && str) {
    return (
      <ExternalLink href={toString(str)}>
        {str.slice(0, num) + "..."}
      </ExternalLink>
    );
  }
  if (moneyFields.includes(field) && str) {
    return new Intl.NumberFormat("us-US", {
      style: "currency",
      currency: "USD",
    }).format(str);
  }
  if (str.length <= num || typeof str === "number") {
    return str;
  }
  if (field === "_id") {
    return <Link href={`/items/${str}`}>{str.slice(0, num) + "..."}</Link>;
  }
  return str.slice(0, num) + "...";
}

const dateFields = [
  "createdAt",
  "updatedAt",
  "orderDate",
  "arrvlAtWarehouseDate",
  "customerRcvDate",
  "returnArrvlDate",
  "returnDate",
];

const moneyFields = ["usShippingFee", "extraShippingCost", "pricePerItem"];

const linkFields = ["link"];

export { truncate };

import ExternalLink from "../components/ExternalLink";
import Link from "next/link";

function truncate(str: string, num: number, type: string) {
  if (str) {
    if (type === "string") {
      return [str.length >= num ? `${str.slice(0, num)}...` : str, str];
    } else if (type === "externalLink") {
      return [
        <span>
          <ExternalLink href={str}>{`${str.slice(0, num)}...`}</ExternalLink>
        </span>,
        str,
      ];
    } else if (type === "internalLink") {
      return [
        <span>
          <Link href="/">{str}</Link>
        </span>,
        ,
        str,
      ];
    } else {
      return [str, str];
    }
  }
  return ["-", "-"];
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

const fields = [
  {
    name: "_id",
    type: "string",
  },
  {
    name: "createdAt",
    type: "date",
  },
  {
    name: "name",
    type: "string",
  },
];

export { truncate };

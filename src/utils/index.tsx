import ExternalLink from "../components/ExternalLink";
import Link from "next/link";
import { Tag } from "@chakra-ui/react";

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
      return [<Link href="/">{str.slice(0, 16) + "..."}</Link>, str];
    } else if (type === "badge") {
      return [<Tag size="md">{str}</Tag>, str];
    } else {
      return [str, str];
    }
  }
  return ["-", "-"];
}

export { truncate };

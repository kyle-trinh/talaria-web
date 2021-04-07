import React from "react";

interface ExternalLinkProps {
  href: string;
}

export default function ExternalLink({
  href,
  children,
  ...props
}: React.PropsWithChildren<ExternalLinkProps>) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
      {children}
    </a>
  );
}

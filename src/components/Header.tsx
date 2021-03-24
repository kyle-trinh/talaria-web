import Head from "next/head";
import React from "react";

interface MetaProps {
  title: string;
}

const Meta = ({ title, children }: React.PropsWithChildren<MetaProps>) => (
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="/static/favicon.png" />
    <title>The Talaria | {title}</title>
    {children}
  </Head>
);

export default Meta;

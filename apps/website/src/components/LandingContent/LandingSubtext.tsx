import React from "react";

type Props = {
  children: React.ReactNode;
};

export const LandingSubtext = (props: Props) => {
  return <p tw="text-gray-300">{props.children}</p>;
};

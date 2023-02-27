import React, { ReactNode } from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
  viewBox?: string;
};

export const GenericIcon = ({
  children,
  className,
  viewBox = "0 0 48 48",
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
    >
      {children}
    </svg>
  );
};

export function createGenericIcon(
  node: ReactNode,
  viewBox: string = "0 0 48 48"
) {
  return function (props: Props) {
    return (
      <GenericIcon {...props} viewBox={viewBox}>
        {node}
      </GenericIcon>
    );
  };
}

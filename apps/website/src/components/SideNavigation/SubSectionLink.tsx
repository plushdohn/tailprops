import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  selected: boolean;
};

export const SubSectionLink = ({ selected, href, children }: Props) => {
  return (
    <Link
      href={href}
      scroll={true}
      tw="w-full p-3 pl-4 no-underline text-gray-400"
      tw-lg="rounded"
      tw-hover="bg-gray-800"
      style={{
        color: selected ? "#a5d8ff" : undefined,
        background: selected ? "#1864ab88" : undefined,
      }}
    >
      {children}
    </Link>
  );
};

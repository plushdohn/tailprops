"use client";

import React from "react";
import { DownArrow } from "../Icons/DownArrowIcon";

type Props = {
  label: string;
  href: string;
};

export const Scroller = (props: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.querySelector(props.href);

    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", props.href);
    }
  };

  return (
    <a
      href={props.href}
      onClick={handleClick}
      tw="absolute bottom-0 text-gray-300 max-w-40 cursor-pointer leading-relaxed p-2 font-xs flex flex-col items-center gap-2"
      tw-lg="font-sm"
    >
      {props.label}
      <DownArrow tw="w-6 fill-current animate-bounce" />
    </a>
  );
};

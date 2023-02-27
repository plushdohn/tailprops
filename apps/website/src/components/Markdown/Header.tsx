import { getSlugFromText } from "@/utils/getSlugFromText";
import {
  createElement,
  DetailedHTMLProps,
  HTMLAttributes,
  useState,
} from "react";

export const createHeaderRenderer = (tag: string) => {
  return (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >
  ) => {
    const slug = getSlugFromText(props.children!.toString());

    return (
      <div tw="flex items-center gap-3 group">
        {createElement(
          tag,
          { ...props, id: slug, className: "flex gap-3 m-0 pt-20 -mt-12" },
          <>
            {props.children}
            <a href={`#${slug}`} className="hidden group-hover:block">
              #
            </a>
          </>
        )}
      </div>
    );
  };
};

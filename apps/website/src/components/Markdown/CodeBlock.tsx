"use client";

import { ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  className?: string;
  inline?: boolean;
  children?: ReactNode | ReactNode[];
};

export function CodeBlock({ inline, className, children, ...props }: Props) {
  const match = className?.match(/language-(\w+)/);

  return !inline && match ? (
    <SyntaxHighlighter
      children={String(children).replace(/\n$/, "")}
      style={vscDarkPlus}
      language={match![1]}
      PreTag="div"
      CodeTag="div"
      wrapLines={true}
      customStyle={{
        margin: 0,
        background: "inherit",
      }}
      wrapLongLines={true}
      {...props}
    />
  ) : (
    <code>{children}</code>
  );
}

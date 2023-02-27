import React, { useMemo } from "react";

type Props = {
  children: string;
};

function transformCode(code: string) {
  const chars = code.split("");

  let nodes = [];

  let cursor = 0;

  let current: {
    kind: string | null;
    content: string;
  } = {
    kind: null,
    content: "",
  };

  while (cursor < chars.length) {
    const char = chars[cursor];

    if (char === "$") {
      const next = chars[++cursor];

      if (current.kind !== null) {
        if (next !== current.kind) {
          throw new Error("Nested highlighting is not supported");
        }

        nodes.push(current);

        current = {
          kind: null,
          content: "",
        };
      } else {
        if (current.content !== "") {
          nodes.push({
            kind: null,
            content: current.content,
          });
        }

        current = {
          kind: next,
          content: "",
        };
      }
    } else {
      current = {
        kind: current.kind,
        content: current.content + char,
      };
    }

    cursor++;
  }

  if (current.content) {
    nodes.push(current);
  }

  return nodes;
}

const MAP: {
  [key: string]: string;
} = {
  default: "text-white",
  "1": "text-pink-300",
  "2": "text-pink-400",
  "3": "text-blue-400",
  "4": "text-gray-400",
  w: "underline decoration-red-500 decoration-wavy underline-offset-4",
  "-": "bg-red-600",
  "+": "bg-green-600",
};

export const SyntaxHighlighter = (props: Props) => {
  const nodes = useMemo(() => {
    return transformCode(props.children);
  }, [props.children]);

  return (
    <pre
      tw="w-full text-left text-xs bg-gray-800 rounded-md p-3 leading-normal whitespace-pre-wrap"
      tw-sm="w-96"
    >
      <code>
        {nodes.map((n, i) => (
          <span className={n.kind === null ? MAP.default : MAP[n.kind]} key={i}>
            {n.content}
          </span>
        ))}
      </code>
    </pre>
  );
};

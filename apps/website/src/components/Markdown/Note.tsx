import { ReactNode } from "react";
import clsx from "clsx";

type Kind = "warning" | "info";

type Props = {
  children: ReactNode | ReactNode[];
  className?: string;
  kind: Kind;
};

export default function MarkdownNote({
  kind = "info",
  children,
  className,
}: Props) {
  const kindClasses: Record<Kind, string> = {
    warning: "border-yellow-500 text-yellow-700 bg-yellow-100",
    info: "border-blue-500 text-blue-600 bg-blue-100",
  };

  return (
    <div
      tw="border-l-4 rounded p-3 not-prose"
      className={clsx(kindClasses[kind], className)}
    >
      {children}
    </div>
  );
}

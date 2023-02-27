import { ReactNode } from "react";
import { NavBar } from "@/components/NavBar/NavBar";

type Props = {
  children: ReactNode;
};

export default function DocumentationLayout({ children }: Props) {
  return (
    <div tw="flex flex-col max-w-5xl mx-auto">
      <NavBar tw="sticky top-0" enableSideNav />
      {children}
    </div>
  );
}

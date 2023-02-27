"use client";

import { useUiStore } from "@/stores/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubSectionLink } from "./SubSectionLink";

type Props = {
  sections: { title: string; href: string }[];
  currentSection: string;
  route: string;
};

export function SideNavigation({ sections, currentSection, route }: Props) {
  const isMenuOpen = useUiStore((state) => state.isMenuOpen);
  const closeMenu = useUiStore((state) => state.closeMenu);
  const router = useRouter();

  useEffect(() => {
    closeMenu();
  }, [router]);

  return (
    <div
      className={isMenuOpen ? "flex" : "hidden"}
      tw="w-48 sticky top-16 left-0 bg-gray-900 h-full shrink-0 flex-col self-start"
      tw-lg="flex"
    >
      <div tw="flex flex-col gap-1 mt-2">
        {sections.map(({ title, href }) => (
          <SubSectionLink
            href={`${route}/${href}`}
            key={href}
            selected={href === currentSection}
          >
            {title}
          </SubSectionLink>
        ))}
      </div>
    </div>
  );
}

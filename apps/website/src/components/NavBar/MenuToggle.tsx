"use client";

import { useUiStore } from "@/stores/ui";
import { CloseIcon } from "../Icons/CloseIcon";
import { MenuIcon } from "../Icons/MenuIcon";

export const MenuToggle = () => {
  const isMenuOpen = useUiStore((state) => state.isMenuOpen);
  const toggleMenu = useUiStore((state) => state.toggleMenu);

  return (
    <button onClick={toggleMenu} tw="block" tw-lg="hidden">
      {isMenuOpen ? (
        <CloseIcon tw="w-6 fill-white" />
      ) : (
        <MenuIcon tw="w-6 fill-white" />
      )}
    </button>
  );
};

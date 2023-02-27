import Link from "next/link";
import { GithubIcon } from "../Icons/GithubIcon";
import { Logo } from "./Logo";
import { MenuToggle } from "./MenuToggle";

type Props = {
  className?: string;
  enableSideNav?: boolean;
};

export function NavBar({ className, enableSideNav }: Props) {
  return (
    <nav
      tw="fixed z-20 max-w-5xl w-full flex justify-between items-center p-4 bg-gray-900/90"
      tw-xl="px-0"
      className={className}
    >
      <div tw="flex items-center gap-4" tw-lg="gap-9">
        <div tw="flex items-center gap-3">
          {enableSideNav && <MenuToggle />}
          <Logo />
        </div>
        <Link
          href="/docs"
          tw="no-underline text-gray-300"
          tw-hover="text-gray-200"
        >
          Docs
        </Link>
        <Link
          href="/integrations"
          tw="no-underline text-gray-300"
          tw-hover="text-gray-200"
        >
          Integrations
        </Link>
      </div>
      <a
        href="https://github.com/plushdohn/tailprops"
        tw="text-gray-300"
        tw-hover="text-gray-100"
        tw-focus="text-gray-100"
      >
        <GithubIcon tw="w-8 fill-current" viewBox="0 0 30 30" />
      </a>
    </nav>
  );
}

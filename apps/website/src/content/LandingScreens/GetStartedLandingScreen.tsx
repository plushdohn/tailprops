import { LandingContent } from "@/components/LandingContent";
import { LandingHeader } from "@/components/LandingContent/LandingHeader";
import { LandingParagraph } from "@/components/LandingContent/LandingParagraph";
import Link from "next/link";

export const GetStartedLandingScreen = () => {
  return (
    <LandingContent id="start">
      <LandingHeader>
        Great! 🎉 <br />
        Let's get started.
      </LandingHeader>
      <LandingParagraph>
        Head over to the{" "}
        <Link
          href="/docs/installation"
          tw="text-blue-400"
          tw-hover="underline"
          tw-focus="underline"
        >
          installation
        </Link>{" "}
        section <br />
        to start using Tailprops with your bundler.
      </LandingParagraph>
    </LandingContent>
  );
};

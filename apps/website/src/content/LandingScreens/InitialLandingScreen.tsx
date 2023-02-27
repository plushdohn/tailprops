import { LandingContent } from "@/components/LandingContent";
import { LandingHeader } from "@/components/LandingContent/LandingHeader";
import { LandingParagraph } from "@/components/LandingContent/LandingParagraph";
import { LandingSubtext } from "@/components/LandingContent/LandingSubtext";
import { Scroller } from "@/components/LandingContent/Scroller";
import { SyntaxHighlighter } from "@/components/GhettoSyntaxHighlighter";

const START_CODE = `<$1div$1
  $2tw$2=$3”flex flex-col bg-blue-400 p-2"$3
  $2tw-hover$2=$3"bg-blue-500"$3 $4// On hover$4
  $2tw-2xl$2=$3"flex-row p-4"$3 $4// On desktop$4
/>`;

const END_CODE = `<$1div$1 $2class$2=$3”flex flex-col bg-blue-400 p-2 hover:bg-blue-500 2xl:flex-row 2xl:p-4"$3 />`;

export const InitialLandingScreen = () => {
  return (
    <LandingContent id="#">
      <LandingHeader>
        Give your{" "}
        <span tw="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
          Tailwind
        </span>{" "}
        classes
        <br />
        some room to breathe.
      </LandingHeader>
      <LandingParagraph>
        A build step that enhances your components <br />
        with <span tw="text-blue-400">custom props</span> for Tailwind styling.
      </LandingParagraph>
      <div tw="w-full flex flex-col items-center gap-3 mt-3" tw-lg="mt-8">
        <LandingSubtext>You write this...</LandingSubtext>
        <SyntaxHighlighter>{START_CODE}</SyntaxHighlighter>
        <LandingSubtext>
          ...and behind the curtains you get this.
        </LandingSubtext>
        <div tw="w-full flex flex-col items-center gap-1">
          <SyntaxHighlighter>{END_CODE}</SyntaxHighlighter>
        </div>
      </div>
      <Scroller label="WHY WOULD I USE THIS!?" href="#git" />
    </LandingContent>
  );
};

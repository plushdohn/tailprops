import { LandingContent } from "@/components/LandingContent";
import { LandingHeader } from "@/components/LandingContent/LandingHeader";
import { LandingParagraph } from "@/components/LandingContent/LandingParagraph";
import { Scroller } from "@/components/LandingContent/Scroller";
import { SyntaxHighlighter } from "@/components/GhettoSyntaxHighlighter";

const GIT_DIFFED_CODE = `<$1div$1
  $2tw$2=$3”p-2"$3
$-- tw-xl="p-4"$-
$++ tw-xl="p-8"$+ $4// Someone changed desktop styles$4

$-- tw-dark="bg-gray-900"$-
$++ tw-dark="bg-gray-800"$+ $4// ...and dark theme$4
/>`;

export const GitLandingScreen = () => {
  return (
    <LandingContent id="git">
      <LandingHeader>
        Git will thank you,
        <br /> and so will your team.
      </LandingHeader>
      <LandingParagraph>
        Separating styles into multiple props splits the concerns for each
        responsive breakpoint. <br />
        In code review you'll see exactly which breakpoint or modifiers have
        been touched.
      </LandingParagraph>

      <SyntaxHighlighter>{GIT_DIFFED_CODE}</SyntaxHighlighter>

      <Scroller
        label="THAT'S COOL, BUT WHAT ABOUT TYPESCRIPT?"
        href="#typescript"
      />
    </LandingContent>
  );
};

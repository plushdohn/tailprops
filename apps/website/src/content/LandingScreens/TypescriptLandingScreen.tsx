import React from "react";
import { LandingContent } from "@/components/LandingContent";
import { LandingHeader } from "@/components/LandingContent/LandingHeader";
import { LandingParagraph } from "@/components/LandingContent/LandingParagraph";
import { LandingSubtext } from "@/components/LandingContent/LandingSubtext";
import { Scroller } from "@/components/LandingContent/Scroller";
import { SyntaxHighlighter } from "@/components/GhettoSyntaxHighlighter";

const WRONG_CODE = `<$1div$1
  $wtw="bg-red-500"$w $4// TS will complain$4
/>`;

const CORRECT_CODE = `<$1div$1
  $2tw$2=$3”bg-red-500”$3 $4// No more yelling!$4

  $4// Also allows modifiers$4
  $2tw-hover$2=$3”bg-red-600”$3
/>`;

export const TypescriptLandingScreen = () => {
  return (
    <LandingContent id="typescript">
      <LandingHeader>Your framework won’t yell at you.</LandingHeader>
      <LandingParagraph>
        Arbitrary props are a big no-no when using TypeScript, rightfully so.
      </LandingParagraph>
      <SyntaxHighlighter>{WRONG_CODE}</SyntaxHighlighter>

      <LandingParagraph>
        We use{" "}
        <a
          tw="text-blue-400"
          tw-hover="underline"
          href="https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation"
        >
          module augmentation
        </a>{" "}
        to
        <br /> tell your framework what's going on:
      </LandingParagraph>
      <LandingSubtext>
        Run a simple command
        <br />
        (there is one for all supported frameworks)
      </LandingSubtext>
      <SyntaxHighlighter>npx tailprops init react</SyntaxHighlighter>

      <LandingSubtext>
        This will generate a tailprops.d.ts file
        <br />
        allowing you to use tw props.
      </LandingSubtext>
      <SyntaxHighlighter>{CORRECT_CODE}</SyntaxHighlighter>

      <Scroller label="OK, I'M CONVINCED" href="#start" />
    </LandingContent>
  );
};

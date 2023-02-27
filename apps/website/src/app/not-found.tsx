import { LandingHeader } from "@/components/LandingContent/LandingHeader";
import { LandingParagraph } from "@/components/LandingContent/LandingParagraph";
import { NavBar } from "@/components/NavBar/NavBar";

export default function NotFoundPage() {
  return (
    <div tw="w-screen flex flex-col items-center">
      <NavBar />
      <main tw="w-screen h-screen flex flex-col justify-center items-center">
        <LandingHeader>There's nothing here.</LandingHeader>
        <LandingParagraph tw="mt-3">
          I'll ask my raven network and let you know.
          <br />
          Click{" "}
          <a
            href="/"
            tw="text-blue-400"
            tw-hover="underline"
            tw-focus="underline"
          >
            here
          </a>{" "}
          to go back to the home page in the meantime.
        </LandingParagraph>
      </main>
    </div>
  );
}

import { NavBar } from "@/components/NavBar/NavBar";
import ScrollUp from "@/components/ScrollUp";
import { InitialLandingScreen } from "@/content/LandingScreens/InitialLandingScreen";
import { GitLandingScreen } from "@/content/LandingScreens/GitLandingScreen";
import { TypescriptLandingScreen } from "@/content/LandingScreens/TypescriptLandingScreen";
import { GetStartedLandingScreen } from "@/content/LandingScreens/GetStartedLandingScreen";

export default function Home() {
  return (
    <div tw="w-screen flex flex-col items-center">
      <NavBar />
      <main tw="max-w-5xl w-screen px-6">
        <ScrollUp />
        <InitialLandingScreen />
        <GitLandingScreen />
        <TypescriptLandingScreen />
        <GetStartedLandingScreen />
      </main>
    </div>
  );
}

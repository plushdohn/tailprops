import { NavBar } from "@/components/NavBar/NavBar";

export default function RootErrorPage() {
  return (
    <div tw="w-screen flex flex-col items-center">
      <NavBar />
      <main tw="max-w-5xl w-screen px-6">
        <h1>Uhh some error occurred.</h1>
      </main>
    </div>
  );
}

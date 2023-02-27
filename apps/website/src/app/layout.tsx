import { Sofia_Sans } from "@next/font/google";
import "@/styles/global.css";
import clsx from "clsx";

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  variable: "--font-sofia-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={clsx(sofiaSans.variable, "font-sans")}
        tw="relative bg-gray-900 text-white"
      >
        {children}
      </body>
    </html>
  );
}

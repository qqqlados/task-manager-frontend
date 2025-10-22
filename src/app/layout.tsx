import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { CreateProjectModal } from "@/components/ui/modals/create-project";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Task manager",
  description:
    "A streamlined custom Task Manager app that helps you organize projects, filter tasks efficiently, and navigate seamlessly between project details and task views.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased px-10 py-5 flex-1 w-screen h-screen`}
      >
        <Navigation />
        {children}
        <CreateProjectModal />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

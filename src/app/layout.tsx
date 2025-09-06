import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "react-hot-toast";

const inter = Inter({
	subsets: ["latin", "cyrillic"],
	variable: "--font-inter",
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
		<html lang='en'>
			<body
				className={`${inter.variable} antialiased px-10 py-5 flex-1 w-screen h-screen`}
			>
				<Navigation />
				{children}
				<Toaster position='top-right' />
			</body>
		</html>
	);
}

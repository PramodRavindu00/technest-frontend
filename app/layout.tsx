import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";

export const metadata: Metadata = {
  title: "Tech Nest",
  description: "A Community Dev Platform",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      <body> 
        <Navbar/>
        {children}</body>
    </html>
  );
};

export default RootLayout;

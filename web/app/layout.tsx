import { Providers } from "@/lib/Providers";
import "../styles/global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Logo from "@/public/elephant.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Hub",
  description: "Lwin Oo Naing => lwinoonaing806@gmail.com",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="modal-root" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export default RootLayout;

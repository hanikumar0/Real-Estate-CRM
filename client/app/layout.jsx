import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const manrope = Manrope({ subsets: ["latin"], variable: '--font-data' });

export const metadata = {
  title: "EstateFlow | Real Estate CRM",
  description: "Modern Real Estate SaaS CRM for Agents and Managers",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} font-sans`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

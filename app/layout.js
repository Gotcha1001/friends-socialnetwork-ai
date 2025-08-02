import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// App metadata
export const metadata = {
  title: "FriendSpace - AI Social Network",
  description:
    "Connect, share, and explore with AI-powered suggestions and conversations.",
};

// Root layout component
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

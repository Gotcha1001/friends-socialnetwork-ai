import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";
import { shadesOfPurple } from "@clerk/themes";

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
    <ClerkProvider
      dynamic
      appearance={{
        baseTheme: shadesOfPurple,
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#000",
          colorInputBackground: "#2D3748",
          colorInputText: "#F3F4F6",
        },
        elements: {
          formButtonPrimary: "bg-indigo-800 hover:bg-indigo-900 text-white",
          card: "gradient-background2",
          headerTitle: "text-indigo-800",
          headerSubtitle: "text-purple-700",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { ThemeProvider } from "next-themes";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "CTF Arena | Insper",
  description: "The better academic capture the flag!",
};

const toastIcons = {
  // info: ,
  // close: ,
  // error: ,
  // loading: ,
  // success: ,
  // warning: <ShieldAlert size={20} />,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${kanit.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ReactQueryProvider>{children}</ReactQueryProvider>

          <Toaster
            position="top-right"
            duration={5 * 1000}
            closeButton
            visibleToasts={2}
            swipeDirections={["bottom", "left", "right", "top"]}
            style={{ fontSize: 50 }}
            theme="dark"
            icons={toastIcons}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

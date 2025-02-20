import { SessionProvider } from 'next-auth/react'
import { ThemeSwitcher } from "@/components/theme-switcher";
// import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { auth } from '@/auth';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Transforma tu hidratación con Ozmmo",
  description: "Agua pura sin complicaciones",
};

// const inter = Inter({
//   display: "swap",
//   subsets: ["latin"],
// });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-background text-foreground" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col">
              <div className="flex-1 w-full flex flex-col gap-5">
                {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                      <Link href={"/"}>OZMMO</Link>
                      <div className="flex items-center gap-2">
                        <DeployButton />
                      </div>
                    </div>
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </nav> */}
                <div className="flex flex-col flex-1">
                  {children}
                </div>

                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  <p>
                    Powered by{" "}
                    <a
                      href="https://aneudyac.com"
                      target="_blank"
                      className="font-bold hover:underline"
                      rel="noreferrer"
                    >
                      aneudyac
                    </a>
                  </p>
                  <ThemeSwitcher />
                </footer>
              </div>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}

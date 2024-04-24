import { Inter } from "next/font/google";
import Head from "next/head";

import "./globals.css";
import Header from "../components/Header";



const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Leftover",
  description: "COP4521 Semester Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="shortcut icon" href="/icon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/pple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className={'bg-background' + inter.className}>
          <Header />
          <div>
            {children}
          </div>
      </body>
    </html>
  );
}

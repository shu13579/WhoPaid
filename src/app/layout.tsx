import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhoPaid - フーペイド | 誰からお金をもらったか忘れない割り勘・立て替え管理アプリ",
  description: "飲み会やパーティーの立て替えで「誰からお金をもらったっけ？」を解決。ワンクリックで支払い記録、リアルタイム支払い状況確認。割り勘・立て替え・グループ支払い管理に最適なWebアプリ。",
  keywords: ["割り勘", "立て替え", "支払い管理", "飲み会", "パーティー", "お金回収", "グループ支払い", "WhoPaid", "フーペイド"],
  authors: [{ name: "shu13579" }],
  creator: "shu13579",
  publisher: "WhoPaid",
  openGraph: {
    title: "WhoPaid - フーペイド | 割り勘・立て替え管理アプリ",
    description: "誰からお金をもらったか忘れない！飲み会・パーティーの支払い管理を簡単に。ワンクリック記録でストレスフリー。",
    url: "https://whopaid-kappa.vercel.app",
    siteName: "WhoPaid",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhoPaid - フーペイド | 割り勘・立て替え管理アプリ",
    description: "飲み会で誰からお金をもらったか忘れない！ワンクリックで支払い記録、簡単管理。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="google-site-verification" content="PbZST7_a5vzh2NKf0GYO32gjbTomOz1cg6nffCx77yE" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

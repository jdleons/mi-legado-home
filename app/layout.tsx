import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Legado — Configura tu casa en Legado del Bosque",
  description:
    "Diseña la casa que merece este entorno. Configura tu residencia en Legado del Bosque respetando la topografía y la normativa del proyecto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-ldb-cream text-ldb-dark">
        {children}
      </body>
    </html>
  );
}

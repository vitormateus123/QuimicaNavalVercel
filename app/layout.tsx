import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Química Naval",
  description: "Jogo da Tabela Periódica para 2 jogadores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Kolker+Brush&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          backgroundImage: "url(/fundoMar.svg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}

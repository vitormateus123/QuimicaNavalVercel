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
        <link href="https://fonts.googleapis.com/css2?family=Kolker+Brush&display=swap" rel="stylesheet" />
      </head>
      <body
        style={{
          backgroundImage: "url(/fundoMar.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          backgroundColor: "azure",
        }}
      >
        {children}
      </body>
    </html>
  );
}

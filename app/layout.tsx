import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monitoramento de Ramais",
  description: "Monitoramento em tempo real dos ramais registrados por unidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}

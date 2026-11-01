import "./globals.css";

export const metadata = {
  title: "GreenGold — Ropa urbana y accesorios",
  description: "Streetwear masculino y piezas con carácter propio. Explora la colección GreenGold.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

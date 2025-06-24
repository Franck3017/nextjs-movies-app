import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";
import { NotificationProvider } from "../contexts/NotificationContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { UserProvider } from "../contexts/UserContext";

export const metadata: Metadata = {
  title: "CineApp - Tu app de películas y series",
  description: "Descubre las mejores películas y series.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NotificationProvider>
          <UserProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </UserProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

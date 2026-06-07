import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { ConfigProvider } from "@/contexts/ConfigContext";
import { CartProvider } from "@/contexts/CartContext";
import { StoreSettingsProvider } from "@/contexts/StoreSettingsContext";
import { useRouter } from "next/router";
import { AdminLayout } from "@/admin/layouts/AdminLayout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
    <ConfigProvider>
      <StoreSettingsProvider>
        <CartProvider>
          {isAdminRoute ? (
            <AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </CartProvider>
      </StoreSettingsProvider>
    </ConfigProvider>
  );
}

import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { ConfigProvider } from "@/contexts/ConfigContext";
import { CartProvider } from "@/contexts/CartContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </ConfigProvider>
  );
}


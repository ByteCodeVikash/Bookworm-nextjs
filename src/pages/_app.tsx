import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { ConfigProvider } from "@/contexts/ConfigContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}


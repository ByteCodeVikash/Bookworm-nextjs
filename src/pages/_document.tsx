import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 1. Google Font Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* 2. Font Awesome Icons */}
        <link
          rel="stylesheet"
          href="/assets/vendor/font-awesome/css/fontawesome-all.min.css"
        />

        {/* 3. Flaticon Icons */}
        <link rel="stylesheet" href="/assets/vendor/flaticon/font/flaticon.css" />

        {/* 4. Animate.css */}
        <link rel="stylesheet" href="/assets/vendor/animate.css/animate.css" />

        {/* 5. Bootstrap Select stylesheet */}
        <link
          rel="stylesheet"
          href="/assets/vendor/bootstrap-select/dist/css/bootstrap-select.min.css"
        />

        {/* 6. Slick Carousel css */}
        <link rel="stylesheet" href="/assets/vendor/slick-carousel/slick/slick.css" />

        {/* 7. Scrollbar Plugin stylesheet */}
        <link
          rel="stylesheet"
          href="/assets/vendor/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css"
        />

        {/* 8. Compiled Bootstrap 4 & Theme layouts */}
        <link rel="stylesheet" href="/assets/css/theme.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";
import { CatalogProvider } from "@/components/catalog-provider";
import TelegramInit from "@/components/telegram-init";
import { getCatalog } from "@/lib/catalog.server";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "حقيبة الطالب العراقي — تعلّم بذكاء، تميّز بعلم",
  description: "منصة تعليمية شاملة للطلاب العراقيين تحتوي على فيديوهات تعليمية، ملازم، كتب، اختبارات ومراجعات منظمة حسب المرحلة والصف والمادة",
  keywords: "تعليم، عراق، طالب، منصة تعليمية، فيديوهات، ملازم، اختبارات",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const catalog = await getCatalog();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var applyTheme = function() {
                    if (document.body && theme === 'dark') {
                      document.body.classList.add('dark');
                    }
                  };
                  if (document.body) {
                    applyTheme();
                  } else {
                    document.addEventListener('DOMContentLoaded', applyTheme, { once: true });
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${cairo.variable} font-[var(--font-cairo)] antialiased`}>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <CatalogProvider initialData={catalog}>
          <TelegramInit />
          {children}
        </CatalogProvider>
      </body>
    </html>
  );
}

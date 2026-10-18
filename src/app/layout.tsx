import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kickresume AI 3.0 | Best Online Resume & Cover Letter Builder",
  description:
    "Create your best resume yet. Online resume and cover letter builder used by millions of job seekers worldwide. Professional templates approved by recruiters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="anti-extension-hydration-fix"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var clean = function(el) {
                    if (!el || !el.attributes) return;
                    for (var i = el.attributes.length - 1; i >= 0; i--) {
                      var name = el.attributes[i].name;
                      if (name.indexOf('bis_') === 0 || name.indexOf('__processed_') === 0) {
                        el.removeAttribute(name);
                      }
                    }
                  };
                  var obs = new MutationObserver(function(muts) {
                    for (var i = 0; i < muts.length; i++) {
                      var m = muts[i];
                      if (m.type === 'attributes') {
                        clean(m.target);
                      } else if (m.type === 'childList') {
                        for (var j = 0; j < m.addedNodes.length; j++) {
                          var node = m.addedNodes[j];
                          if (node.nodeType === 1) {
                            clean(node);
                            var descendants = node.getElementsByTagName('*');
                            for (var k = 0; k < descendants.length; k++) {
                              clean(descendants[k]);
                            }
                          }
                        }
                      }
                    }
                  });
                  obs.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['bis_skin_checked', 'bis_register', 'bis_frame_id']
                  });
                  window.addEventListener('DOMContentLoaded', function() {
                    setTimeout(function() { obs.disconnect(); }, 4000);
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased text-gray-900 bg-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

/* eslint-disable @next/next/no-page-custom-font */
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ResumeBuilderAi 3.0 | AI Resume & Cover Letter Studio',
  description: 'AI-powered resume builder, live template studio, cover letter generator, and ATS optimization dashboard.',
  openGraph: {
    title: 'ResumeBuilderAi 3.0 | AI Resume & Cover Letter Studio',
    description: 'AI-powered resume builder, live template studio, cover letter generator, and ATS optimization dashboard.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeBuilderAi 3.0 | AI Resume & Cover Letter Studio',
    description: 'AI-powered resume builder, live template studio, cover letter generator, and ATS optimization dashboard.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const safeFetchScript = `
    (function() {
      try {
        var origDefineProperty = Object.defineProperty;
        var currentFetch = typeof window !== 'undefined' && typeof window.fetch === 'function'
          ? window.fetch.bind(window)
          : undefined;

        function makeWritableFetchDescriptor(initialGetter) {
          var customFetch = null;
          return {
            configurable: true,
            enumerable: true,
            get: function() {
              if (typeof customFetch === 'function') return customFetch;
              if (typeof initialGetter === 'function') {
                try { return initialGetter.call(this); } catch (e) {}
              }
              return currentFetch;
            },
            set: function(fn) {
              if (typeof fn === 'function') {
                customFetch = fn;
                currentFetch = fn;
              }
            }
          };
        }

        function ensureWritableFetchOn(target) {
          if (!target) return;
          try {
            var desc = Object.getOwnPropertyDescriptor(target, 'fetch');
            if (!desc || desc.configurable !== false) {
              origDefineProperty.call(
                Object,
                target,
                'fetch',
                makeWritableFetchDescriptor(desc && desc.get)
              );
            }
          } catch (e) {}
        }

        if (typeof Window !== 'undefined' && Window.prototype) {
          ensureWritableFetchOn(Window.prototype);
        }
        if (typeof window !== 'undefined') {
          ensureWritableFetchOn(window);
        }

        Object.defineProperty = function(target, prop, descriptor) {
          if (
            prop === 'fetch' &&
            descriptor &&
            (target === window ||
              target === globalThis ||
              (typeof Window !== 'undefined' && target === Window.prototype))
          ) {
            if (descriptor.get && !descriptor.set) {
              return origDefineProperty.call(
                Object,
                target,
                prop,
                makeWritableFetchDescriptor(descriptor.get)
              );
            }
            if ('writable' in descriptor && descriptor.writable === false) {
              descriptor = Object.assign({}, descriptor, {
                configurable: true,
                writable: true
              });
            } else {
              descriptor = Object.assign({}, descriptor, {
                configurable: true
              });
            }
          }
          return origDefineProperty.call(Object, target, prop, descriptor);
        };
      } catch (e) {}

      window.addEventListener('error', function(ev) {
        if (
          (ev && ev.filename && ev.filename.indexOf('chrome-extension://') !== -1) ||
          (ev && ev.message && ev.message.indexOf('Cannot set property fetch') !== -1)
        ) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
        }
      }, true);
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: safeFetchScript}} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#FAF9F6] text-slate-900 font-sans antialiased selection:bg-[#FF5A4E]/20 selection:text-[#FF5A4E]"
      >
        {children}
      </body>
    </html>
  );
}

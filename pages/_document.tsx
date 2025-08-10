import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta charSet="utf-8" />
        
        {/* Fallback title and description - Always present */}
        <title>TuSecreto - Plataforma Anónima para Compartir Secretos | Máxima Privacidad</title>
        <meta name="description" content="🔒 Comparte secretos 100% anónimos. Sin emails, sin registro, sin rastreo. Hosting en Suecia con máxima privacidad. Únete a la comunidad más segura de secretos anónimos. ¡Totalmente gratis!" />
        
        {/* Basic SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="TuSecreto" />
        <meta name="language" content="Spanish" />
        <meta name="revisit-after" content="1 days" />
        <meta name="rating" content="general" />
        
        {/* DNS Prefetch y Preconnect optimizados */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//intranet-london-eventually-place.trycloudflare.com" />
        
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Resource hints */}
        <link rel="prefetch" href="/api/secrets" />
        <link rel="prefetch" href="/api/announcements" />
        
        {/* Icons and Manifest */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/tusecreto.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/tusecreto.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/tusecreto.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/tusecreto.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/tusecreto.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileImage" content="/tusecreto.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Security Headers - Only those that work in meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Fonts - Optimized loading */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          media="print"
          onLoad={(e) => {
            const target = e.target as HTMLLinkElement;
            target.media = 'all';
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </Head>
      <body className="bg-black text-white font-inter">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
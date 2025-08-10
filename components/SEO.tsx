import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noindex?: boolean
  structuredData?: object
  alternateLanguages?: { hreflang: string; href: string }[]
}

const SEO: React.FC<SEOProps> = ({
  title = "TuSecreto - Plataforma Anónima para Compartir Secretos | Máxima Privacidad",
  description = "🔒 Comparte secretos 100% anónimos. Sin emails, sin registro, sin rastreo. Hosting en Suecia con máxima privacidad. Únete a la comunidad más segura de secretos anónimos. ¡Totalmente gratis!",
  keywords = "secretos anónimos, confesar secretos, plataforma anónima, privacidad total, compartir secretos, anonimato real, secretos online, confesiones anónimas, privacidad digital, comunidad anónima, hosting Suecia, sin registro",
  image = "https://tusecreto.net/tusecreto.png",
  url = "https://tusecreto.net",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
  structuredData,
  alternateLanguages
}) => {
  // Asegurar que siempre hay un título válido
  const safeTitle = title || "TuSecreto - Plataforma Anónima para Compartir Secretos | Máxima Privacidad"
  const fullTitle = safeTitle.includes('TuSecreto') ? safeTitle : `${safeTitle} | TuSecreto`
  const safeDescription = description || "🔒 Comparte secretos 100% anónimos. Sin emails, sin registro, sin rastreo. Hosting en Suecia con máxima privacidad. Únete a la comunidad más segura de secretos anónimos. ¡Totalmente gratis!"
  
  return (
    <Head>
      {/* Primary Meta Tags - Always ensure title and description exist */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={safeDescription} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="TuSecreto" />
      <meta property="og:locale" content="es_ES" />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@tusecreto" />
      <meta name="twitter:creator" content="@tusecreto" />
      
      {/* Advanced SEO */}
      <meta name="application-name" content="TuSecreto" />
      <meta name="apple-mobile-web-app-title" content="TuSecreto" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Geo tags */}
      <meta name="geo.region" content="SE" />
      <meta name="geo.country" content="Sweden" />
      <meta name="ICBM" content="59.3293,18.0686" />
      
      {/* Additional SEO */}
      <meta name="subject" content="Secretos Anónimos y Privacidad Digital" />
      <meta name="copyright" content="TuSecreto" />
      <meta name="abstract" content="Plataforma líder en compartir secretos de forma 100% anónima con máxima privacidad y seguridad." />
      <meta name="topic" content="Privacidad, Anonimato, Secretos" />
      <meta name="summary" content="La plataforma más segura para compartir secretos anónimos sin registro ni datos personales." />
      <meta name="classification" content="Social Network, Privacy Platform" />
      <meta name="designer" content="TuSecreto Team" />
      <meta name="reply-to" content="admin@tusecreto.net" />
      <meta name="owner" content="TuSecreto" />
      <meta name="url" content={url} />
      <meta name="identifier-URL" content={url} />
      <meta name="directory" content="submission" />
      <meta name="category" content="Social, Privacy, Technology" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Alternate Languages */}
      {alternateLanguages?.map((lang) => (
        <link
          key={lang.hreflang}
          rel="alternate"
          hrefLang={lang.hreflang}
          href={lang.href}
        />
      ))}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Head>
  )
}

export default SEO

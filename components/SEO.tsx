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
}

const SEO: React.FC<SEOProps> = ({
  title = "TuSecreto - Plataforma Anónima para Compartir Secretos",
  description = "Comparte tus secretos de forma 100% anónima. Sin emails, sin datos personales. Hosting en Suecia con máxima privacidad y seguridad.",
  keywords = "secretos anónimos, confesar secretos, plataforma anónima, privacidad total, compartir secretos, anonimato real",
  image = "https://secretos.tusecreto.net/tusecreto.png",
  url = "https://secretos.tusecreto.net",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  noindex = false
}) => {
  const fullTitle = title.includes('TuSecreto') ? title : `${title} | TuSecreto`
  
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
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
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@tusecreto" />
      <meta name="twitter:creator" content="@tusecreto" />
    </Head>
  )
}

export default SEO

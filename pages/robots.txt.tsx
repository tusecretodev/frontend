import { GetServerSideProps } from 'next'

// Configure for Edge Runtime
export const runtime = 'experimental-edge'

function generateRobotsTxt() {
  return `# Robots.txt for TuSecreto - Optimized for SEO
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://tusecreto.net/sitemap.xml

# Disallow admin and API pages
Disallow: /admin
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/

# Allow important public pages
Allow: /secret/
Allow: /profiles/
Allow: /messages
Allow: /profile
Allow: /privacy
Allow: /terms
Allow: /about
Allow: /faq
Allow: /contact

# Specific bot instructions
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Block malicious bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# General crawl delay
Crawl-delay: 1

# Host directive
Host: https://tusecreto.net`
}

function RobotsTxt() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Generate the robots.txt
  const robotsTxt = generateRobotsTxt()

  res.setHeader('Content-Type', 'text/plain')
  res.write(robotsTxt)
  res.end()

  return {
    props: {},
  }
}

export default RobotsTxt

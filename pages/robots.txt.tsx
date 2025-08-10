import { GetServerSideProps } from 'next'

// Configure for Edge Runtime
export const runtime = 'experimental-edge'

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://secretos.tusecreto.net/sitemap.xml

# Disallow admin pages
Disallow: /admin
Disallow: /api/

# Allow public pages
Allow: /secret/
Allow: /profiles/
Allow: /messages
Allow: /profile
Allow: /privacy
Allow: /terms

# Crawl delay
Crawl-delay: 1`
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

import { GetServerSideProps } from 'next'

// Configure for Edge Runtime - Required for Cloudflare Pages
export const runtime = 'edge'

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://tusecreto.net/sitemap.xml

# Disallow admin and API routes
Disallow: /admin
Disallow: /api/

# Allow specific important pages
Allow: /
Allow: /privacy
Allow: /terms
Allow: /secret/*
Allow: /profiles/*

# Crawl delay for respectful crawling
Crawl-delay: 1

# Block common bots that don't respect robots.txt
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`
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

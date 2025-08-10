import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://tusecreto.net/sitemap.xml

Disallow: /admin
Disallow: /api/

Crawl-delay: 1`

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.write(robotsTxt)
  res.end()

  return {
    props: {},
  }
}

export default function RobotsTxt() {
  return null
}

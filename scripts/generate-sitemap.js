// Script para generar sitemap.xml estático
// Ejecutar con: node scripts/generate-sitemap.js

const fs = require('fs');
const path = require('path');

function generateSitemap() {
  const baseUrl = 'https://tusecreto.net';
  const currentDate = new Date().toISOString();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

<!-- Homepage -->
<url>
  <loc>${baseUrl}/</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>

<!-- Static Pages -->
<url>
  <loc>${baseUrl}/privacy</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>${baseUrl}/terms</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>

<url>
  <loc>${baseUrl}/messages</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>

<url>
  <loc>${baseUrl}/profile</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>

<!-- Admin (if public) -->
<url>
  <loc>${baseUrl}/admin</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.3</priority>
</url>

</urlset>`;

  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('✅ Sitemap generated successfully at:', sitemapPath);
}

if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap };

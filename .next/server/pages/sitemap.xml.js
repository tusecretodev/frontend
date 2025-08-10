"use strict";(()=>{var e={};e.id=164,e.ids=[164,888,660],e.modules={4815:(e,t,r)=>{r.r(t),r.d(t,{config:()=>d,default:()=>c,getServerSideProps:()=>S,getStaticPaths:()=>g,getStaticProps:()=>u,reportWebVitals:()=>m,routeModule:()=>v,unstable_getServerProps:()=>_,unstable_getServerSideProps:()=>y,unstable_getStaticParams:()=>h,unstable_getStaticPaths:()=>f,unstable_getStaticProps:()=>P});var a={};r.r(a),r.d(a,{default:()=>p,getServerSideProps:()=>getServerSideProps});var s=r(7093),l=r(5244),i=r(1323),o=r(1207),n=r(5913);function generateSiteMap(){let e="https://secretos.tusecreto.net";return`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${e}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${e}/messages</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${e}/profile</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${e}/privacy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${e}/terms</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`}function SiteMap(){}let getServerSideProps=async({res:e})=>{let t=generateSiteMap();return e.setHeader("Content-Type","text/xml"),e.write(t),e.end(),{props:{}}},p=SiteMap,c=(0,i.l)(a,"default"),u=(0,i.l)(a,"getStaticProps"),g=(0,i.l)(a,"getStaticPaths"),S=(0,i.l)(a,"getServerSideProps"),d=(0,i.l)(a,"config"),m=(0,i.l)(a,"reportWebVitals"),P=(0,i.l)(a,"unstable_getStaticProps"),f=(0,i.l)(a,"unstable_getStaticPaths"),h=(0,i.l)(a,"unstable_getStaticParams"),_=(0,i.l)(a,"unstable_getServerProps"),y=(0,i.l)(a,"unstable_getServerSideProps"),v=new s.PagesRouteModule({definition:{kind:l.x.PAGES,page:"/sitemap.xml",pathname:"/sitemap.xml",bundlePath:"",filename:""},components:{App:n.default,Document:o.default},userland:a})},2785:e=>{e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{e.exports=require("react")},997:e=>{e.exports=require("react/jsx-runtime")},1017:e=>{e.exports=require("path")}};var t=require("../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[859,450,207,913],()=>__webpack_exec__(4815));module.exports=r})();
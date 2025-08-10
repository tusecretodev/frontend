"use strict";(()=>{var e={};e.id=80,e.ids=[80,888,660],e.modules={1023:(e,t,r)=>{r.r(t),r.d(t,{config:()=>S,default:()=>u,getServerSideProps:()=>g,getStaticPaths:()=>c,getStaticProps:()=>d,reportWebVitals:()=>b,routeModule:()=>v,unstable_getServerProps:()=>x,unstable_getServerSideProps:()=>w,unstable_getStaticParams:()=>_,unstable_getStaticPaths:()=>m,unstable_getStaticProps:()=>P});var a={};r.r(a),r.d(a,{default:()=>n,getServerSideProps:()=>getServerSideProps});var s=r(7093),l=r(5244),o=r(1323),i=r(1207),p=r(5913);function generateRobotsTxt(){return`User-agent: *
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
Crawl-delay: 1`}function RobotsTxt(){}let getServerSideProps=async({res:e})=>{let t=generateRobotsTxt();return e.setHeader("Content-Type","text/plain"),e.write(t),e.end(),{props:{}}},n=RobotsTxt,u=(0,o.l)(a,"default"),d=(0,o.l)(a,"getStaticProps"),c=(0,o.l)(a,"getStaticPaths"),g=(0,o.l)(a,"getServerSideProps"),S=(0,o.l)(a,"config"),b=(0,o.l)(a,"reportWebVitals"),P=(0,o.l)(a,"unstable_getStaticProps"),m=(0,o.l)(a,"unstable_getStaticPaths"),_=(0,o.l)(a,"unstable_getStaticParams"),x=(0,o.l)(a,"unstable_getServerProps"),w=(0,o.l)(a,"unstable_getServerSideProps"),v=new s.PagesRouteModule({definition:{kind:l.x.PAGES,page:"/robots.txt",pathname:"/robots.txt",bundlePath:"",filename:""},components:{App:p.default,Document:i.default},userland:a})},2785:e=>{e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{e.exports=require("react")},997:e=>{e.exports=require("react/jsx-runtime")},1017:e=>{e.exports=require("path")}};var t=require("../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[859,450,207,913],()=>__webpack_exec__(1023));module.exports=r})();
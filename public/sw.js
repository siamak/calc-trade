if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>n(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-5afaf374"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/DxxxU7uFVAhRPwN8CPqfy/_buildManifest.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/DxxxU7uFVAhRPwN8CPqfy/_middlewareManifest.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/DxxxU7uFVAhRPwN8CPqfy/_ssgManifest.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/281-9c711470c752e267.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/303.d6e816d9738ddad1.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/336.4a2c641c04a8d8b6.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/433.648e3208c4eee65e.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/5.dee5a243f82f9e06.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/505.3c417b48541a950f.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/558.447450491aabebf5.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/framework-fc97f3f1282ce3ed.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/main-1ae490f04f27537c.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/pages/_app-af4c5dba01235e17.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/pages/_error-1995526792b513b2.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/pages/book-92a970c1406de381.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/pages/index-841f90aaf7946351.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/chunks/webpack-c4e627e5d54a344e.js",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/_next/static/css/1da1dfe826bb76d5.css",revision:"DxxxU7uFVAhRPwN8CPqfy"},{url:"/android-144x144.png",revision:"3eb9d408ff93ebb8ff9d48f19dbac157"},{url:"/android-192x192.png",revision:"ded449c3735a740d47e98d51c48e4a72"},{url:"/android-36x36.png",revision:"b858153dfc408c5f90e003c57ca91f05"},{url:"/android-48x48.png",revision:"83157f018a48071ceb8b42998905517c"},{url:"/android-72x72.png",revision:"3aee10ced7d38e6db1a0f4cbc3e006a0"},{url:"/android-96x96.png",revision:"6327a9206dd6a56a309f7e8954435173"},{url:"/android-chrome-192x192.png",revision:"ded449c3735a740d47e98d51c48e4a72"},{url:"/android-chrome-512x512.png",revision:"74c890b133bdcf2544a287fca7ec841a"},{url:"/android-chrome-maskable-192x192.png",revision:"229d85b9ea0db4a1edf731753550ced3"},{url:"/android-chrome-maskable-512x512.png",revision:"74c890b133bdcf2544a287fca7ec841a"},{url:"/apple-touch-icon.png",revision:"3904b59e3c0a688d38aab379147a87d7"},{url:"/favicon.ico",revision:"bb5cc099965a8cb411ba317a0c03cfc7"},{url:"/manifest.json",revision:"fc7b96acd93528b5c4eb80f6c4a000e0"},{url:"/splash/apple_splash_1125.png",revision:"9603e136145f84057412bef75ce2e3bd"},{url:"/splash/apple_splash_1242.png",revision:"8a7612bcfe340a502299231fc491c548"},{url:"/splash/apple_splash_1536.png",revision:"e4e16f779c86420a7f8dfebd9ead70d9"},{url:"/splash/apple_splash_1668.png",revision:"7d4ba36324f5812db3e5e5d6dd1f2c6e"},{url:"/splash/apple_splash_2048.png",revision:"1b631ad10e28319ad39253ce64775258"},{url:"/splash/apple_splash_640.png",revision:"d744016f9270a6f69e600387fbbd41ce"},{url:"/splash/apple_splash_750.png",revision:"447d634d52f3b89bff02f40de9117f21"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));

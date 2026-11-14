import type {NextConfig} from 'next';
const nextConfig:NextConfig={
 poweredByHeader:false,
 distDir:process.env.NODE_ENV==='development'?'.next-dev':'.next',
 typescript:{tsconfigPath:process.env.NODE_ENV==='production'?'tsconfig.build.json':'tsconfig.json'},
 output:process.env.VERCEL?undefined:'standalone',
 turbopack:{root:process.cwd()},
 outputFileTracingRoot:process.cwd(),
 async headers(){return [{source:'/studio',headers:[{key:'Cross-Origin-Embedder-Policy',value:'credentialless'},{key:'Cross-Origin-Opener-Policy',value:'same-origin'}]},{source:'/workspace',headers:[{key:'Cross-Origin-Embedder-Policy',value:'credentialless'},{key:'Cross-Origin-Opener-Policy',value:'same-origin'}]},{source:'/native',headers:[{key:'Cross-Origin-Embedder-Policy',value:'credentialless'},{key:'Cross-Origin-Opener-Policy',value:'same-origin'}]},{source:'/runtime/:path*',headers:[{key:'Cross-Origin-Embedder-Policy',value:'credentialless'},{key:'Cross-Origin-Resource-Policy',value:'same-origin'}]},{source:'/(.*)',headers:[
  {key:'X-Content-Type-Options',value:'nosniff'},
  {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
  {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
  {key:'X-Frame-Options',value:'SAMEORIGIN'}
 ]}]}
};
export default nextConfig;

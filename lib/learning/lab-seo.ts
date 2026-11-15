// Search-facing copy for each /labs/<technology> page. Facts match the runtimes bundled in this project
// (see BACKEND-COMPILERS-README.md). Update the version numbers here when you upgrade a runtime.
export type LabSeo={title:string;description:string;h1:string;lead:string;uses:string[];faq:{q:string;a:string}[];track:string};
export const labSeo:Record<string,LabSeo>={
 php:{
  title:'PHP Online Compiler — Run PHP 8.3 in Your Browser',
  description:'Write and run PHP 8.3 online with no install. Multi-file projects, include/require, JSON request testing, readable error lines and output in your browser.',
  h1:'PHP online compiler',
  lead:'Run real PHP 8.3 in your browser. Edit main.php, press Run and read the output, errors and line numbers straight away. Nothing is installed and your code runs on your device in an isolated WebAssembly worker, not on a server.',
  uses:['Test echo, print_r, arrays, string and date functions','Split code across files and try include and require','Send GET or POST requests with a JSON body and inspect status and headers','Practise syntax and runtime errors with source line positions'],
  faq:[{q:'Which PHP version does this compiler use?',a:'It runs PHP 8.3 compiled to WebAssembly, so behaviour matches a standard PHP 8.3 CLI for ordinary scripts.'},{q:'Can I use Composer packages or a database?',a:'No. The compiler has no network access, no Composer and no database connection. Use the Laravel compiler for a bundled framework, or a local PHP install for custom packages.'},{q:'Is there an execution limit?',a:'Yes, 10 seconds per run, and projects are limited to 100,000 characters. Infinite loops are stopped automatically.'},{q:'Is my code uploaded?',a:'No. Code runs locally in your browser. You can save a draft on this device or export the project as a ZIP.'}],track:'php'},
 laravel:{
  title:'Laravel Online Playground — Try Routes & Validation in the Browser',
  description:'Run a real Laravel 13 app online. Edit routes/web.php and routes/api.php, test JSON requests and see validation errors and HTTP status codes without installing PHP or Composer.',
  h1:'Laravel online playground',
  lead:'Learn Laravel without a local setup. This playground runs Laravel 13 with its Composer dependencies pre-bundled on PHP in WebAssembly. Edit routes, return views or JSON, and send requests to see real status codes and validation responses.',
  uses:['Define web and API routes and return JSON responses','Test request validation and 422 error bodies','See how the HTTP kernel handles each request','Export your files and continue in a full local Laravel project'],
  faq:[{q:'Is this a full Laravel installation?',a:'It is the real framework with bundled dependencies, running in a sandbox. It is meant for learning routes, validation and responses, not for hosting an application.'},{q:'Can I install other Composer packages?',a:'Not here. Editing composer.json does not install anything. Export the project and use Composer locally for extra packages.'},{q:'Does it include a database?',a:'No database is connected. Practise routing, controllers-style logic and validation; use a local project for Eloquent with a real database.'},{q:'Does it need an account?',a:'No account is needed. The runtime downloads the first time you press Run and is reused afterwards.'}],track:'laravel'},
 postgresql:{
  title:'PostgreSQL Online Compiler — Run SQL in Your Browser',
  description:'Run real PostgreSQL online with PGlite. Create tables, insert rows, query JSONB and use window functions in a disposable browser database. No install or sign-in.',
  h1:'PostgreSQL online compiler',
  lead:'Practise PostgreSQL in a real database engine that runs inside your browser. Write multi-statement SQL, create tables, insert and update rows, and see each statement’s result as a table. Your data stays on your device and resets when you stop.',
  uses:['CREATE TABLE, INSERT, UPDATE, DELETE and SELECT scripts','JSONB columns and the ->> operator','Window functions, CTEs, joins and aggregates','ON CONFLICT upserts and constraints'],
  faq:[{q:'Is this real PostgreSQL?',a:'Yes. It uses PGlite, a WebAssembly build of PostgreSQL, so PostgreSQL syntax and behaviour apply rather than a SQLite approximation.'},{q:'Does my data persist?',a:'Changes last while the tab is open. Pressing Stop resets the disposable database. Your SQL files can be saved on this device or exported.'},{q:'Can I connect to my own database?',a:'No. It is a single-connection sandbox with no external connections. Use psql or Docker locally for your own server.'},{q:'What are the limits?',a:'Five seconds per run, 12,000 characters of SQL and 200 displayed rows per result.'}],track:'postgresql'},
 tailwindcss:{
  title:'Tailwind CSS Online Playground — Live Preview in the Browser',
  description:'Try Tailwind CSS 4 online with a live preview. Edit HTML, CSS and JavaScript, switch between desktop, tablet and phone widths. No setup or CDN needed.',
  h1:'Tailwind CSS online playground',
  lead:'Build layouts with real Tailwind CSS 4 utilities and see the result as you type. Edit index.html, styles.css and script.js together, then preview at desktop, tablet or phone width.',
  uses:['Experiment with flex, grid, spacing and typography utilities','Test responsive variants like md: and lg:','Check hover and focus states with real interaction','Combine utilities with your own CSS and small scripts'],
  faq:[{q:'Which Tailwind version is used?',a:'Tailwind CSS 4.2 through its official browser build. No CDN script is required in your code.'},{q:'Can I use plugins or external fonts?',a:'No. The preview is sandboxed with the network blocked. Use the Tailwind CLI locally for plugins and production CSS.'},{q:'Is the output production-ready?',a:'The browser build is a development preview. For production, generate CSS with the Tailwind CLI or your framework build.'},{q:'Does the preview update automatically?',a:'After the first run, yes. It refreshes shortly after you stop typing.'}],track:'tailwindcss'},
 fastapi:{
  title:'FastAPI Online Playground — Test Python APIs in the Browser',
  description:'Run real FastAPI and Pydantic online. Edit main.py, send GET and POST requests and see status codes, headers and validation errors without installing Python.',
  h1:'FastAPI online playground',
  lead:'Run a real FastAPI application in your browser using Pyodide. Define routes, send requests through the ASGI app and inspect status codes, headers and Pydantic validation errors.',
  uses:['Path and query parameters with type validation','Request bodies and Pydantic models','Async and synchronous endpoints','Reading 422 validation responses'],
  faq:[{q:'Which versions run here?',a:'FastAPI 0.136 with Pydantic 2.12 on Pyodide, a WebAssembly build of Python.'},{q:'Can I install extra pip packages?',a:'No. Network access is blocked and only the bundled packages are available.'},{q:'Does it start a real server?',a:'Requests go straight to the ASGI app inside your browser. No public server or port is opened.'},{q:'Is my code sent anywhere?',a:'No, it runs locally in an isolated worker.'}],track:'fastapi'},
 nodejs:{
  title:'Node.js Online Playground — Run an HTTP Server in the Browser',
  description:'Run Node.js in your browser with a real HTTP server, terminal output and request tester. Experimental; needs a supported browser.',
  h1:'Node.js online compiler',
  lead:'Run Node.js in your browser using WebContainers. Start an HTTP server, view its page and test API routes. This runtime is experimental and needs a supported browser with HTTPS.',
  uses:['Create an HTTP server with node:http','Import local ES modules','Send GET and POST requests to your routes','Read console output and exit codes'],
  faq:[{q:'Why does it not start in my browser?',a:'It needs HTTPS, cross-origin isolation and a supported browser. Some privacy settings or extensions block it.'},{q:'Can I run npm install?',a:'Not in this lab. It supports Node’s built-in modules only.'},{q:'Does code run on a server?',a:'No. It executes in your browser.'},{q:'Is it limited?',a:'Projects are limited to 100 KB and requests to a few seconds.'}],track:'nodejs'},
};

SUKOAA WINDOWS TEST FIX — 25 NOVEMBER 2026

Your output confirms that typecheck and the footer/navigation tests now pass.
The four remaining failures have three test-environment causes:
1. The course test invokes a system python3 command that is absent on Windows.
2. Two JavaScript examples inherit terminal colours, so ANSI bytes appear around
   correct numeric/boolean output and break exact comparisons.
3. URL.pathname produces /C:/... on Windows, leading to an invalid C:\C:\... path.

This patch fixes all three causes without changing the expected results or
skipping tests. Python solutions run unchanged using the existing Pyodide
package in a fresh process for each task. No separate Python installation or new
npm dependency is required. Real Python exceptions still produce a failing exit.
The 30-second process deadline includes cold WASM startup.

APPLY TO YOUR CURRENT PROJECT
Copy only the included scripts/ and tests/ files into your project root:
scripts/test-platform.mjs
tests/genai-course.test.ts
tests/source-package.test.mjs
tests/run-python-reference.mjs (new; do not omit)

Notepad copies of each file are in the Notepad/ folder. They contain the exact
same source text. Save the real project files with their original extensions.
Append CHANGES-ENTRY.txt to your existing CHANGES.md, preserving its history.
Keep your PG Safe Migrate page, the corrected footer and all other local work.
Do not replace the whole project with an earlier source archive.

VERIFY IN POWERSHELL, NODE 24
npm run typecheck
npm test
npm run build
Stop if a command fails. Keep the original test assertions and lesson content.

AFTER ALL THREE PASS
Review git diff, then run:
git add -- scripts/test-platform.mjs tests/genai-course.test.ts tests/source-package.test.mjs tests/run-python-reference.mjs CHANGES.md
git commit -m "fix: make test execution portable on Windows"
git push origin main
Check GitHub Actions and the resulting Vercel deployment separately.
Do not add the downloaded ZIP to Git.

LOCAL VERIFICATION
Node 24.22.3 on Linux: typecheck pass; all 341 tests pass with zero skipped;
production build pass. The full suite was run with FORCE_COLOR=3 in the parent
environment. The Python helper was separately verified with empty PATH and an
intentional assertion failure, which correctly exited nonzero. All prior
assertions and expected outputs are preserved.
Real-Windows execution is not available here; the exact Windows drive/space URL
case was exercised with Node's Windows conversion mode. Your PowerShell rerun
and CI remain the final checks for your newer checkout.

Technical references:
https://nodejs.org/api/url.html#urlfileurltopathurl-options
https://nodejs.org/api/cli.html#force_color1-2-3
https://pyodide.org/en/stable/usage/api/js-api.html

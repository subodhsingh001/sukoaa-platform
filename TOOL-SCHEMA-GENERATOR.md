# Tool Schema Generator — v0.24.1

Open Tools → Tool Schema Generator, or `/tools/tool-schema-generator`.

This is a browser-local parser, schema editor and sample-argument validator. It does not run an AI model, execute functions, upload descriptions or save drafts automatically. No new API key, hosting service, database migration or dependency is required. Existing compilers and Portal-Ready remain separate tools.

## Use it

1. Choose an example, or enter a function declaration and parameter lines.
2. Generate draft. This updates the editor immediately and reports every generated function. Undo last replacement restores the previous editor and input state. If no supported function is found, the existing draft is kept.
3. Review every function name, description, type and required/optional decision. Resolve any validation issue and review unconverted text.
4. Choose Generic JSON, OpenAI Chat, OpenAI Responses, Claude tools or Gemini generateContent.
5. Optionally open Test arguments and validate a JSON input against one selected function. This never runs that function.
6. Confirm the review checkbox, then copy or download JSON.

```text
Function: create order
Description: Create an order for a customer.
customer: object, required
customer.name: string, required
customer.email: string, optional
items: array of objects, required
items[].sku: string, required
items[].quantity: integer, required, minimum 1
status: string, optional, enum [draft, confirmed]
```

Simple descriptions such as `add numbers takes a and b, both required` work too. Explicit type declarations are more predictable. The parser does not understand every English request; missing information stays reviewable. “All required” applies to top-level parameters, while explicit optional fields stay optional. Conflicting required/optional instructions are not auto-resolved. Unrecognized lines and inferred types are reported.

## Supported editable subset

- Multiple functions; safe snake_case function names; descriptions.
- string, number, integer, boolean, object and typed array parameters.
- Nested object fields and arrays of objects.
- Required/optional flags, primitive enums and numeric minimum/maximum.
- Closed objects (`additionalProperties: false`).
- Limits: 12,000 input characters, 20 functions, 150 fields, six nesting levels; imports and sample JSON capped at 100,000 characters. Argument validation is also bounded by depth and value count.

Arrays of arrays, references, unions, null types, open dictionaries, defaults, formats and regex constraints are outside this editor. Unsupported import keywords are rejected, not silently discarded. Import is a tools-only fragment, not a complete provider request. Preserve your original definition when it uses unsupported features. Nullable strict exports cannot be imported back into this version; use a Generic JSON export for editable round trips.

## Provider exports

| Output | Shape |
| --- | --- |
| Generic | `tools: [{ type: "function", function: { name, description, parameters } }]` |
| OpenAI Chat | Nested `function` wrapper and explicit `strict` flag |
| OpenAI Responses | Flat function tool with `type`, `name`, `parameters`, `strict` |
| Claude | `tools: [{ name, description, input_schema }]` |
| Gemini generateContent | `tools: [{ functionDeclarations: [{ name, description, parametersJsonSchema }] }]` |

OpenAI strict mode recursively requires every property and represents editor-optional fields as nullable; optional enums include null too. Callers must then send null instead of omitting those fields. Non-strict mode explicitly uses `strict: false` for both OpenAI formats.

These are tools request fragments. Your own application supplies model/messages, invokes any actual function, authenticates users and handles provider responses. Passing local validation does not establish acceptance by every provider/model or the safety of executing a function. No live provider request was made during validation.

Primary references reviewed 18 November 2026:

- https://developers.openai.com/api/docs/guides/function-calling
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
- https://ai.google.dev/api/caching#FunctionDeclaration

## Attachment and implementation decision

The uploaded `ai-tool-schema-generator.zip` was inspected as a reference. It is a separate FastAPI/Gemini application and requires an AI key. Its server-side generation and function runner were not integrated because this release was agreed to be browser-only. The original attachment is unchanged. The Sukoaa implementation uses explicit parsing, review gates, a supported schema subset and a sample-input validator instead.

## Run and publish

Use Node 24.x, `npm ci --include=dev`, `npm test`, `npm run build`, then `npm run dev`. No dependency inputs changed except the release version. Push this complete source to your own GitHub repository to redeploy www.sukoaa.com through Vercel. The separate ChatGPT review site does not update that deployment automatically.

Core files: `lib/tool-schema/parser.ts`, `lib/tool-schema/schema.ts`, `components/tools/ToolSchemaStudio.tsx`, `components/tools/tool-schema-studio.css`, `app/tools/tool-schema-generator/page.tsx`, `tests/tool-schema.test.ts`.

## Draft-generation repair (v0.24.1)

The Functions and Plain English examples now contain three functions. Both multi-line and sentence-separated plain-English declarations are supported. Windows, Unicode and pasted Markdown hard line breaks are normalized. Generation and example loading no longer depend on a browser confirmation; one-step Undo preserves the previous state. Result feedback appears beside Generate draft, and export prerequisites are explained beside the review checkbox. Contradictory multiplication/sum wording is flagged without rewriting the supplied meaning. This tool generates JSON, not PDFs.

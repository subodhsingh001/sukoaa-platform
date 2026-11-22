# System design course

Added 20 November 2026. This is an additive course, separate from compiler execution.

## Open the course

In the website, choose **Learn → System design tutorials**, use Search, or open `/learn/system-design`. The homepage also links to it. Each topic has a permanent child URL, beginning with `/learn/system-design/load-balancing`.

The course contains all 25 topics from the supplied image, in the same order. It uses a fictional ticket-booking application, SeatSpot. Numbers are exercises, not claims about production performance or vendor guarantees.

Each lesson includes:

- A beginner explanation, an everyday analogy and a normal/failure path.
- A six-chapter animated architecture video with computer-generated English narration, an MP4 download, English VTT captions and the full text transcript.
- An Engineering tab with a worked calculation, implementation sketch, use cases and common mistakes.
- Two interview prompts with concealed reference answers, follow-ups, a three-minute practice timer and a reasoning rubric.
- An exercise with progressive hints and a worked solution; a multiple-choice knowledge check.
- Local notes and a self-assessed completion marker. The course page exports and imports progress JSON.

There are 25 videos, 150 chapters, 50 interview prompts, 25 exercises and 25 knowledge checks. Total refreshed video duration is 5718 seconds (about 95.3 minutes). The exported handbook includes the original lessons plus expanded teaching notes and full refreshed narration. Plan about 20–35 minutes of reading, explanation and practice per lesson; the videos introduce mechanisms rather than replace the written lessons.

## Mentor approach and scope

Start with client/server, API, database, latency, throughput, p99, consistency and idempotency on the course overview. Read Simple first, pause the video to predict a step, explain it back, then use Engineering and Interview. Finish with the four-stage SeatSpot capstone. The curriculum includes both early-career and deeper engineering prompts.

This is a self-guided mentor interface, not a chatbot or an automated judge of free-text answers. It does not call an AI service, grade a real interview or promise an employment outcome. Interview prompts are original practice, not attributed to particular companies. Code/configuration snippets are instructional sketches; they do not provision real infrastructure.

## Privacy and performance

Progress uses `localStorage` under `sukoaa-system-design-v1`. No account, cloud database, Redis or new environment variables are needed. Clearing browser data removes local progress. Export before changing devices. Imported completions combine; existing non-empty notes take precedence. Imports reject unsupported formats, files over 2 MB and accepted lesson notes over 8,000 characters. Unknown lesson IDs are ignored. Notes render as text.

The videos are static assets, about 16.6 MB total (decimal). They use H.264/AAC at 960 × 540, 12 fps. Only a selected lesson has a video element; it uses `preload="none"`, no autoplay and native playback/fullscreen controls. Media is not imported into JavaScript. Downloads consume the hosting provider's bandwidth; the course does not require paid runtime execution.

## Source files

| Purpose | Files |
| --- | --- |
| Course routes | `app/learn/system-design/page.tsx`, `app/learn/system-design/[slug]/page.tsx` |
| Mentor and directory | `components/system-design/` |
| Curriculum and validation | `lib/system-design/lessons.json`, `types.ts`, `catalog.ts`, `progress.ts` |
| Rendered media metadata | `lib/system-design/media.json` |
| MP4s, captions, posters, handbook | `public/learn/system-design/` |
| Media regeneration | `scripts/system-design/render-course.py` |
| Offline export | `scripts/system-design/export-guide.py` |
| Regression checks | `tests/system-design.test.ts`, imported by the existing test suite |

New course URLs are included in the existing public-path/sitemap mechanism. Existing indexing, canonical-origin and preview-deployment safeguards still apply. No existing route, compiler implementation, auth handler or database policy was replaced.

## Run the updated project

Use Node 24. From the extracted `sukoaa-platform` folder:

```sh
npm ci --include=dev
npm run typecheck
npm test
npm run build
npm run dev
```

Open `/learn/system-design` on the port printed by Next.js. The already-rendered videos are included, so Python and FFmpeg are not needed to run or deploy the website. Commit the updated source to your existing GitHub repository and redeploy your Vercel project to publish it. No deployment or GitHub push was performed while preparing this course.

## Rebuild videos or the offline course

Only content authors need Python 3, Pillow, FFmpeg built with `libflite` and `libx264`, and DejaVu Sans fonts. Install those from your normal package sources. The default font directory is `/usr/share/fonts/truetype/dejavu`; set `SUKOAA_FONT_DIR` if it differs.

```sh
python3 scripts/system-design/render-course.py
python3 scripts/system-design/export-guide.py --output /absolute/path/to/offline-course
```

To render one known lesson, set `LESSON_ID=load-balancing` when invoking the renderer. Other manifest entries are preserved. Run the exporter after any lesson or media edit. It generates `public/learn/system-design/course-guide.md` and a standalone HTML/video folder. Zip the entire exported folder; learners extract it and open `index.html`. The offline edition includes explanations, videos, transcripts, answers and quizzes. The integrated website additionally supplies persistent notes, progress import/export and the timed interview interface. Native captions on `file://` can depend on the browser; the video itself contains readable step text and each page has a full transcript.

Narration is generated offline with Kokoro v1.0 af_heart, a synthetic English female voice, not a human recording. Diagrams and scripts are original. The source image was used to identify topic names; its portrait, social-media footage and music are not included. Tool/font attribution accompanies the media in `MEDIA-NOTICES.txt`.

## Verification and limits

- Node 24 typecheck, all 301 tests and production build passed. Four new tests cover curriculum completeness, graphs/media/captions, progress import validation and safe merging. No existing test assertions were changed or removed.
- All 25 MP4s were probed and completely decoded, including audio, without FFmpeg errors. Metadata duration agrees with the rendered video; each lesson has six timed caption chapters.
- Browser checks passed for topic search, Simple/Engineering/Interview navigation, keyboard tabs, hints, quiz feedback, timer start, notes/completion persistence, progress export and actual video playback with captions enabled.
- Course and lesson layouts were checked inside 375, 768 and 1280 px viewports with no horizontal document overflow. These are new pages, so no fictional “before” screenshots were created.
- Browser import reached its confirmation dialog, but the automation driver's dialog acceptance timed out. An end-to-end restore result is not claimed. The pure validation and merge paths are covered by passing tests.
- No live infrastructure, vendor account, actual failure drill, production SEO indexing or interview outcome was tested. Review official per-lesson references and product/version behavior before deploying infrastructure.

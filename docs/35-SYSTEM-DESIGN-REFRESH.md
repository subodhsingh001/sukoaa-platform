# System-design course refresh

Completed 22 November 2026. All 25 existing topic routes and original lesson examples remain.

## Narration and playback

All 25 animations were regenerated with Kokoro v1.0 af_heart, a generic synthetic English female voice. Total duration: 95.3 minutes. This is not a real-person recording or voice clone. The model runs only during authoring; the website serves static media and never downloads these model weights.

Audio: 24 kHz mono AAC, target −16 LUFS and −1.5 dBTP, high-pass filter at 65 Hz. Output is loudness-matched in two passes. See system-design-media-verification.json for decoded-file measurements. Technical checks do not replace a human listening review.

All videos have six seekable chapters, readable phrase captions aligned using local speech recognition and authored text, full transcripts, speed controls, replay and audio-only downloads. Reference-word matching ranged from 94.4% to 98.9%; this measures alignment, not educational quality or a human accuracy score.

## Per-topic teaching review

Every topic now includes prerequisites, three goals, a prediction with reasoning, a misconception correction, a three-step practical task, expected outcome and three interview depths. The learner-controlled diagram excludes unavailable components from active paths.

| Topic | Prediction task | Practical task | Misconception corrected |

|---|---|---|---|

| Load balancing | App A fails. Can App B always take all its traffic? | Route six paper requests | Round robin means equal CPU usage. |

| Auto scaling | CPU is low while requests wait on a database. Should CPU scaling be your only signal? | Work a scaling recommendation | Automatic scaling is instant. |

| High availability | Two apps run on different machines but use one unprotected database. Is the complete booking path redundant? | Find shared failure domains | Two replicas guarantee availability. |

| Fault tolerance | A payment call times out. Is it safe to retry with a fresh order ID? | Classify failure responses | A timeout means the remote action did not happen. |

| Horizontal scaling | Four copies reach 250 requests/second when one reaches 100. Did capacity grow four times? | Compare ideal and measured growth | More app copies automatically scale database writes. |

| Vertical scaling | A payment provider takes five seconds. Will doubling your app RAM necessarily fix it? | Write a resize experiment | A larger instance is a second failover copy. |

| Caching | A popular key expires for every visitor at once. What load reaches the database? | Trace a cache-aside sequence | A cache copy is always current until TTL expires. |

| CDN | Can an account response use the same public cache policy as a versioned stylesheet? | Classify cacheable responses | A CDN removes the origin from every request. |

| API gateway | A valid user changes /orders/17 to /orders/18. Which boundary must still verify ownership? | Trace a protected order request | The gateway replaces all service authorization. |

| Rate limiting | Ten tokens are spent immediately. After three idle seconds at two tokens/second, how many tokens remain? | Run a paper token bucket | An IP header is always a reliable user identity. |

| Circuit breaker | The breaker opens. Has it repaired the failed payment provider? | Walk the breaker states | An open breaker makes every fallback safe. |

| Message queues | A worker sends a receipt then crashes before acknowledgment. What can happen next? | Calculate a queue backlog | At-least-once delivery means exactly one business effect. |

| Event-driven architecture | BookingConfirmed is replayed. Should every subscriber repeat its old external action? | Classify messages and replay effects | Publishing an event creates one atomic transaction across subscribers. |

| Database replication | The primary confirms at 12:00:00; the replica applies at 12:00:02. What can a read at 12:00:01 show? | Draw the write/read timeline | Replication protects against every accidental deletion. |

| Database sharding | Four shards have similar row counts, but one tenant sends half the traffic. Is the workload balanced? | Map tenants to owners | Hashing guarantees equal load. |

| Data partitioning | A monthly partitioned table is queried without a date predicate. Must it read only one month? | Work a monthly history query | Table partitioning automatically scales across machines. |

| Microservices | Catalog, booking and payment must deploy together after every change. Are they operationally independent? | Draw a booking ownership map | Every function should become a microservice. |

| Service discovery | DNS resolves the payment service. Does that prove every connection will succeed? | Follow a rolling endpoint replacement | Finding an endpoint authorizes access to it. |

| Reverse proxy | A client sends X-Forwarded-For claiming to be an administrator. Should your backend trust it? | Inspect a proxy path | A reverse proxy and load balancer cannot be the same component. |

| DNS management | A resolver cached a one-hour answer ten minutes ago. Does lowering TTL now erase its cache? | Build a DNS migration timeline | DNS is an HTTP redirect. |

| Disaster recovery | Hourly-only backups are available. Do they satisfy a 15-minute recovery-point objective by themselves? | Plan a recovery drill on paper | Replication replaces recovery backups. |

| Zero-downtime deployments | Old code still reads a column while new code deploys. Can you drop that column immediately? | Stage an expand/contract rollout | maxUnavailable: 0 guarantees the whole application is correct. |

| Distributed tracing | A 100 ms database call overlaps a 300 ms payment call, with 40 ms overhead. Is total duration necessarily 440 ms? | Draw a trace timeline | A sampled trace proves every request behaved the same way. |

| Network segmentation | A database port is reachable from a booking pod. Does that authorize every SQL operation? | Create an allow/deny matrix | NetworkPolicy automatically works in every Kubernetes cluster. |

| Multi-region setup | Two disconnected regions each see the same last seat. Can both confirm it independently while preserving uniqueness? | Compare regional booking designs | Two regions automatically double availability with no trade-off. |

## Authoring and reproducibility

Authoring dependencies are isolated in scripts/system-design/requirements-media.txt. Models, speech caches and Python environments are not application dependencies or included project assets. Use render-course.py with explicit model/voice/cache paths, align-captions.py with a local Whisper model, verify-media.py, then export-guide.py. Model hashes are recorded in each media entry.

## Scope and limits

Animations are conceptual teaching diagrams using fictional examples. Their timings are not benchmarks. Existing JavaScript/Python/React and other compiler implementations, account APIs, authorization and AI API settings were not changed. Reuse controls and self-checks do not automatically grade understanding.

Media URLs carry a version query so deployed clients request the refreshed assets rather than retaining an older cached voice. Existing media paths remain usable.

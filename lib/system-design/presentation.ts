type LessonPresentation = {
  summary: string;
  workedHeading: string;
  implementationHeading: string;
  related: {href: string; label: string; description: string}[];
};

// Presentation copy for the three lessons selected from Search Console data.
// The reviewed lesson text, code, narration, questions and answers stay in place.
export const lessonPresentation: Partial<Record<string, LessonPresentation>> = {
  microservices: {
    summary: 'Follow a ticket-booking example to decide which service owns the catalog, seat reservations, payments and notifications. Compare these boundaries with a modular monolith before choosing an architecture.',
    workedHeading: 'Microservices example: booking, payment and notification',
    implementationHeading: 'Service boundaries and data ownership',
    related: [
      {href: '/learn/system-design/api-gateway', label: 'API gateway', description: 'Decide how client requests reach your services.'},
      {href: '/learn/system-design/message-queues', label: 'Message queues', description: 'Move notification work out of the synchronous booking path.'},
      {href: '/learn/system-design/distributed-tracing', label: 'Distributed tracing', description: 'Follow one request across service boundaries.'},
    ],
  },
  'zero-downtime-deployments': {
    summary: 'Trace a rolling deployment that aims to keep four replicas available while a replacement starts. Check spare capacity, readiness, connection draining and database compatibility before releasing a new version.',
    workedHeading: 'Rolling deployment example: four replicas and one replacement',
    implementationHeading: 'Kubernetes rolling-update strategy',
    related: [
      {href: '/learn/system-design/high-availability', label: 'High availability', description: 'Identify which user operations must remain available during a release.'},
      {href: '/learn/system-design/disaster-recovery', label: 'Disaster recovery', description: 'Plan what to restore when a rollback cannot recover the data.'},
      {href: '/pg-safe-migrate', label: 'Review PostgreSQL migration risks', description: 'Inspect schema changes alongside the deployment plan.'},
    ],
  },
  'rate-limiting': {
    summary: 'Work through a token bucket with 10 tokens and a refill rate of 2 tokens per second. Compare it with a fixed window, then consider shared counters and HTTP 429 responses.',
    workedHeading: 'Token bucket example: capacity, refill rate and bursts',
    implementationHeading: 'Token bucket calculation and distributed counters',
    related: [
      {href: '/learn/system-design/api-gateway', label: 'API gateway', description: 'Choose where request limits are enforced.'},
      {href: '/learn/system-design/caching', label: 'Caching', description: 'Reduce repeated work before it reaches the backend.'},
      {href: '/learn/system-design/circuit-breaker', label: 'Circuit breaker', description: 'Compare a request budget with stopping calls to a failing dependency.'},
    ],
  },
};

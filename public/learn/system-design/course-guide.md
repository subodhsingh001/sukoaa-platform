# Sukoaa system design course

25 concepts: simple explanations, engineering trade-offs, narrated animations and interview practice.

The screenshot supplies the topic list. All explanations, fictional SeatSpot examples, diagrams and practice prompts are original teaching material. They are not claimed employer questions.

## How to study

Spend around 20–35 minutes per topic: explain the analogy, pause the animation and predict the next step, work the numerical example, try the exercise, then answer the interview prompts before checking the reference. Completion and interview rubrics are self-assessment, not AI grading.

## Foundations

A client asks; a server processes requests; an API defines an interaction; a database stores records. Networks can delay, duplicate or lose communication. Latency is time per operation; throughput is completed work per time. Tail percentiles differ from averages. Idempotency preserves one intended logical effect across repetitions. Consistency describes allowed observations of data.

## Topics

1. Load balancing

2. Auto scaling

3. High availability

4. Fault tolerance

5. Horizontal scaling

6. Vertical scaling

7. Caching

8. CDN

9. API gateway

10. Rate limiting

11. Circuit breaker

12. Message queues

13. Event-driven architecture

14. Database replication

15. Database sharding

16. Data partitioning

17. Microservices

18. Service discovery

19. Reverse proxy

20. DNS management

21. Disaster recovery

22. Zero-downtime deployments

23. Distributed tracing

24. Network segmentation

25. Multi-region setup


## 1. Load balancing

One address receives requests and shares them across healthy copies of your application. It chooses a destination; it does not create extra servers or make slow database queries disappear.

### Prerequisites

Client, request, server and replica

### Learning goals

- Trace a request to a healthy replica

- distinguish routing from creating capacity

- calculate survivor capacity

### Everyday explanation

A school has three lunch counters. A helper sends each child to an open counter instead of letting everyone crowd around the first. If a counter closes, the helper stops using it. But if all counters share one empty kitchen, the helper cannot create food. Likewise, distributing requests does not remove a shared database bottleneck.

### SeatSpot scenario

In our fictional SeatSpot ticket app, many people open the same event at once. One application instance becomes overloaded while a second has spare capacity. A load balancer makes the spare capacity reachable through the same public endpoint.

### Engineering detail

At layer 4, routing works with transport connections; at layer 7 it can inspect HTTP paths, hosts or headers. Pick based on protocol, routing needs and operational cost rather than assuming layer 7 is always better.

Round robin distributes turns, not equal processing time. Least-connections can help with different connection lifetimes; weights can reflect unequal capacity. Health/readiness checks must represent whether a target can actually serve traffic.

Keep login/session state outside individual application memory when requests may reach different replicas. Drain old connections during removal. Retries of booking/payment requests need idempotency keys so a lost response does not create a second purchase.

### Worked example

Suppose one tested replica handles 200 requests/second within the latency objective and the expected peak is 450.

Three replicas provide 600 requests/second in the simplified model. Losing one leaves 400, below the peak. Four leave 600 after one failure. Real capacity must be load-tested with the database and dependencies.

Use four if that failure headroom is required and affordable. Monitor per-target latency, error rate and queueing; do not infer usable capacity from instance count alone.

### Implementation sketch

```nginx
upstream seatspot {
  server app-a:3000;
  server app-b:3000;
}
server {
  listen 8080;
  location / { proxy_pass http://seatspot; }
}
```

This minimal reverse-proxy configuration shares requests between two targets. It omits production TLS, timeouts and platform-specific health checks. Run such infrastructure locally or in your own environment, not in the browser compiler.

### Where it is used

- Stateless web/API replicas behind one endpoint.

- Spreading reads or connections across healthy service instances.

### Common mistakes

- Calling round robin a guarantee of equal CPU usage.

- Making the load balancer a single unprotected instance.

- Retrying a purchase without an idempotency key.

### Exercise

You have three replicas each safe at 150 requests/second. Peak demand is 350. Can you survive one replica failing?

Hint: Calculate surviving capacity, not total capacity.

Hint: Separate the mathematical estimate from measured performance.

Solution: After a failure, two replicas provide 300, below 350. Four total leave 450 after one failure in this simplified model. Also test dependency limits and the actual request mix.

### Interview practice

**How would you choose a load-balancing policy?**

Start with request shape, connection lifetime, replica capacity and state. Use a simple policy, health checks and observed tail latency; change it when measurements show imbalance.

Follow-up: What happens to active WebSocket connections during scale-in?

**Does a load balancer make a system highly available?**

It is one part. The balancing tier, application replicas, data layer and failure detection all need suitable redundancy and recovery. Shared dependencies can still fail the request.

Follow-up: Where would you look when every target is slow at once?

### Check your understanding

A load balancer is healthy but all database calls are slow. What should you investigate?

1. Only add another DNS record

2. The shared database and dependency saturation

3. Remove health checks

Correct option: 2. The application can share work and still wait on the same constrained dependency. Measure the request path before scaling.

### Animation transcript

**Build an intuition**

Let us understand load balancing. A school has three lunch counters. A helper sends each child to an open counter instead of letting everyone crowd around the first. If a counter closes, the helper stops using it. But if all counters share one empty kitchen, the helper cannot create food. Likewise, distributing requests does not remove a shared database bottleneck. One address receives requests and shares them across healthy copies of your application. It chooses a destination; it does not create extra servers or make slow database queries disappear.

**Follow the normal path**

Follow the normal path. Visitors send event requests to one endpoint. The load balancer selects an application target so visitors do not need to know individual server addresses. Alternate requests between App A and App B. This shares turns, but a slow request can still occupy one target much longer than another. In our fictional SeatSpot ticket app, many people open the same event at once. One application instance becomes overloaded while a second has spare capacity. A load balancer makes the spare capacity reachable through the same public endpoint.

**Predict a failure**

Now change one condition. App A stops passing readiness checks. Detection takes time; requests already in flight may fail and must be handled safely by the client. A common misunderstanding is this: Round robin means equal CPU usage. It shares turns; request cost and connection lifetime can differ. Think about this. App A fails. Can App B always take all its traffic? Pause the video and make your prediction. Only if App B and the shared dependencies have enough tested spare capacity. Health checks also take time to remove App A.

**Work through an example**

Let us reason with a concrete example. Suppose one tested replica handles 200 requests/second within the latency objective and the expected peak is 450. Three replicas provide 600 requests/second in the simplified model. Losing one leaves 400, below the peak. Four leave 600 after one failure. Real capacity must be load-tested with the database and dependencies. Use four if that failure headroom is required and affordable. Monitor per-target latency, error rate and queueing; do not infer usable capacity from instance count alone. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. New requests go to App B after the target is removed. App B needs enough spare capacity; routing cannot manufacture capacity during an outage. Both copies use the same order system. A repeated booking request carries the same idempotency key so a lost response does not charge twice. When you try the practice task, look for this result. The surviving target receives new traffic, but the database remains shared.

**Explain it back**

Check your understanding. Check latency and errors at the balancer, application and database. If both applications wait on the database, adding routing rules will not fix that bottleneck. Here is a challenge. You have three replicas each safe at 150 requests/second. Peak demand is 350. Can you survive one replica failing? Pause before the answer. After a failure, two replicas provide 300, below 350. Four total leave 450 after one failure in this simplified model. Also test dependency limits and the actual request mix. For an interview, defend a routing policy, session state and failure headroom. Say what you would measure, not only which tool you would buy.

### Make a prediction

App A fails. Can App B always take all its traffic?

Only if App B and the shared dependencies have enough tested spare capacity. Health checks also take time to remove App A.

### Correct a misconception

Round robin means equal CPU usage.

It shares turns; request cost and connection lifetime can differ.

### Practical task

Route six paper requests

- Draw two app boxes and one shared database.

- Assign six requests alternately to the apps.

- Cross out App A, then recalculate capacity before rerouting.

Expected outcome: The surviving target receives new traffic, but the database remains shared.

### Choose interview depth

**Foundation:** Explain one request and a failed target.

**Practical:** Defend a routing policy, session state and failure headroom.

**Advanced:** Discuss correlated failures, draining, retries and measured tail latency.

### Official references

- [NGINX HTTP load balancing](https://nginx.org/en/docs/http/load_balancing.html)

- [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)


## 2. Auto scaling

Auto scaling changes capacity automatically when measured demand changes. A controller observes a signal, chooses a replica count and waits for new capacity to become ready. It is a delayed feedback loop, not instant unlimited capacity.

### Prerequisites

Replica, CPU usage and readiness

### Learning goals

- Identify a useful scaling signal

- explain startup delay

- check downstream limits

### Everyday explanation

A shop manager sees a long checkout queue and opens another counter. Opening takes time: someone must arrive, sign in and prepare the till. Closing every quiet counter immediately would cause a new queue a minute later. The manager needs minimum staffing and patience, not just a rule that reacts to every small change.

### SeatSpot scenario

SeatSpot traffic grows before a popular sale. Manual scaling may arrive too late, while leaving peak capacity running all day wastes resources. Automatic control can help, provided start-up delay and dependency limits are included.

### Engineering detail

Choose a signal related to the bottleneck: CPU for CPU-bound work, queue age/backlog for asynchronous jobs, or concurrency for request workers. Low CPU does not prove health when threads are waiting on a database.

Set minimum/maximum replicas, readiness checks and scale-down stabilization. A controller can request replicas while the cluster lacks nodes or the account lacks quota. Application scaling and infrastructure scaling are different loops.

New instances can amplify database connections or cold-cache misses. Warm up carefully, bound aggregate concurrency and alert when desired capacity cannot become ready. Scheduled pre-scaling may suit a known ticket-sale time.

### Worked example

Four replicas average 80% CPU. The target is 50%, assuming similar replicas and CPU-bound work.

A simplified estimate is ceil(4 × 80 / 50) = 7 replicas. This is a teaching estimate; real controllers apply tolerances, readiness handling and other policies.

Check whether seven replicas can start, whether their total database connections fit, and whether latency improves. A replica recommendation is not proof the system is safe.

### Implementation sketch

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: {name: seatspot}
spec:
  scaleTargetRef: {apiVersion: apps/v1, kind: Deployment, name: seatspot}
  minReplicas: 2
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: {type: Utilization, averageUtilization: 60}
```

Illustrative Kubernetes configuration. CPU utilization needs CPU requests on containers and a working metrics pipeline. It does not provision a cluster or guarantee a latency objective.

### Where it is used

- Traffic with changing demand and predictable start-up characteristics.

- Worker pools with measurable backlog and safe downstream concurrency.

### Common mistakes

- Scaling on CPU while the database is the real bottleneck.

- Ignoring cold starts, quotas and node capacity.

- Rapid scale-down that repeatedly destroys useful warm capacity.

### Exercise

A queue receives 120 jobs/second. Each worker handles 20. How many workers stop backlog growth, and why might you need more?

Hint: Six matches arrivals exactly.

Hint: Recovery from a backlog requires surplus throughput.

Solution: Six workers match the average under ideal assumptions. More are needed to drain existing backlog and tolerate failures or variable duration, within downstream safety limits. Monitor oldest-job age, not just queue size.

### Interview practice

**Why can autoscaling make an outage worse?**

More replicas can open more database connections, retry unhealthy dependencies and miss the same cache. Bound concurrency and investigate the bottleneck; scale only where added capacity helps.

Follow-up: Which metric would reveal that workers are waiting rather than computing?

**How would you avoid oscillation?**

Use suitable sampling, minimum capacity, stabilization and controlled scale-in. Measure startup and shutdown behavior and test repeated bursts.

Follow-up: What would you pre-scale before a scheduled launch?

### Check your understanding

What does adding application replicas guarantee?

1. That database throughput doubles

2. That requested capacity immediately becomes ready

3. Neither of these

Correct option: 3. Scaling has delays and shared constraints. Observe readiness, capacity and end-to-end latency.

### Animation transcript

**Build an intuition**

Let us understand auto scaling. A shop manager sees a long checkout queue and opens another counter. Opening takes time: someone must arrive, sign in and prepare the till. Closing every quiet counter immediately would cause a new queue a minute later. The manager needs minimum staffing and patience, not just a rule that reacts to every small change. Auto scaling changes capacity automatically when measured demand changes. A controller observes a signal, chooses a replica count and waits for new capacity to become ready. It is a delayed feedback loop, not instant unlimited capacity.

**Follow the normal path**

Follow the normal path. The application serves visitors while metrics record utilization and request behavior. Select a signal related to the constrained resource, not simply the easiest chart. The controller compares the observed signal with a configured target and computes a desired replica count within minimum and maximum limits. SeatSpot traffic grows before a popular sale. Manual scaling may arrive too late, while leaving peak capacity running all day wastes resources. Automatic control can help, provided start-up delay and dependency limits are included.

**Predict a failure**

Now change one condition. The controller requests more replicas. Scheduling, image download, initialization and health checks take time. Desired capacity and ready capacity can differ. A common misunderstanding is this: Automatic scaling is instant. Observation, scheduling, image startup and readiness all take time. Think about this. CPU is low while requests wait on a database. Should CPU scaling be your only signal? Pause the video and make your prediction. No. CPU can be low during I/O waits. Inspect latency, concurrency, database waits and the actual constrained resource.

**Work through an example**

Let us reason with a concrete example. Four replicas average 80% CPU. The target is 50%, assuming similar replicas and CPU-bound work. A simplified estimate is ceil(4 × 80 / 50) = 7 replicas. This is a teaching estimate; real controllers apply tolerances, readiness handling and other policies. Check whether seven replicas can start, whether their total database connections fit, and whether latency improves. A replica recommendation is not proof the system is safe. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Only ready replicas should receive normal traffic. If nodes or quotas are exhausted, a controller cannot create the missing physical capacity by itself. More application copies can increase database connections. Limit aggregate concurrency so solving an application bottleneck does not create a database outage. When you try the practice task, look for this result. Seven is a simplified recommendation, not seven instantly ready or safe servers.

**Explain it back**

Check your understanding. After demand falls, stabilization prevents rapid shrinking and regrowth. Drain work before removing replicas and keep enough minimum capacity for the next burst. Here is a challenge. A queue receives 120 jobs/second. Each worker handles 20. How many workers stop backlog growth, and why might you need more? Pause before the answer. Six workers match the average under ideal assumptions. More are needed to drain existing backlog and tolerate failures or variable duration, within downstream safety limits. Monitor oldest-job age, not just queue size. For an interview, choose metrics, minimums, maximums and stabilization. Say what you would measure, not only which tool you would buy.

### Make a prediction

CPU is low while requests wait on a database. Should CPU scaling be your only signal?

No. CPU can be low during I/O waits. Inspect latency, concurrency, database waits and the actual constrained resource.

### Correct a misconception

Automatic scaling is instant.

Observation, scheduling, image startup and readiness all take time.

### Practical task

Work a scaling recommendation

- Start with four replicas at 80% CPU and a 50% target.

- Calculate 4 × 80 / 50 and round up.

- List startup time, cluster quota and database-connection limits.

Expected outcome: Seven is a simplified recommendation, not seven instantly ready or safe servers.

### Choose interview depth

**Foundation:** Describe the observe-decide-wait loop.

**Practical:** Choose metrics, minimums, maximums and stabilization.

**Advanced:** Explain quota exhaustion, feedback delay, cold-cache effects and overload protection.

### Official references

- [Kubernetes Horizontal Pod Autoscaling](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)

- [Autoscaling workloads](https://kubernetes.io/docs/concepts/workloads/autoscaling/)


## 3. High availability

High availability means meeting an agreed target for successful service over time. Redundant components and recovery reduce downtime, but a system can never promise that nothing will ever fail.

### Prerequisites

User operation, replica and failure domain

### Learning goals

- Define a user-visible objective

- find shared failures

- budget recovery time

### Everyday explanation

A school keeps two water pumps so one can help when the other stops. If both use the same broken power line, two pumps do not solve the problem. Availability depends on the whole chain and on how quickly people notice and recover, not just the number of pumps.

### SeatSpot scenario

SeatSpot must keep ticket browsing and booking usable when a machine or zone fails. Different features can have different objectives: cached event descriptions may remain available even if booking is temporarily paused to protect correct seat allocation.

### Engineering detail

Define a user-visible service level indicator, such as the fraction of valid booking attempts that finish correctly within a latency boundary. State the measurement window and exclusions before quoting an availability percentage.

Distribute replicas across relevant failure domains, such as machines or zones, and examine shared data stores, network paths, credentials and deployment systems. Two replicas on one failed host do not survive that host failure.

Redundancy needs health detection, failover and survivor capacity. Test the complete user operation during a controlled failure. Maintenance, bad configuration and deployment errors can consume the error budget as well as hardware faults.

### Worked example

An agreed objective is 99.9% time availability over an illustrative 30-day month.

30 × 24 × 60 = 43,200 minutes. A 0.1% unavailability budget is 43.2 minutes. Request-based indicators use failed eligible requests instead, so do not mix the two measurements.

Choose the objective from business needs and recovery cost. Measure actual booking success separately from whether the homepage responds.

### Implementation sketch

```yaml
# Fragment, not a complete Deployment
spec:
  replicas: 3
  template:
    spec:
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels: {app: seatspot}
```

This fragment illustrates spreading matching pods across zones. A working cluster, complete pod template and matching labels are required. It does not make the database multi-zone or remove all shared failure modes.

### Where it is used

- Services with explicit uptime and latency objectives.

- Critical user journeys that must tolerate an infrastructure failure.

### Common mistakes

- Equating a green server-health page with successful purchases.

- Putting all redundant copies in one failure domain.

- Ignoring the capacity needed after failover.

### Exercise

Two application replicas run in one zone. A second zone is added. List three things to verify before calling the service highly available.

Hint: Follow a real booking from entry point to storage.

Hint: Ask what fails together and whether survivors can handle the peak.

Solution: Check traffic failover/detection, data-layer availability and consistency, and survivor capacity. Also test shared authentication, DNS and configuration dependencies using the agreed user-visible indicator.

### Interview practice

**What is the difference between availability and reliability?**

Availability asks whether the required service is usable in its measurement window. Reliability is broader: consistent correct behavior across time and conditions. Define the actual user outcome before choosing a metric.

Follow-up: Can a fast HTTP 200 response still represent a failed booking?

**Would you promise five nines for a small startup?**

Only after requirements, architecture, operations and evidence support it. A stricter target increases redundancy and operating demands; start with a justified objective and measure an error budget.

Follow-up: Which failure would you test first?

### Check your understanding

Two replicas share the only database. What remains?

1. A possible shared single point of failure

2. Guaranteed zero downtime

3. Automatic disaster recovery

Correct option: 1. Application redundancy alone does not cover the shared database or its dependencies.

### Animation transcript

**Build an intuition**

Let us understand high availability. A school keeps two water pumps so one can help when the other stops. If both use the same broken power line, two pumps do not solve the problem. Availability depends on the whole chain and on how quickly people notice and recover, not just the number of pumps. High availability means meeting an agreed target for successful service over time. Redundant components and recovery reduce downtime, but a system can never promise that nothing will ever fail.

**Follow the normal path**

Follow the normal path. For this example, success means a correct booking response within its latency objective. A homepage response alone does not measure the same user outcome. Applications run in separate zones behind a resilient entry point. The goal is to avoid losing every application copy to the same local failure. SeatSpot must keep ticket browsing and booking usable when a machine or zone fails. Different features can have different objectives: cached event descriptions may remain available even if booking is temporarily paused to protect correct seat allocation.

**Predict a failure**

Now change one condition. Zone A becomes unavailable. Detection and rerouting consume time, and requests already in flight may fail. The objective allows an explicitly measured error budget. A common misunderstanding is this: Two replicas guarantee availability. Shared power, data, credentials or control planes can fail both replicas. Think about this. Two apps run on different machines but use one unprotected database. Is the complete booking path redundant? Pause the video and make your prediction. No. A database failure can still stop both apps. Follow the entire user operation, not only the web tier.

**Work through an example**

Let us reason with a concrete example. An agreed objective is 99.9% time availability over an illustrative 30-day month. 30 × 24 × 60 = 43,200 minutes. A 0.1% unavailability budget is 43.2 minutes. Request-based indicators use failed eligible requests instead, so do not mix the two measurements. Choose the objective from business needs and recovery cost. Measure actual booking success separately from whether the homepage responds. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Zone B receives new work. It must have enough capacity, network access and working credentials to serve the actual user operation. Both application copies need a suitable data service. A single unprotected database can still interrupt bookings even when both application zones are healthy. When you try the practice task, look for this result. The illustrative time budget is 43.2 minutes; a request-based SLI uses different units.

**Explain it back**

Check your understanding. Run a controlled failure and measure booking success and recovery time. Availability is demonstrated by user outcomes, not by counting boxes in a diagram. Here is a challenge. Two application replicas run in one zone. A second zone is added. List three things to verify before calling the service highly available. Pause before the answer. Check traffic failover/detection, data-layer availability and consistency, and survivor capacity. Also test shared authentication, DNS and configuration dependencies using the agreed user-visible indicator. For an interview, define the SLI, time window, failover and survivor capacity. Say what you would measure, not only which tool you would buy.

### Make a prediction

Two apps run on different machines but use one unprotected database. Is the complete booking path redundant?

No. A database failure can still stop both apps. Follow the entire user operation, not only the web tier.

### Correct a misconception

Two replicas guarantee availability.

Shared power, data, credentials or control planes can fail both replicas.

### Practical task

Find shared failure domains

- Draw two apps, their host/zone and shared dependencies.

- Mark what a machine, zone and database failure would remove.

- Calculate the 99.9% budget in a 30-day teaching month.

Expected outcome: The illustrative time budget is 43.2 minutes; a request-based SLI uses different units.

### Choose interview depth

**Foundation:** Explain a shared single point of failure.

**Practical:** Define the SLI, time window, failover and survivor capacity.

**Advanced:** Defend error budgets, correlated-failure drills and business-operation evidence.

### Official references

- [AWS reliability pillar](https://docs.aws.amazon.com/wellarchitected/latest/framework/reliability.html)

- [Google Cloud reliability](https://docs.cloud.google.com/architecture/framework/reliability)


## 4. Fault tolerance

Fault tolerance is the ability to keep required behavior correct when specified components fail. Name the failure you tolerate and the degraded behavior you allow. It is not a claim of immunity to every possible fault.

### Prerequisites

Timeout, request deadline and side effect

### Learning goals

- Name the tolerated fault

- choose safe degradation

- handle unknown write outcomes

### Everyday explanation

A bicycle with a spare light can still be seen when the main light breaks. But that spare light cannot fix a broken frame. A useful plan names the fault and the remaining safe behavior. A website might keep showing events when its recommendation feature fails while refusing to sell a seat it cannot confirm.

### SeatSpot scenario

A slow optional recommendation service should not use every request thread and prevent checkout. SeatSpot isolates optional work and keeps a safe core path instead of treating every dependency as equally critical.

### Engineering detail

Set timeouts based on a request deadline and propagate cancellation where supported. A dependency that never replies should not hold scarce resources forever. Bound concurrency separately for unrelated dependencies to limit the blast radius.

Retries can help transient failures but multiply load. Use a bounded attempt count, backoff and jitter, and only retry operations that are safe or protected by idempotency. A timeout does not prove the remote operation did nothing.

Choose degradation from business semantics. An older event description may be acceptable with a timestamp; inventing a payment result is not. Test partial failures and network timeouts, including a successful write whose response is lost.

### Worked example

A page fans out to three optional services with an overall 800 ms deadline. One dependency stalls for ten seconds.

A 200 ms dependency timeout can preserve some page budget, but sequential calls, retries and rendering time must also fit inside 800 ms. Timeouts are not independent free budgets.

Return the essential event page without recommendations; keep seat reservations and payment outcomes authoritative. Isolate resource pools so optional failures cannot consume core capacity.

### Implementation sketch

```TypeScript
async function optionalRecommendations(signal: AbortSignal) {
  try {
    const response = await fetch("/recommendations", {signal});
    if (!response.ok) return [];
    return await response.json();
  } catch { return []; }
}
// Caller supplies a bounded deadline and validates returned data.
```

This illustrates fallback for a genuinely optional read. Do not use an empty success result for a payment or booking operation. Runtime/schema validation and resource isolation are separate responsibilities.

### Where it is used

- Keeping optional features from taking down core operations.

- Handling a specified node, network or dependency failure safely.

### Common mistakes

- Retrying every error indefinitely.

- Returning fabricated success after a payment timeout.

- Testing only clean disconnections instead of partial failure.

### Exercise

The payment provider times out after you send a charge. What should the booking UI say and what should the backend do?

Hint: A missing response does not prove a missing charge.

Hint: Use an operation identity that survives retries.

Solution: Show a pending/unknown outcome rather than success or automatic failure. Reconcile by the same idempotency key/provider reference and update the order state. Avoid issuing a new independent charge.

### Interview practice

**How do retries cause cascading failure?**

They increase offered load while the dependency has reduced capacity. Bound attempts and concurrency, respect deadlines, add jitter and use a circuit breaker when appropriate.

Follow-up: What changes when the operation is a non-idempotent write?

**Does graceful degradation always mean returning cached data?**

No. The allowed fallback depends on correctness and privacy. Cached public descriptions may be acceptable; stale seat ownership or payment state may be unsafe.

Follow-up: Which feature would you drop first in SeatSpot?

### Check your understanding

A timed-out charge means:

1. The provider definitely did not charge

2. The outcome may be unknown and needs reconciliation

3. The app should send ten new charges

Correct option: 2. Network failure can hide a successful remote write. Preserve operation identity and reconcile.

### Animation transcript

**Build an intuition**

Let us understand fault tolerance. A bicycle with a spare light can still be seen when the main light breaks. But that spare light cannot fix a broken frame. A useful plan names the fault and the remaining safe behavior. A website might keep showing events when its recommendation feature fails while refusing to sell a seat it cannot confirm. Fault tolerance is the ability to keep required behavior correct when specified components fail. Name the failure you tolerate and the degraded behavior you allow. It is not a claim of immunity to every possible fault.

**Follow the normal path**

Follow the normal path. The event page needs correct booking information, but recommendations are optional. Give these paths different deadlines and resource budgets. Recommendations stop responding. Without a boundary, waiting calls can consume all connections or workers and affect otherwise healthy operations. A slow optional recommendation service should not use every request thread and prevent checkout. SeatSpot isolates optional work and keeps a safe core path instead of treating every dependency as equally critical.

**Predict a failure**

Now change one condition. The timeout guard ends waiting for optional work. This protects local resources but does not prove a remote write was cancelled or never happened. A common misunderstanding is this: A timeout means the remote action did not happen. A timeout describes your observation, not the remote side effect. Think about this. A payment call times out. Is it safe to retry with a fresh order ID? Pause the video and make your prediction. No. The first charge may have succeeded. Reuse a stable idempotency identity and reconcile the unknown outcome.

**Work through an example**

Let us reason with a concrete example. A page fans out to three optional services with an overall 800 ms deadline. One dependency stalls for ten seconds. A 200 ms dependency timeout can preserve some page budget, but sequential calls, retries and rendering time must also fit inside 800 ms. Timeouts are not independent free budgets. Return the essential event page without recommendations; keep seat reservations and payment outcomes authoritative. Isolate resource pools so optional failures cannot consume core capacity. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Render the essential page without suggestions. Do not turn an uncertain payment outcome into a success message just to make the page appear healthy. If a retry is appropriate, limit attempts and use backoff with jitter. Preserve one operation identity for side effects so retries do not create duplicate business actions. When you try the practice task, look for this result. Recommendations can be omitted; a confirmed payment must not be invented.

**Explain it back**

Check your understanding. Inject a slow response and a lost reply in a safe test environment. Verify core capacity and user-visible correctness rather than only testing a clean server shutdown. Here is a challenge. The payment provider times out after you send a charge. What should the booking UI say and what should the backend do? Pause before the answer. Show a pending/unknown outcome rather than success or automatic failure. Reconcile by the same idempotency key/provider reference and update the order state. Avoid issuing a new independent charge. For an interview, bound retries, cancellation and concurrency independently. Say what you would measure, not only which tool you would buy.

### Make a prediction

A payment call times out. Is it safe to retry with a fresh order ID?

No. The first charge may have succeeded. Reuse a stable idempotency identity and reconcile the unknown outcome.

### Correct a misconception

A timeout means the remote action did not happen.

A timeout describes your observation, not the remote side effect.

### Practical task

Classify failure responses

- List event browsing, recommendations and seat purchase.

- Give each an explicit acceptable degraded behavior.

- Fit dependency timeouts and bounded retries inside one request deadline.

Expected outcome: Recommendations can be omitted; a confirmed payment must not be invented.

### Choose interview depth

**Foundation:** Describe a failure and safe fallback.

**Practical:** Bound retries, cancellation and concurrency independently.

**Advanced:** Reason about ambiguous outcomes, reconciliation and isolation of resource pools.

### Official references

- [Circuit breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)

- [AWS reliability](https://docs.aws.amazon.com/wellarchitected/latest/framework/reliability.html)


## 5. Horizontal scaling

Horizontal scaling adds more machines or application copies. Work must be shareable between them. It differs from auto scaling: horizontal describes the direction of growth; automatic describes how the decision is made.

### Prerequisites

Replica, throughput and shared state

### Learning goals

- Separate scaling direction from automation

- identify serial work

- calculate scaling efficiency

### Everyday explanation

A teacher asks three helpers to check homework instead of giving one helper a faster pen. This helps if papers can be divided. It does not help much if every paper must wait for one locked answer book. Shared resources and coordination decide whether more helpers actually increase throughput.

### SeatSpot scenario

SeatSpot can run several stateless event-page replicas during a sale. A user may reach a different copy on the next request, so login state, uploaded files and reservations cannot silently live only in one replica memory.

### Engineering detail

Separate process-local temporary state from durable shared state. Use a suitable session/token design and shared storage where necessary. Sticky sessions can reduce movement but do not preserve a lost server or make state replication automatic.

Parallel throughput is limited by serial work, locks, downstream quotas and coordination overhead. Measure the actual request mix. Scaling application reads does not automatically scale the primary database write path.

Plan node/zone distribution, load balancing and instance identity. Background jobs need safe work ownership; duplicate consumers must not perform the same side effect twice. More replicas also mean more connections and observability data.

### Worked example

One replica safely serves 100 requests/second. A load test with four replicas reaches only 250.

Ideal linear scaling would suggest 400, but the measured efficiency is 250/400 = 62.5%. This number describes the experiment, not a universal law.

Investigate database locking, shared CPU, connection limits and the serial part before adding another four replicas. Re-test after each change.

### Implementation sketch

```shell
# In a configured test Kubernetes cluster:
kubectl scale deployment/seatspot --replicas=4
kubectl get pods -l app=seatspot
# Verify readiness and run a controlled load test.
```

The scale command changes desired application replicas. It does not configure load balancing, storage, a cluster autoscaler or database capacity. An HPA may own this value in an automatically scaled deployment.

### Where it is used

- Stateless request processing and parallelizable jobs.

- Distributing work and failure exposure across machines.

### Common mistakes

- Assuming four replicas always give four times throughput.

- Keeping sessions/files only on local ephemeral disk.

- Ignoring extra downstream connections from each copy.

### Exercise

An upload is saved to App A local disk. The next download request reaches App B. Propose a fix.

Hint: A load balancer does not copy files.

Hint: Distinguish durable object storage from a disposable application container.

Solution: Store the file in a shared durable object store and keep metadata/access rules in an authoritative store. Stream or redirect authorized downloads from that shared location. Do not depend on sticky sessions for durability.

### Interview practice

**What must change before scaling a stateful web process horizontally?**

Identify session, file, cache and job state; choose ownership and persistence rules. Add routing/readiness and test a request moving between replicas.

Follow-up: Which state should never be moved into a shared cache without a correctness decision?

**When will more replicas not help?**

When serial work or a shared saturated dependency dominates. Measure tail latency, queueing and dependency waits before choosing the next scaling action.

Follow-up: How would you prove that the database is limiting growth?

### Check your understanding

Horizontal scaling means:

1. Giving one machine more RAM

2. Adding application copies or machines

3. Always enabling an autoscaler

Correct option: 2. Direction and automation are different decisions; adding copies can be manual.

### Animation transcript

**Build an intuition**

Let us understand horizontal scaling. A teacher asks three helpers to check homework instead of giving one helper a faster pen. This helps if papers can be divided. It does not help much if every paper must wait for one locked answer book. Shared resources and coordination decide whether more helpers actually increase throughput. Horizontal scaling adds more machines or application copies. Work must be shareable between them. It differs from auto scaling: horizontal describes the direction of growth; automatic describes how the decision is made.

**Follow the normal path**

Follow the normal path. One application serves event pages. Its safe measured capacity is finite, and a restart can interrupt every request reaching that copy. Deploy the same application on another machine or process. Horizontal scaling adds peers rather than increasing resources inside the original machine. SeatSpot can run several stateless event-page replicas during a sale. A user may reach a different copy on the next request, so login state, uploaded files and reservations cannot silently live only in one replica memory.

**Predict a failure**

Now change one condition. Routing sends requests to ready replicas. Balance according to workload characteristics; more boxes are useful only when requests can reach them. A common misunderstanding is this: More app copies automatically scale database writes. The write owner, locks and connection limits can still constrain throughput. Think about this. Four copies reach 250 requests/second when one reaches 100. Did capacity grow four times? Pause the video and make your prediction. No. The measured efficiency is 62.5% of the ideal 400. Investigate the shared bottleneck before adding more replicas.

**Work through an example**

Let us reason with a concrete example. One replica safely serves 100 requests/second. A load test with four replicas reaches only 250. Ideal linear scaling would suggest 400, but the measured efficiency is 250/400 = 62.5%. This number describes the experiment, not a universal law. Investigate database locking, shared CPU, connection limits and the serial part before adding another four replicas. Re-test after each change. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Both replicas use the same appropriate storage for files, sessions or records. A file written only to Replica A will not magically appear on Replica B. If every request waits on one locked database operation, extra applications may add waiting instead of throughput. Trace and load-test the complete path. When you try the practice task, look for this result. A gap from ideal scaling is a diagnostic clue, not proof which dependency is slow.

**Explain it back**

Check your understanding. Compare throughput and tail latency before and after scaling. Also remove one replica to check that remaining copies serve users correctly with available capacity. Here is a challenge. An upload is saved to App A local disk. The next download request reaches App B. Propose a fix. Pause before the answer. Store the file in a shared durable object store and keep metadata/access rules in an authoritative store. Stream or redirect authorized downloads from that shared location. Do not depend on sticky sessions for durability. For an interview, discuss state, job ownership, database limits and real load tests. Say what you would measure, not only which tool you would buy.

### Make a prediction

Four copies reach 250 requests/second when one reaches 100. Did capacity grow four times?

No. The measured efficiency is 62.5% of the ideal 400. Investigate the shared bottleneck before adding more replicas.

### Correct a misconception

More app copies automatically scale database writes.

The write owner, locks and connection limits can still constrain throughput.

### Practical task

Compare ideal and measured growth

- Write the measured single-copy throughput.

- Multiply by four for the ideal reference.

- Compare the real result and name three shared constraints.

Expected outcome: A gap from ideal scaling is a diagnostic clue, not proof which dependency is slow.

### Choose interview depth

**Foundation:** Describe adding copies and sharing work.

**Practical:** Discuss state, job ownership, database limits and real load tests.

**Advanced:** Defend bottleneck measurements, coordination overhead and the cost of another replica.

### Official references

- [Google Cloud horizontal scalability](https://docs.cloud.google.com/architecture/framework/reliability/horizontal-scalability)

- [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)


## 6. Vertical scaling

Vertical scaling gives one machine more CPU, memory, storage or throughput. It can be the simplest improvement, but it has a size ceiling and does not create a second copy for failover.

### Prerequisites

CPU, memory and disk waits

### Learning goals

- Match resources to the bottleneck

- separate resizing from redundancy

- plan rollback

### Everyday explanation

A student replaces a tiny desk with a larger desk. More books fit, but there is still one desk. A bigger desk does not solve every problem: a lost key to the room still blocks access. Likewise, extra memory helps a memory bottleneck but may not help a slow external payment call.

### SeatSpot scenario

A SeatSpot database may benefit from more memory for its working set before the team considers sharding. First measure the constraint rather than buying a larger machine because the site feels slow.

### Engineering detail

Inspect CPU, memory pressure, disk latency and database waits. More RAM may reduce reads from disk; more cores do not remove a serial lock or an external network delay.

An instance-size change can require a restart or failover, depending on the platform. Test supported upgrade paths, rollback and storage compatibility. Never promise downtime-free resizing without verifying the actual service.

Compare total cost and operational effort. Vertical scaling can buy time for a small team; it is not automatically a bad design. Maintain backups and redundancy independently.

### Worked example

The database reads a 12 GB hot dataset but has only 4 GB available for useful caching.

A larger memory budget may improve hit rate; the actual benefit depends on access patterns, other memory users and query plans. Doubling RAM is not a promise of double throughput.

Profile the working set and expensive queries, test a larger instance in a safe environment and measure tail latency and restart behavior.

### Implementation sketch

```text
Measure -> resize in test -> repeat load test
Compare: p95/p99 latency, throughput, memory, I/O waits
Verify: restart/failover time and rollback plan
```

This is an operational experiment, not a browser-executable command or a recommendation for a particular paid machine.

### Where it is used

- Memory-bound databases or applications.

- A measured short-term capacity increase with a manageable upgrade path.

### Common mistakes

- Calling a larger machine highly available.

- Resizing without checking restart behavior.

- Ignoring an inefficient query that needs indexing.

### Exercise

CPU is idle but one SQL query waits on a lock. Will twice as many cores fix it?

Hint: Identify the wait before choosing a resource.

Hint: Capacity and concurrency correctness are different.

Solution: Probably not. Inspect the blocking transaction, query and locking strategy. Extra cores do not release the lock. Re-test after addressing the measured contention.

### Interview practice

**Why choose vertical before horizontal scaling?**

It can reduce coordination complexity when one larger instance meets requirements. Explain its limit, failure plan and tested upgrade path.

Follow-up: What signals tell you that resizing has stopped helping?

**What remains after resizing?**

Failure risk, backups, correctness and dependency bottlenecks remain. A bigger primary is still one primary.

Follow-up: How would you roll back an unsuccessful upgrade?

### Check your understanding

A larger database server mainly guarantees:

1. An additional failover copy

2. More allocated resources on that server

3. Unlimited write scaling

Correct option: 2. Resource allocation and redundancy solve different problems.

### Animation transcript

**Build an intuition**

Let us understand vertical scaling. A student replaces a tiny desk with a larger desk. More books fit, but there is still one desk. A bigger desk does not solve every problem: a lost key to the room still blocks access. Likewise, extra memory helps a memory bottleneck but may not help a slow external payment call. Vertical scaling gives one machine more CPU, memory, storage or throughput. It can be the simplest improvement, but it has a size ceiling and does not create a second copy for failover.

**Follow the normal path**

Follow the normal path. The application is slow. Inspect whether requests wait on CPU, memory, storage, locks or another service before selecting a bigger machine. Give the same database more appropriate resources. This is vertical scaling because the number of independent database copies has not increased. A SeatSpot database may benefit from more memory for its working set before the team considers sharding. First measure the constraint rather than buying a larger machine because the site feels slow.

**Predict a failure**

Now change one condition. More memory can hold more of the hot working set. If disk reads were the bottleneck, the experiment may show lower latency. A common misunderstanding is this: A larger instance is a second failover copy. It remains one instance unless a separate redundancy design exists. Think about this. A payment provider takes five seconds. Will doubling your app RAM necessarily fix it? Pause the video and make your prediction. No. Extra RAM does not shorten an external provider delay. Measure the critical path first.

**Work through an example**

Let us reason with a concrete example. The database reads a 12 GB hot dataset but has only 4 GB available for useful caching. A larger memory budget may improve hit rate; the actual benefit depends on access patterns, other memory users and query plans. Doubling RAM is not a promise of double throughput. Profile the working set and expensive queries, test a larger instance in a safe environment and measure tail latency and restart behavior. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. A size change may restart or fail over the database. Use the actual platform procedure and verify what users see during the transition. Repeat the same controlled workload. Compare throughput, tail latency, waits and cost; do not use machine size as the success metric. When you try the practice task, look for this result. A resize is justified by observed improvement and operational constraints, not instance size alone.

**Explain it back**

Check your understanding. The larger machine still needs redundancy and backups. If the machine fails or reaches its size ceiling, a different design decision is needed. Here is a challenge. CPU is idle but one SQL query waits on a lock. Will twice as many cores fix it? Pause before the answer. Probably not. Inspect the blocking transaction, query and locking strategy. Extra cores do not release the lock. Re-test after addressing the measured contention. For an interview, choose a resource using profiling and compare cost. Say what you would measure, not only which tool you would buy.

### Make a prediction

A payment provider takes five seconds. Will doubling your app RAM necessarily fix it?

No. Extra RAM does not shorten an external provider delay. Measure the critical path first.

### Correct a misconception

A larger instance is a second failover copy.

It remains one instance unless a separate redundancy design exists.

### Practical task

Write a resize experiment

- Record latency, memory pressure, CPU and I/O waits.

- Choose one resource change in a test environment.

- Repeat the same workload and measure restart/recovery behavior.

Expected outcome: A resize is justified by observed improvement and operational constraints, not instance size alone.

### Choose interview depth

**Foundation:** Explain making one machine larger.

**Practical:** Choose a resource using profiling and compare cost.

**Advanced:** Discuss size ceilings, migration/restart behavior, rollback and alternative query improvements.

### Official references

- [Scaling trade-offs](https://docs.cloud.google.com/architecture/framework/reliability/horizontal-scalability)


## 7. Caching

A cache keeps a reusable copy so future reads can avoid slower work. Copies can become stale or disappear. Decide what may be cached, for how long and who is allowed to read it.

### Prerequisites

Source of truth, key and expiry

### Learning goals

- Trace cache-aside hits/misses

- reason about staleness

- protect the cold-cache path

### Everyday explanation

You keep a timetable on your desk instead of walking to the office every time. It is fast, but a changed timetable makes your copy wrong. The expiry time tells you when to check again; it does not make the copy correct until then.

### SeatSpot scenario

SeatSpot event descriptions change rarely and are read often. They are good cache candidates. Available-seat ownership and payment outcomes need stricter correctness rules than a public description.

### Engineering detail

In cache-aside, read the cache, fetch from the source on a miss, then populate the cache. The source remains authoritative. Define keys, TTL, invalidation and serialization; include tenant/user scope when needed.

A popular expired key can cause a cache stampede. Coalesce concurrent loads, add TTL jitter or use controlled stale-while-revalidate where staleness is allowed. Protect the source if the cache is unavailable.

Monitor hit rate, eviction and stale-result impact. A high hit rate can hide a very expensive miss path. Never cache private responses under a shared key that omits the authorization context.

### Worked example

An illustrative endpoint receives 1,000 reads/second with an 80% cache hit rate.

About 200 reads/second reach the source in the simplified model. After a cache outage, the source may suddenly receive all 1,000.

Test the cold-cache path, bound concurrent refill work and specify acceptable staleness for descriptions. Do not use the estimate to promise production capacity.

### Implementation sketch

```TypeScript
async function description(id: string) {
  const key = `event:v1:${id}`;
  const hit = await cache.get(key);
  if (hit !== null) return hit;
  const value = await db.events.find(id);
  await cache.set(key, value, {ttlSeconds: 60});
  return value;
}
```

Illustrative pseudocode: cache/db adapters are not defined. Real code must handle errors, null values, concurrent misses, validation and invalidation.

### Where it is used

- Repeated expensive reads with an explicit staleness budget.

- Public descriptions, computed summaries and suitable static assets.

### Common mistakes

- Treating a cache as the only durable copy.

- Caching private data with a public shared key.

- Ignoring simultaneous misses after expiry.

### Exercise

An event title changes but users still see the old title. Explain two remedies.

Hint: Identify the source of truth.

Hint: Expiry and invalidation have different timing.

Solution: Invalidate or version the affected cache entry on a successful update, or accept the documented TTL staleness. Consider races between refill and update; test the chosen consistency behavior.

### Interview practice

**How would you choose a TTL?**

Start from the acceptable staleness, update rate, miss cost and refill load. Measure behavior rather than selecting a universal number.

Follow-up: What happens when the hottest key expires?

**Should available seats be cached?**

A read cache may support approximate browsing, but reservation correctness must be checked against authoritative state with concurrency control.

Follow-up: How do you prevent two users booking the same seat?

### Check your understanding

When a cache disappears:

1. The source might receive a sudden load spike

2. All data must be permanently lost

3. Queries become free

Correct option: 1. A disposable cache needs a safe miss path and enough protection for its source.

### Animation transcript

**Build an intuition**

Let us understand caching. You keep a timetable on your desk instead of walking to the office every time. It is fast, but a changed timetable makes your copy wrong. The expiry time tells you when to check again; it does not make the copy correct until then. A cache keeps a reusable copy so future reads can avoid slower work. Copies can become stale or disappear. Decide what may be cached, for how long and who is allowed to read it.

**Follow the normal path**

Follow the normal path. The reader asks for a public event description. The key identifies the resource and representation; private results need appropriate identity scoping. A reusable cached value returns quickly. Its age matters: a fast response can still be too stale for the business operation. SeatSpot event descriptions change rarely and are read often. They are good cache candidates. Available-seat ownership and payment outcomes need stricter correctness rules than a public description.

**Predict a failure**

Now change one condition. If the value is absent or expired, fetch from the source of truth. A miss is normal and must have bounded latency and safe error handling. A common misunderstanding is this: A cache copy is always current until TTL expires. It can become stale immediately after a source update; expiry is not a correctness guarantee. Think about this. A popular key expires for every visitor at once. What load reaches the database? Pause the video and make your prediction. Many concurrent misses can refill the same value. Coalesce work, stagger expiry or serve controlled stale data where allowed.

**Work through an example**

Let us reason with a concrete example. An illustrative endpoint receives 1,000 reads/second with an 80% cache hit rate. About 200 reads/second reach the source in the simplified model. After a cache outage, the source may suddenly receive all 1,000. Test the cold-cache path, bound concurrent refill work and specify acceptable staleness for descriptions. Do not use the estimate to promise production capacity. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Many readers may miss the same hot key together. Coalesce loads or bound refill work so the cache does not amplify pressure on the database. Populate the cache with an explicit lifetime. Plan what happens after an update and whether serving an older value is acceptable during refresh. When you try the practice task, look for this result. At 1,000 reads/second, source demand can jump from about 200 to 1,000 when the cache disappears.

**Explain it back**

Check your understanding. Remove the cache in a safe test. Observe source traffic, latency and errors. A warm hit-rate chart alone does not prove the architecture can recover. Here is a challenge. An event title changes but users still see the old title. Explain two remedies. Pause before the answer. Invalidate or version the affected cache entry on a successful update, or accept the documented TTL staleness. Consider races between refill and update; test the chosen consistency behavior. For an interview, choose key scope, invalidation and stampede control. Say what you would measure, not only which tool you would buy.

### Make a prediction

A popular key expires for every visitor at once. What load reaches the database?

Many concurrent misses can refill the same value. Coalesce work, stagger expiry or serve controlled stale data where allowed.

### Correct a misconception

A cache copy is always current until TTL expires.

It can become stale immediately after a source update; expiry is not a correctness guarantee.

### Practical task

Trace a cache-aside sequence

- Write a cache key for a public event description.

- Follow miss → source read → cache write, then a hit.

- Remove the cache and estimate load at 80% previous hit rate.

Expected outcome: At 1,000 reads/second, source demand can jump from about 200 to 1,000 when the cache disappears.

### Choose interview depth

**Foundation:** Explain a hit, miss and source of truth.

**Practical:** Choose key scope, invalidation and stampede control.

**Advanced:** Defend consistency boundaries, cold-cache capacity and private-data isolation.

### Official references

- [Cache-aside pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

- [Caching guidance](https://learn.microsoft.com/en-us/azure/architecture/best-practices/caching)


## 8. CDN

A content delivery network serves suitable content from locations closer to users. It can cache public assets and reduce origin traffic. It does not make private or rapidly changing data safe to cache automatically.

### Prerequisites

HTTP response, public asset and cache key

### Learning goals

- Follow edge hit/miss paths

- distinguish public/private responses

- use versioned asset URLs

### Everyday explanation

A publisher places copies of a book in many nearby libraries. A student borrows locally instead of travelling to the printing factory. A personalized sealed letter should not be put on the shared shelf. Similarly, images and versioned scripts differ from private booking responses.

### SeatSpot scenario

SeatSpot posters and JavaScript bundles are useful near visitors. The booking API still needs authorization, correct seat state and an explicit cache policy.

### Engineering detail

Distinguish origin, edge cache and cache key. Query parameters, request headers and cookies can affect the representation. A key that combines different users can expose private content.

Use content-hashed names for immutable assets and appropriate Cache-Control. Replacing bytes behind the same long-cached name can leave older copies visible until expiry or invalidation.

CDN routing and cache state vary by location. Measure real-user latency and origin errors. A cache miss, dynamic route or invalidation still depends on the origin.

### Worked example

An illustrative 1 MB poster is requested 10,000 times.

Uncached origin transfer would be about 10 GB in decimal units. A 90% edge hit rate would reduce those origin payload reads to roughly 1 GB, ignoring overhead and refresh behavior.

Use explicit public asset policies and versioned filenames; treat booking/account routes separately. Costs, topology and actual hit rate depend on the provider and workload.

### Implementation sketch

```HTTP
Cache-Control: public, max-age=31536000, immutable
# Suitable only when the URL changes with the content:
/assets/event-poster.7f3a9c.webp

# Example private account response:
Cache-Control: private, no-store
```

Header examples, not a complete privacy policy. Verify behavior in browsers and intermediaries; do not apply an immutable public policy to personalized responses.

### Where it is used

- Global delivery of posters, stylesheets and versioned bundles.

- Reducing repetitive public-content work at the origin.

### Common mistakes

- Caching personalized responses without an identity-safe key.

- Calling every CDN request a cache hit.

- Replacing an immutable file without changing its URL.

### Exercise

A new logo is uploaded at the old immutable URL but users see the previous one. What is a safer release approach?

Hint: Content identity belongs in the URL.

Hint: Updating source files is separate from deploying them.

Solution: Deploy the new asset under a content-versioned URL and update references. Confirm the production deployment, response headers and edge behavior; invalidate legacy copies if necessary.

### Interview practice

**Does a CDN remove the need for an origin?**

No. Misses and noncached requests still need origin behavior unless content is fully hosted at the edge. Explain the request classes and failure paths.

Follow-up: How would you test origin failure?

**How do you cache an authenticated API?**

First decide whether caching is allowed. Private identity and authorization vary; bypassing shared cache may be safer. Explicitly validate cache keys and policies.

Follow-up: Which cookie or header changes the response?

### Check your understanding

Which asset suits immutable public caching?

1. A changing account balance at one fixed URL

2. A content-hashed public CSS file

3. A private session token

Correct option: 2. The URL changes with the bytes, so clients can retain that exact public representation.

### Animation transcript

**Build an intuition**

Let us understand cdn. A publisher places copies of a book in many nearby libraries. A student borrows locally instead of travelling to the printing factory. A personalized sealed letter should not be put on the shared shelf. Similarly, images and versioned scripts differ from private booking responses. A content delivery network serves suitable content from locations closer to users. It can cache public assets and reduce origin traffic. It does not make private or rapidly changing data safe to cache automatically.

**Follow the normal path**

Follow the normal path. A visitor requests a public poster. The content delivery network routes the request to a suitable edge location rather than always going directly to the origin. If the edge has a valid copy, it returns that representation. This can reduce both response latency and repeated origin transfer. SeatSpot posters and JavaScript bundles are useful near visitors. The booking API still needs authorization, correct seat state and an explicit cache policy.

**Predict a failure**

Now change one condition. A missing or expired representation needs an origin fetch. The origin and its network path still matter for uncached work. A common misunderstanding is this: A CDN removes the origin from every request. Cache misses and dynamic requests still depend on the origin. Think about this. Can an account response use the same public cache policy as a versioned stylesheet? Pause the video and make your prediction. No. Private representations need deliberate cache keys and policies. Shared caching can leak another user’s response.

**Work through an example**

Let us reason with a concrete example. An illustrative 1 MB poster is requested 10,000 times. Uncached origin transfer would be about 10 GB in decimal units. A 90% edge hit rate would reduce those origin payload reads to roughly 1 GB, ignoring overhead and refresh behavior. Use explicit public asset policies and versioned filenames; treat booking/account routes separately. Costs, topology and actual hit rate depend on the provider and workload. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. When asset bytes change, publish a new content-versioned name. Long-lived immutable caching only fits a URL whose content will not change. An account or booking response may be personal and time-sensitive. Do not place it on the shared public cache path without a deliberately safe policy. When you try the practice task, look for this result. A content-hashed public file is a suitable immutable candidate; the account statement is not.

**Explain it back**

Check your understanding. Compare edge hits, misses and private requests separately. A fast cached poster does not show whether the booking API meets its latency and correctness objectives. Here is a challenge. A new logo is uploaded at the old immutable URL but users see the previous one. What is a safer release approach? Pause before the answer. Deploy the new asset under a content-versioned URL and update references. Confirm the production deployment, response headers and edge behavior; invalidate legacy copies if necessary. For an interview, defend cache keys, expiry and invalidation. Say what you would measure, not only which tool you would buy.

### Make a prediction

Can an account response use the same public cache policy as a versioned stylesheet?

No. Private representations need deliberate cache keys and policies. Shared caching can leak another user’s response.

### Correct a misconception

A CDN removes the origin from every request.

Cache misses and dynamic requests still depend on the origin.

### Practical task

Classify cacheable responses

- List a hashed CSS file, event poster and account statement.

- Assign public immutable or private/no-store policies with reasons.

- Change one asset and decide whether its URL must change.

Expected outcome: A content-hashed public file is a suitable immutable candidate; the account statement is not.

### Choose interview depth

**Foundation:** Explain an edge hit and miss.

**Practical:** Defend cache keys, expiry and invalidation.

**Advanced:** Discuss regional hit rates, origin failures, personalization and bandwidth cost.

### Official references

- [CloudFront concepts](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)

- [HTTP caching specification](https://www.rfc-editor.org/rfc/rfc9111)


## 9. API gateway

An API gateway is an entry layer that applies shared API policies and routes requests to services. Authentication, quotas and request validation may live there, but business authorization still belongs near the protected data.

### Prerequisites

Authentication, service and record ownership

### Learning goals

- Separate authentication from authorization

- trace routing

- bound fan-out

### Everyday explanation

A school reception desk checks visitor identity and sends visitors to the right office. Passing reception does not mean a visitor can open every cupboard. Services still decide which records or actions that person is permitted to access.

### SeatSpot scenario

SeatSpot exposes event, order and payment services through one public API. Shared routing and coarse policies can be managed consistently, while each service owns its business rules.

### Engineering detail

An API gateway may terminate TLS, validate tokens, apply request limits and route by API version/path. A reverse proxy can overlap with these capabilities; these are roles, not necessarily separate products.

Verify token issuer, audience, expiry and signature using a maintained implementation. Do not trust user-supplied identity headers. The order service must still verify that this user owns the requested order.

Protect the gateway itself with capacity, redundancy and observability. Aggregating many downstream calls can create latency and failure coupling; define deadlines and keep the entry layer from becoming a large business-logic monolith.

### Worked example

A mobile screen calls events and orders through one gateway.

Its latency includes gateway work plus downstream waits. Two parallel calls take approximately the slower path plus overhead; two sequential calls add their delays. Real dependency behavior and timeouts determine the result.

Keep routing/coarse policy central but preserve domain authorization and tracing in services. Test a gateway outage and a single unhealthy downstream service.

### Implementation sketch

```text
GET /api/events/:id  -> event service
GET /api/orders/:id  -> order service
Gateway: validate token, request size, coarse quota
Order service: verify ownership for this order
```

Architecture sketch only. Paths and policy wording are illustrative, not a deployed gateway or complete authentication implementation.

### Where it is used

- A managed public boundary for several APIs.

- Consistent token validation, coarse quotas and version routing.

### Common mistakes

- Assuming token validation proves ownership of every resource.

- Forwarding client-supplied identity headers as trusted identity.

- Creating one unbounded aggregation request.

### Exercise

A signed-in user changes an order ID in the URL. Which component must stop cross-user access?

Hint: Authentication answers who, not whether this order belongs to them.

Hint: Enforce ownership in the data/service boundary.

Solution: The order service must perform resource-level authorization using verified identity. Gateway checks are useful but cannot replace ownership enforcement.

### Interview practice

**API gateway versus reverse proxy?**

A reverse proxy forwards requests on behalf of servers. An API gateway specializes that entry role with API-facing policy and lifecycle features; one product may perform both.

Follow-up: What logic should stay out of the gateway?

**What is your gateway failure strategy?**

Use a suitably redundant entry tier, bounded work and observability. Analyze whether bypass is safe; bypassing authentication or limits is not an acceptable automatic fallback.

Follow-up: How do you rotate validation keys safely?

### Check your understanding

A valid access token means:

1. The user may read every order

2. Identity may be established, but resource authorization is still needed

3. Rate limits no longer apply

Correct option: 2. Authentication and resource-level authorization solve different questions.

### Animation transcript

**Build an intuition**

Let us understand api gateway. A school reception desk checks visitor identity and sends visitors to the right office. Passing reception does not mean a visitor can open every cupboard. Services still decide which records or actions that person is permitted to access. An API gateway is an entry layer that applies shared API policies and routes requests to services. Authentication, quotas and request validation may live there, but business authorization still belongs near the protected data.

**Follow the normal path**

Follow the normal path. The client calls a public API address. The gateway provides a shared routing boundary instead of requiring clients to know every internal service location. Validate the request and supported identity credentials with maintained security libraries. Reject oversized or invalid traffic before forwarding expensive work. SeatSpot exposes event, order and payment services through one public API. Shared routing and coarse policies can be managed consistently, while each service owns its business rules.

**Predict a failure**

Now change one condition. Event requests go to the event service; order requests go to the order service. API versions and paths should have deliberate routing rules. A common misunderstanding is this: The gateway replaces all service authorization. Each service must protect its business actions and resources. Think about this. A valid user changes /orders/17 to /orders/18. Which boundary must still verify ownership? Pause the video and make your prediction. The order service or data-access boundary must authorize that record. Passing gateway authentication is insufficient.

**Work through an example**

Let us reason with a concrete example. A mobile screen calls events and orders through one gateway. Its latency includes gateway work plus downstream waits. Two parallel calls take approximately the slower path plus overhead; two sequential calls add their delays. Real dependency behavior and timeouts determine the result. Keep routing/coarse policy central but preserve domain authorization and tracing in services. Test a gateway outage and a single unhealthy downstream service. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. The order service checks ownership and allowed actions using verified identity. Passing gateway authentication does not grant access to another visitor order. If one API request fans out, set deadlines and partial-failure behavior. A slow optional service should not hold every gateway worker indefinitely. When you try the practice task, look for this result. A verified identity does not grant access to every record.

**Explain it back**

Check your understanding. Trace requests through the boundary and test gateway capacity and redundancy. Centralizing policy is useful, but it also creates an important operational dependency. Here is a challenge. A signed-in user changes an order ID in the URL. Which component must stop cross-user access? Pause before the answer. The order service must perform resource-level authorization using verified identity. Gateway checks are useful but cannot replace ownership enforcement. For an interview, explain token checks, quotas, deadlines and resource ownership. Say what you would measure, not only which tool you would buy.

### Make a prediction

A valid user changes /orders/17 to /orders/18. Which boundary must still verify ownership?

The order service or data-access boundary must authorize that record. Passing gateway authentication is insufficient.

### Correct a misconception

The gateway replaces all service authorization.

Each service must protect its business actions and resources.

### Practical task

Trace a protected order request

- Draw the client, gateway and order owner.

- Mark token validation at the gateway.

- Mark record ownership at the service and test another user’s order ID.

Expected outcome: A verified identity does not grant access to every record.

### Choose interview depth

**Foundation:** Describe routing through one API boundary.

**Practical:** Explain token checks, quotas, deadlines and resource ownership.

**Advanced:** Defend aggregation budgets, redundancy, key rotation and policy bypass risks.

### Official references

- [Kubernetes service entry concepts](https://kubernetes.io/docs/concepts/services-networking/service/)

- [API Gateway throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)


## 10. Rate limiting

Rate limiting controls how much work an identity or client may request over time. It protects capacity and fairness, but it is not a complete defense against every attack.

### Prerequisites

Identity, elapsed time and concurrency

### Learning goals

- Distinguish rate and concurrency

- refill a token bucket

- explain shared counters

### Everyday explanation

A library lets each student borrow a limited number of books so one student cannot empty the shelves. A short burst may be acceptable, but repeated borrowing must remain within a fair rate. The rule needs a reliable way to identify the student, not just the colour of their shoes.

### SeatSpot scenario

SeatSpot protects sign-in and booking attempts from excessive traffic. Public browsing, expensive searches and paid customers may need different budgets; one shared limit for everyone can punish unrelated users.

### Engineering detail

Define the principal, scope, sustained rate and burst capacity. A token bucket refills tokens over time; requests consume them. A fixed window is simpler but can admit a boundary burst across adjacent windows.

In a distributed service, per-process counters are not a strict global limit. Use appropriate atomic shared state or a deliberately partitioned budget. Document any best-effort behavior and what happens when the limiter store is unavailable.

A 429 response should communicate a safe retry policy where appropriate. Combine limits with bounded concurrency, authentication and abuse controls. Do not trust a spoofable forwarded-IP header or identify all users behind one NAT as one person without considering fairness.

### Worked example

A teaching token bucket has capacity 10 and refills at 2 tokens/second.

If initially full, ten immediate requests can consume ten tokens. After 3 idle seconds it has six tokens, capped at ten. This model ignores distributed races until an atomic implementation is chosen.

Choose a key and storage behavior explicitly. Protect critical actions with a deliberate fail-closed or degraded policy rather than silently giving unlimited access after a store failure.

### Implementation sketch

```text
tokens = min(capacity, tokens + elapsedSeconds * refillRate)
if tokens >= requestCost:
    tokens -= requestCost
    allow
else:
    reject with 429 and retry guidance
```

Conceptual single-key token-bucket algorithm. Reading, refilling and consuming must be atomic for a shared distributed limiter. It is not production middleware.

### Where it is used

- Protecting costly or abuse-prone API actions.

- Per-tenant fairness and upstream quota protection.

### Common mistakes

- Using independent instance counters as a global guarantee.

- Trusting client-provided IP identity.

- Retrying 429 responses immediately in a tight loop.

### Exercise

Three replicas each allow 100 requests/minute for one user. Is the global user limit 100?

Hint: Ask where the state lives.

Hint: A client can reach different replicas.

Solution: Not with independent counters: the user may receive up to roughly 300 across replicas, depending on routing and windows. Use an atomic shared budget or state explicitly that the policy is per instance.

### Interview practice

**Token bucket or fixed window?**

Explain sustained rate, burst tolerance, boundary behavior and storage cost. Pick the policy from requirements and test concurrent enforcement.

Follow-up: What state must be updated atomically?

**What if Redis is down?**

Choose fail-closed, fallback or limited degraded behavior per endpoint risk. Alert and bound capacity; do not silently pretend a global guarantee still holds.

Follow-up: Would browsing and payment creation use the same fallback?

### Check your understanding

Why can a fixed window admit a large short burst?

1. Requests near the end and start of adjacent windows use different budgets

2. It has no counters

3. It requires one server forever

Correct option: 1. Window boundaries can allow two budgets in a short interval. Choose the intended burst semantics.

### Animation transcript

**Build an intuition**

Let us understand rate limiting. A library lets each student borrow a limited number of books so one student cannot empty the shelves. A short burst may be acceptable, but repeated borrowing must remain within a fair rate. The rule needs a reliable way to identify the student, not just the colour of their shoes. Rate limiting controls how much work an identity or client may request over time. It protects capacity and fairness, but it is not a complete defense against every attack.

**Follow the normal path**

Follow the normal path. Requests are assigned a deliberate identity key, such as a verified account and endpoint. A spoofable header cannot safely define a protected client budget. The token bucket refills over elapsed time up to its capacity. Capacity permits a bounded burst while the refill rate controls sustained use. SeatSpot protects sign-in and booking attempts from excessive traffic. Public browsing, expensive searches and paid customers may need different budgets; one shared limit for everyone can punish unrelated users.

**Predict a failure**

Now change one condition. Checking and consuming a token must behave as one operation for shared state. Separate reads and writes can overspend under concurrency. A common misunderstanding is this: An IP header is always a reliable user identity. Client-controlled forwarding headers can be forged, and many people share one NAT address. Think about this. Ten tokens are spent immediately. After three idle seconds at two tokens/second, how many tokens remain? Pause the video and make your prediction. Six, capped by the bucket capacity of ten. Concurrent updates need an atomic implementation to preserve that rule.

**Work through an example**

Let us reason with a concrete example. A teaching token bucket has capacity 10 and refills at 2 tokens/second. If initially full, ten immediate requests can consume ten tokens. After 3 idle seconds it has six tokens, capped at ten. This model ignores distributed races until an atomic implementation is chosen. Choose a key and storage behavior explicitly. Protect critical actions with a deliberate fail-closed or degraded policy rather than silently giving unlimited access after a store failure. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. A request with enough tokens proceeds, but still faces authorization, request validation and downstream concurrency limits. Passing the limiter is not a correctness guarantee. A request without budget receives a clear rejection and retry guidance where appropriate. Clients should wait rather than creating an immediate retry storm. When you try the practice task, look for this result. Only the available budget is admitted; a 429 response can communicate a retry policy.

**Explain it back**

Check your understanding. If the shared limiter fails, enforce the chosen endpoint policy and alert. Independent local counters do not preserve a strict global quota across replicas. Here is a challenge. Three replicas each allow 100 requests/minute for one user. Is the global user limit 100? Pause before the answer. Not with independent counters: the user may receive up to roughly 300 across replicas, depending on routing and windows. Use an atomic shared budget or state explicitly that the policy is per instance. For an interview, choose a principal, atomic state and store-failure policy. Say what you would measure, not only which tool you would buy.

### Make a prediction

Ten tokens are spent immediately. After three idle seconds at two tokens/second, how many tokens remain?

Six, capped by the bucket capacity of ten. Concurrent updates need an atomic implementation to preserve that rule.

### Correct a misconception

An IP header is always a reliable user identity.

Client-controlled forwarding headers can be forged, and many people share one NAT address.

### Practical task

Run a paper token bucket

- Start a bucket with capacity ten and ten tokens.

- Spend all ten on a burst, then advance time three seconds.

- Refill six and test another burst before enough time passes.

Expected outcome: Only the available budget is admitted; a 429 response can communicate a retry policy.

### Choose interview depth

**Foundation:** Explain sustained rate and burst allowance.

**Practical:** Choose a principal, atomic state and store-failure policy.

**Advanced:** Discuss distributed budgets, hot keys, NAT fairness and overload beyond request rate.

### Official references

- [API throttling behavior](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)

- [Throttling pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/throttling)


## 11. Circuit breaker

A circuit breaker temporarily stops calls to a dependency that appears unhealthy, then cautiously tests recovery. It prevents repeated waiting and extra pressure; it does not repair the dependency.

### Prerequisites

Dependency, timeout and failure measurement

### Learning goals

- Follow closed/open/half-open

- bound recovery probes

- separate breaker and retry

### Everyday explanation

A home fuse interrupts an unsafe circuit instead of letting every appliance keep drawing current. A software breaker is not the same physical mechanism, but the useful idea is similar: stop repeated harmful attempts, observe conditions and restore access carefully.

### SeatSpot scenario

If SeatSpot recommendations repeatedly time out, continuing to call them can occupy every connection. A breaker can reject or use a safe optional fallback while core booking work continues.

### Engineering detail

Closed means normal calls are allowed while failures are measured. Open means calls are rejected quickly for a period. Half-open allows a limited probe set; success can close the breaker and failure can reopen it.

Define eligible failures, a minimum sample, threshold, window and reset policy. A small number of failures at low traffic can mislead a naive ratio. Per-instance breakers can reach different states, which must be understood operationally.

Combine timeouts, concurrency isolation and bounded retries. A breaker protects resources only if requests cannot pile up elsewhere. Fallback must preserve business meaning; do not fabricate a successful charge.

### Worked example

An illustrative breaker opens after enough samples show a 50% eligible-failure rate in its window.

A minimum of 20 calls avoids opening after one failure out of one call in this example. The numbers are teaching choices, not recommended universal settings.

Define which timeouts/errors count, limit half-open probes and watch false trips alongside recovery time.

### Implementation sketch

```text
CLOSED: allow calls and record eligible outcomes
OPEN: reject quickly or use a safe fallback
After reset interval -> HALF_OPEN
HALF_OPEN: limited probes; success -> CLOSED
Failed probe -> OPEN
```

State-machine sketch only. Production libraries must handle concurrency, cancellation and metric windows correctly.

### Where it is used

- Isolating an unhealthy dependency.

- Fast optional fallback during repeated remote failures.

### Common mistakes

- Treating an open breaker as proof of root cause.

- Allowing every caller to probe recovery at once.

- Returning fake success for essential writes.

### Exercise

What should a breaker do after the reset interval?

Hint: Allow a small probe set.

Hint: Avoid sending all queued work immediately.

Solution: Move to half-open with bounded probes. Evaluate actual outcomes before restoring full traffic; otherwise recovering capacity may be overwhelmed again.

### Interview practice

**Circuit breaker versus retry?**

Retry attempts an operation again; a breaker stops attempts temporarily when failure evidence justifies it. They need a shared time and load budget.

Follow-up: Can retries stop the breaker from detecting real errors?

**How do you select a threshold?**

Use traffic volume, failure types, latency objective and cost of false trips. Include minimum samples and test recovery rather than copying arbitrary percentages.

Follow-up: How does low request volume change the design?

### Check your understanding

Half-open should usually:

1. Let every caller through at once

2. Allow bounded recovery probes

3. Delete the database

Correct option: 2. Limited probes avoid overwhelming a dependency before recovery is established.

### Animation transcript

**Build an intuition**

Let us understand circuit breaker. A home fuse interrupts an unsafe circuit instead of letting every appliance keep drawing current. A software breaker is not the same physical mechanism, but the useful idea is similar: stop repeated harmful attempts, observe conditions and restore access carefully. A circuit breaker temporarily stops calls to a dependency that appears unhealthy, then cautiously tests recovery. It prevents repeated waiting and extra pressure; it does not repair the dependency.

**Follow the normal path**

Follow the normal path. The breaker allows normal calls and records eligible outcomes. Timeouts still bound each attempt; a closed breaker is not a guarantee of health. The dependency times out repeatedly. A minimum sample and measurement window help distinguish a pattern from a single unlucky request. If SeatSpot recommendations repeatedly time out, continuing to call them can occupy every connection. A breaker can reject or use a safe optional fallback while core booking work continues.

**Predict a failure**

Now change one condition. The breaker opens and rejects dependency calls quickly. This frees local resources and avoids repeating expensive failures while recovery is investigated. A common misunderstanding is this: An open breaker makes every fallback safe. A fallback must preserve business meaning; it cannot fabricate a successful payment. Think about this. The breaker opens. Has it repaired the failed payment provider? Pause the video and make your prediction. No. It stops repeated calls quickly. Recovery probes only test whether the dependency can be used again.

**Work through an example**

Let us reason with a concrete example. An illustrative breaker opens after enough samples show a 50% eligible-failure rate in its window. A minimum of 20 calls avoids opening after one failure out of one call in this example. The numbers are teaching choices, not recommended universal settings. Define which timeouts/errors count, limit half-open probes and watch false trips alongside recovery time. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Optional recommendations can be omitted. Essential payment outcomes must remain pending or failed according to verified state, not invented to hide the outage. After a reset interval, allow a limited probe set. Sending every waiting caller at once can overload a dependency that is only partly recovered. When you try the practice task, look for this result. Few probes avoid a recovery stampede; thresholds are workload choices.

**Explain it back**

Check your understanding. Successful probes restore normal traffic; failed probes reopen the breaker. Observe both false trips and recovery behavior under controlled failure tests. Here is a challenge. What should a breaker do after the reset interval? Pause before the answer. Move to half-open with bounded probes. Evaluate actual outcomes before restoring full traffic; otherwise recovering capacity may be overwhelmed again. For an interview, define eligible failures, thresholds and bounded probes. Say what you would measure, not only which tool you would buy.

### Make a prediction

The breaker opens. Has it repaired the failed payment provider?

No. It stops repeated calls quickly. Recovery probes only test whether the dependency can be used again.

### Correct a misconception

An open breaker makes every fallback safe.

A fallback must preserve business meaning; it cannot fabricate a successful payment.

### Practical task

Walk the breaker states

- Record eligible failures while the breaker is closed.

- Open after an explicit minimum sample and threshold.

- Permit a small half-open probe set, then decide whether to close or reopen.

Expected outcome: Few probes avoid a recovery stampede; thresholds are workload choices.

### Choose interview depth

**Foundation:** Name the three states and their purpose.

**Practical:** Define eligible failures, thresholds and bounded probes.

**Advanced:** Discuss low-traffic bias, per-instance state, false trips and interactions with retries.

### Official references

- [Circuit breaker pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)


## 12. Message queues

A message queue holds work until a consumer can process it. It separates accepting work from finishing it. Durability, retries, ordering and duplicate delivery depend on the queue and configuration.

### Prerequisites

Producer, consumer and durable side effect

### Learning goals

- Trace publish/process/acknowledge

- predict duplicates

- calculate backlog growth

### Everyday explanation

A restaurant writes orders on tickets. The cook takes a ticket when ready instead of making every customer stand at the stove. A ticket can be picked up twice after confusion, so the kitchen needs an order number to avoid preparing and charging the same order twice.

### SeatSpot scenario

SeatSpot sends receipts asynchronously after booking. The booking request should not wait for an email provider, but it must reliably record that a receipt needs to be sent.

### Engineering detail

Producers publish jobs; consumers receive, process and acknowledge them. A crash before acknowledgment can cause redelivery. Design idempotent business effects using a stable job ID and durable deduplication where required.

Backlog is stored delay, not free capacity. Monitor oldest-message age, arrival rate, service rate, retention and dead-letter messages. If arrivals exceed safe processing over time, the queue grows until a limit is reached.

To coordinate a database commit and publication, consider a transactional outbox: commit business state and an outgoing record together, then relay it with duplicate-safe consumers. A database transaction cannot automatically include an unrelated broker.

### Worked example

Jobs arrive at 90/second and each worker safely processes 20/second.

Four workers provide 80/second, so backlog grows by about 10/second. Five provide 100/second and drain only about 10/second of existing backlog in the simplified model.

Add safe capacity or shed work, respecting the email provider quota. More consumers are not safe if they collectively exceed the next dependency limit.

### Implementation sketch

```text
BEGIN
  insert booking
  insert outbox(event_id, type="ReceiptRequested", booking_id)
COMMIT
Relay: publish outbox event; retry safely
Consumer: apply effect once per event_id; acknowledge
```

Conceptual outbox flow. A real implementation needs polling/CDC, durable state, concurrent ownership and an external side-effect reconciliation strategy.

### Where it is used

- Background receipts, exports and image processing.

- Smoothing bursts within measured processing capacity.

### Common mistakes

- Acknowledging before durable work is safe.

- Assuming at-least-once delivery prevents duplicates.

- Treating the queue as an unlimited buffer.

### Exercise

A worker sends an email then crashes before acknowledging. What happens?

Hint: The job may be delivered again.

Hint: The effect and the acknowledgment are different events.

Solution: Redelivery may send another email unless the consumer/provider has an idempotency or deduplication strategy. A durable order/event identity and reconciliation make this case explicit.

### Interview practice

**How do you handle poison messages?**

Bound attempts, move persistent failures to a dead-letter path, alert and provide a controlled repair/replay process. Do not silently discard business-critical work.

Follow-up: What if the replay schema has changed?

**Does a queue give exactly-once effects?**

Not universally. Broker delivery guarantees and external business effects differ. Explain acknowledgment gaps, idempotency and the scope of any deduplication guarantee.

Follow-up: How do you make an external payment safe?

### Check your understanding

A crash before acknowledgment may cause:

1. Redelivery of a job

2. Automatic rollback of an email already sent

3. Unlimited consumer capacity

Correct option: 1. The queue can retry delivery but cannot unsend an external side effect.

### Animation transcript

**Build an intuition**

Let us understand message queues. A restaurant writes orders on tickets. The cook takes a ticket when ready instead of making every customer stand at the stove. A ticket can be picked up twice after confusion, so the kitchen needs an order number to avoid preparing and charging the same order twice. A message queue holds work until a consumer can process it. It separates accepting work from finishing it. Durability, retries, ordering and duplicate delivery depend on the queue and configuration.

**Follow the normal path**

Follow the normal path. A booking succeeds and records a receipt job reliably. Coordinate this with business storage, for example using an outbox, so a crash does not lose the obligation. The queue stores work while consumers catch up. Stored backlog buys time, but retention, storage and acceptable delay remain finite. SeatSpot sends receipts asynchronously after booking. The booking request should not wait for an email provider, but it must reliably record that a receipt needs to be sent.

**Predict a failure**

Now change one condition. Workers pull jobs at a safe rate. Their combined concurrency must respect email provider quotas and other downstream capacity. A common misunderstanding is this: At-least-once delivery means exactly one business effect. Delivery and the external effect have different failure gaps. Think about this. A worker sends a receipt then crashes before acknowledgment. What can happen next? Pause the video and make your prediction. The job may be delivered again. A stable event ID and appropriate idempotency or reconciliation are needed around the external effect.

**Work through an example**

Let us reason with a concrete example. Jobs arrive at 90/second and each worker safely processes 20/second. Four workers provide 80/second, so backlog grows by about 10/second. Five provide 100/second and drain only about 10/second of existing backlog in the simplified model. Add safe capacity or shed work, respecting the email provider quota. More consumers are not safe if they collectively exceed the next dependency limit. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. A worker can send an email and fail before acknowledging its job. The queue may deliver that same logical job again. Use stable job identity and an appropriate idempotency or reconciliation strategy. A delivery guarantee alone does not guarantee exactly one external effect. When you try the practice task, look for this result. At a constant arrival rate, five workers leave only about ten jobs/second to drain the backlog.

**Explain it back**

Check your understanding. After bounded attempts, move a poison job to a monitored dead-letter path. Investigate and repair before controlled replay instead of retrying forever. Here is a challenge. A worker sends an email then crashes before acknowledging. What happens? Pause before the answer. Redelivery may send another email unless the consumer/provider has an idempotency or deduplication strategy. A durable order/event identity and reconciliation make this case explicit. For an interview, discuss backlog age, retries, poison jobs and idempotency. Say what you would measure, not only which tool you would buy.

### Make a prediction

A worker sends a receipt then crashes before acknowledgment. What can happen next?

The job may be delivered again. A stable event ID and appropriate idempotency or reconciliation are needed around the external effect.

### Correct a misconception

At-least-once delivery means exactly one business effect.

Delivery and the external effect have different failure gaps.

### Practical task

Calculate a queue backlog

- Use arrivals of 90 jobs/second and four workers at 20 each.

- Compute the 10-jobs/second backlog growth.

- Add a fifth worker and calculate how slowly the old backlog drains.

Expected outcome: At a constant arrival rate, five workers leave only about ten jobs/second to drain the backlog.

### Choose interview depth

**Foundation:** Explain producer, queue, consumer and acknowledgment.

**Practical:** Discuss backlog age, retries, poison jobs and idempotency.

**Advanced:** Defend outbox ownership, replay, provider quotas and reconciliation across crash gaps.

### Official references

- [SQS at-least-once delivery](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html)

- [Queue-based load leveling](https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling)


## 13. Event-driven architecture

In event-driven architecture, components announce facts that happened and other components react. An event such as BookingConfirmed differs from a command such as ConfirmBooking, which asks an owner to perform an action.

### Prerequisites

Event identity, command and eventual consistency

### Learning goals

- Separate facts from requests

- trace independent consumers

- define replay policy

### Everyday explanation

A school posts that sports day has been confirmed. Teachers arrange transport, the canteen plans food and students bring equipment. The announcement is one fact with several independent reactions. If the date is corrected, people need a clear update rather than silently rewriting an announcement they already acted on.

### SeatSpot scenario

SeatSpot booking confirmation can trigger receipts, analytics and loyalty updates without the booking service synchronously calling every consumer. This reduces direct coupling but introduces asynchronous coordination.

### Engineering detail

Publish event identity, type, version, time and the minimum useful payload. Choose commands versus facts deliberately. Avoid unnecessary personal data because events can be retained or copied to many consumers.

Assume duplicates, late arrivals and ordering limits unless the actual system guarantees otherwise. Consumers must be idempotent, handle compatible schema evolution and monitor their own lag and failure paths.

Independent reactions do not create one cross-service atomic transaction. Use a workflow/saga and compensating actions when needed, with a clear owner and recoverable state. An event log is not automatically a complete event-sourced model.

### Worked example

BookingConfirmed has receipt, analytics and loyalty subscribers.

A failed analytics consumer should not roll back a valid booking. Loyalty may remain eventually consistent, while seat ownership must stay authoritative.

Document each subscriber obligation and recovery/replay rules. Replaying an analytics event is different from sending every historical receipt again.

### Implementation sketch

```JSON
{
  "id": "evt-42",
  "type": "BookingConfirmed",
  "version": 1,
  "bookingId": "bk-17",
  "occurredAt": "2026-11-20T10:00:00Z"
}
```

Fictional event contract. Use real unique IDs, schema checks, access control and a deliberately chosen publication/durability strategy.

### Where it is used

- Independent reactions to business facts.

- Integration where temporary consumer delay is acceptable.

### Common mistakes

- Calling every message an event.

- Assuming global ordering across all consumers.

- Replaying side effects without a replay policy.

### Exercise

A loyalty consumer receives BookingConfirmed twice. What must remain true?

Hint: The event ID is stable across redelivery.

Hint: Awarding points is a business effect.

Solution: The booking should earn the intended points once. Deduplicate or make the update idempotent within a durable transaction; account for partial failure around external effects.

### Interview practice

**What do you gain and lose with events?**

Gain looser direct coupling and independent consumption. Accept eventual consistency, operational lag, schema management and harder end-to-end debugging.

Follow-up: When would a synchronous call be simpler?

**How do you evolve an event?**

Prefer compatible additive changes, version deliberately, validate consumers and plan retention/replay. Avoid changing the meaning of an existing field silently.

Follow-up: How does a slow old consumer survive deployment?

### Check your understanding

Which is a fact rather than a command?

1. Confirm this booking

2. BookingConfirmed

3. Please charge the card

Correct option: 2. An event describes something that already happened; a command requests work.

### Animation transcript

**Build an intuition**

Let us understand event-driven architecture. A school posts that sports day has been confirmed. Teachers arrange transport, the canteen plans food and students bring equipment. The announcement is one fact with several independent reactions. If the date is corrected, people need a clear update rather than silently rewriting an announcement they already acted on. In event-driven architecture, components announce facts that happened and other components react. An event such as BookingConfirmed differs from a command such as ConfirmBooking, which asks an owner to perform an action.

**Follow the normal path**

Follow the normal path. The booking owner establishes that the booking is confirmed, then reliably publishes the associated fact. Publication and storage must have an explicit failure strategy. The event channel makes the fact available to separate subscribers. Each subscriber has a distinct business responsibility and its own processing state. SeatSpot booking confirmation can trigger receipts, analytics and loyalty updates without the booking service synchronously calling every consumer. This reduces direct coupling but introduces asynchronous coordination.

**Predict a failure**

Now change one condition. Analytics becomes slow while receipt processing continues. Subscriber delay is observable; it should not silently redefine the original booking outcome. A common misunderstanding is this: Publishing an event creates one atomic transaction across subscribers. Independent consumers have separate state, delay and failure boundaries. Think about this. BookingConfirmed is replayed. Should every subscriber repeat its old external action? Pause the video and make your prediction. No. Rebuilding analytics and resending old receipts have different consequences. Each consumer needs an explicit replay policy.

**Work through an example**

Let us reason with a concrete example. BookingConfirmed has receipt, analytics and loyalty subscribers. A failed analytics consumer should not roll back a valid booking. Loyalty may remain eventually consistent, while seat ownership must stay authoritative. Document each subscriber obligation and recovery/replay rules. Replaying an analytics event is different from sending every historical receipt again. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. A repeated delivery uses the same logical event identity. Consumers must avoid awarding points or producing another external effect accidentally. Add compatible fields carefully and test old consumers. Retained events and delayed subscribers may outlive the latest deployment. When you try the practice task, look for this result. A repeated event must not award loyalty points twice; replay is a business decision.

**Explain it back**

Check your understanding. Replay analytics when appropriate, but do not resend historical receipts automatically. Reprocessing policy depends on the side effects owned by each subscriber. Here is a challenge. A loyalty consumer receives BookingConfirmed twice. What must remain true? Pause before the answer. The booking should earn the intended points once. Deduplicate or make the update idempotent within a durable transaction; account for partial failure around external effects. For an interview, discuss versioned contracts, lag and idempotent consumers. Say what you would measure, not only which tool you would buy.

### Make a prediction

BookingConfirmed is replayed. Should every subscriber repeat its old external action?

No. Rebuilding analytics and resending old receipts have different consequences. Each consumer needs an explicit replay policy.

### Correct a misconception

Publishing an event creates one atomic transaction across subscribers.

Independent consumers have separate state, delay and failure boundaries.

### Practical task

Classify messages and replay effects

- Classify ConfirmBooking as a command and BookingConfirmed as a fact.

- Draw receipt, analytics and loyalty subscribers.

- Choose which effects can be replayed and how duplicates are handled.

Expected outcome: A repeated event must not award loyalty points twice; replay is a business decision.

### Choose interview depth

**Foundation:** Explain a business fact and its reactions.

**Practical:** Discuss versioned contracts, lag and idempotent consumers.

**Advanced:** Defend workflow ownership, compensation, retained schemas and controlled replay.

### Official references

- [Event-driven architecture](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven)

- [Publisher-subscriber pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber)


## 14. Database replication

Replication keeps copies of database data. It can improve resilience or serve reads, but asynchronous copies may lag. A replica is not the same as an independent backup.

### Prerequisites

Write acknowledgment, primary and read replica

### Learning goals

- Explain replication lag

- route read-after-write

- distinguish replica and backup

### Everyday explanation

Two students copy notes from one teacher. If copying takes time, one notebook may lack the last sentence. If the teacher accidentally deletes an important page and the students copy that deletion, every notebook can lose it. You still need a recoverable older copy.

### SeatSpot scenario

SeatSpot may serve public catalog reads from replicas while routing authoritative reservations to the write owner. A user reading immediately after a write must not be surprised by a stale confirmation state.

### Engineering detail

In primary/replica arrangements, writes are accepted by the primary and changes are shipped to replicas. Asynchronous acknowledgment can be faster but may leave an acknowledged write unavailable after a primary loss before replication.

Synchronous replication can wait for specified remote durability/visibility guarantees, adding latency or reducing write availability when required replicas cannot reply. Inspect the database-specific guarantee rather than using the word synchronous loosely.

Failover needs promotion rules, client reconnection and fencing of the old writer. Two independent primaries can diverge. Monitor replication lag and use a read-your-writes strategy, such as routing a user to the primary temporarily, when necessary.

### Worked example

The primary confirms a booking at 12:00:00. A read replica applies it at 12:00:02.

A read at 12:00:01 may see the earlier state. Two seconds here is fictional teaching lag, not a product guarantee.

Read the confirmation from an authoritative path or implement a documented consistency mechanism. Do not tell the user their purchase disappeared simply because a replica is behind.

### Implementation sketch

```SQL
-- Inspect your configured PostgreSQL replica in a safe environment:
SELECT pg_is_in_recovery();
-- Primary-side monitoring depends on permissions/configuration:
SELECT application_name, state, sync_state
FROM pg_stat_replication;
```

Read-only diagnostic examples, not a complete replication setup. Permissions, monitoring access and column details depend on the actual database version/service.

### Where it is used

- Read distribution where staleness is acceptable.

- Maintaining copies for defined failover scenarios.

### Common mistakes

- Using replication instead of backups.

- Promoting a new writer without fencing the old one.

- Ignoring read-after-write behavior.

### Exercise

Why can a replica show an order as missing just after checkout?

Hint: Follow when the write was acknowledged and applied.

Hint: Not every read path has the same consistency.

Solution: Asynchronous replication may not have applied the write yet. Route that confirmation to an appropriate authoritative path or use a supported read-your-writes mechanism. Distinguish lag from a real failed write.

### Interview practice

**Synchronous or asynchronous replication?**

Choose from durability, latency and availability requirements. State exactly what an acknowledgment means and what can be lost during failover.

Follow-up: What happens if the required synchronous replica is unreachable?

**Why retain backups?**

Replication can copy accidental deletes or corruption. Backups and point-in-time recovery address different recovery needs and must be restore-tested.

Follow-up: How do you validate a restored backup?

### Check your understanding

Which statement is safest?

1. Every replica is immediately current

2. A replica may lag and is not a backup replacement

3. Failover needs no coordination

Correct option: 2. Consistency and recovery guarantees depend on replication and failover configuration.

### Animation transcript

**Build an intuition**

Let us understand database replication. Two students copy notes from one teacher. If copying takes time, one notebook may lack the last sentence. If the teacher accidentally deletes an important page and the students copy that deletion, every notebook can lose it. You still need a recoverable older copy. Replication keeps copies of database data. It can improve resilience or serve reads, but asynchronous copies may lag. A replica is not the same as an independent backup.

**Follow the normal path**

Follow the normal path. A booking write reaches the current primary. Its acknowledgment policy determines what the application can assume about durability and replication at that moment. Changes travel to replicas. With asynchronous replication, the primary can reply before all copies have applied the latest write. SeatSpot may serve public catalog reads from replicas while routing authoritative reservations to the write owner. A user reading immediately after a write must not be surprised by a stale confirmation state.

**Predict a failure**

Now change one condition. A confirmation read reaches Replica A before the booking arrives there. The user may see an older state even though the primary accepted the write. A common misunderstanding is this: Replication protects against every accidental deletion. A replica can copy the same deletion or corruption. Keep restore-tested recovery points separately. Think about this. The primary confirms at 12:00:00; the replica applies at 12:00:02. What can a read at 12:00:01 show? Pause the video and make your prediction. The earlier state, even though the primary accepted the write. Read-your-writes requires a suitable authoritative or documented consistency path.

**Work through an example**

Let us reason with a concrete example. The primary confirms a booking at 12:00:00. A read replica applies it at 12:00:02. A read at 12:00:01 may see the earlier state. Two seconds here is fictional teaching lag, not a product guarantee. Read the confirmation from an authoritative path or implement a documented consistency mechanism. Do not tell the user their purchase disappeared simply because a replica is behind. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Use the primary or an explicitly supported consistency mechanism for confirmation. Public catalog reads can have a different staleness allowance. If the primary fails, promotion needs a clear election or orchestration process and fencing. Avoid letting an isolated old writer accept conflicting new changes. When you try the practice task, look for this result. Lag is different from a failed purchase; a replica is not an independent historical backup.

**Explain it back**

Check your understanding. Replication also copies many mistakes. Maintain tested backups and recovery points independently rather than counting live copies as protection against every kind of data loss. Here is a challenge. Why can a replica show an order as missing just after checkout? Pause before the answer. Asynchronous replication may not have applied the write yet. Route that confirmation to an appropriate authoritative path or use a supported read-your-writes mechanism. Distinguish lag from a real failed write. For an interview, compare acknowledgment, read consistency and failover fencing. Say what you would measure, not only which tool you would buy.

### Make a prediction

The primary confirms at 12:00:00; the replica applies at 12:00:02. What can a read at 12:00:01 show?

The earlier state, even though the primary accepted the write. Read-your-writes requires a suitable authoritative or documented consistency path.

### Correct a misconception

Replication protects against every accidental deletion.

A replica can copy the same deletion or corruption. Keep restore-tested recovery points separately.

### Practical task

Draw the write/read timeline

- Mark primary acknowledgment at second zero.

- Mark replica application at second two.

- Place a confirmation read at second one and choose a safer read path.

Expected outcome: Lag is different from a failed purchase; a replica is not an independent historical backup.

### Choose interview depth

**Foundation:** Explain copying changes and temporary lag.

**Practical:** Compare acknowledgment, read consistency and failover fencing.

**Advanced:** Defend recent-write loss windows, promotion safety and measured recovery procedures.

### Official references

- [PostgreSQL standby/replication](https://www.postgresql.org/docs/current/warm-standby.html)


## 15. Database sharding

Sharding divides records across separate database shards, often using a key. Each record needs a known home. It can spread storage and write load, but cross-shard operations and moving data become harder.

### Prerequisites

Record key, query pattern and database owner

### Learning goals

- Choose a shard key from access

- explain hot tenants

- plan data movement

### Everyday explanation

A library splits books across buildings by a catalog rule. The catalog must tell you which building owns a book. A rule that sends every popular book to the same building still creates a queue. Finding books across all buildings is more work than visiting one shelf.

### SeatSpot scenario

SeatSpot may eventually outgrow one database write/storage boundary. Sharding could place different tenants or events on different shards, but one extremely popular event can still create a hot shard.

### Engineering detail

Choose the shard key from access patterns, distribution, locality and growth. Hashing spreads keys but does not guarantee evenly distributed workload. Range sharding helps ordered access but may concentrate newest or popular data.

Keep a routing map/version and plan online rebalancing, ownership transfer and rollback. A simple modulo change remaps many keys; consistent hashing reduces some movement but does not eliminate migration and hot-key problems.

Cross-shard joins, transactions, uniqueness and global ordering need explicit support or application redesign. Try indexing, query fixes, vertical growth or read distribution first when they meet the actual requirement more simply.

### Worked example

Ten tenants each produce similar load except one tenant generates half the total.

Hashing tenant IDs across four shards can still put half the traffic on the hot tenant shard. Even key counts do not mean even traffic.

Consider splitting that tenant workload using a suitable finer key, isolation or an alternative ownership model. Test query patterns and transaction boundaries before committing.

### Implementation sketch

```TypeScript
// Teaching routing example with a fixed shard count only:
const shardFor = (tenantHash: number) => tenantHash % 4;
// Real systems need a durable routing/migration design.
```

Do not increase 4 to 5 in a live system and assume existing rows move automatically. Routing and stored ownership must change through a controlled migration.

### Where it is used

- Write/storage growth beyond a suitable single database boundary.

- Tenant isolation with carefully chosen access patterns.

### Common mistakes

- Confusing many logical table partitions with separate physical shards.

- Ignoring cross-shard transactions and global uniqueness.

- Treating hash distribution as a guarantee against hot keys.

### Exercise

One event causes 70% of booking writes and eventId is the shard key. Does adding shards fix it?

Hint: The hot event stays one key.

Hint: More shards help only if its work can be partitioned safely.

Solution: Not automatically. That event remains on one shard. Revisit seat ownership/partitioning and concurrency rules, or provide dedicated capacity, without weakening atomic reservation correctness.

### Interview practice

**How do you choose a shard key?**

Use dominant reads/writes, locality, growth and skew; test hot entities and cross-shard operations. Explain migration and ownership, not just a hash function.

Follow-up: How would a single large tenant change your choice?

**What makes resharding difficult?**

Routing and data location must stay consistent during copy and cutover. Handle writes, retries, verification and rollback while preventing conflicting ownership.

Follow-up: Can both old and new shards accept writes during migration?

### Check your understanding

A shard key with evenly many rows guarantees:

1. Even request load

2. Neither even load nor safe cross-shard transactions

3. No need for routing

Correct option: 2. Data volume, request frequency and coordination are distinct concerns.

### Animation transcript

**Build an intuition**

Let us understand database sharding. A library splits books across buildings by a catalog rule. The catalog must tell you which building owns a book. A rule that sends every popular book to the same building still creates a queue. Finding books across all buildings is more work than visiting one shelf. Sharding divides records across separate database shards, often using a key. Each record needs a known home. It can spread storage and write load, but cross-shard operations and moving data become harder.

**Follow the normal path**

Follow the normal path. A request carries a tenant or entity key. The routing rule maps that key to an authoritative shard before data is read or written. Different record groups live on different database shards. This can spread storage and write work when the groups are actually independent enough. SeatSpot may eventually outgrow one database write/storage boundary. Sharding could place different tenants or events on different shards, but one extremely popular event can still create a hot shard.

**Predict a failure**

Now change one condition. One popular event can overload its shard even when every shard has the same row count. Workload distribution matters more than counting keys. A common misunderstanding is this: Hashing guarantees equal load. It distributes keys; uneven popularity and request cost can still make a hot shard. Think about this. Four shards have similar row counts, but one tenant sends half the traffic. Is the workload balanced? Pause the video and make your prediction. Not necessarily. Even row distribution is different from even traffic. A hot tenant may still dominate one shard.

**Work through an example**

Let us reason with a concrete example. Ten tenants each produce similar load except one tenant generates half the total. Hashing tenant IDs across four shards can still put half the traffic on the hot tenant shard. Even key counts do not mean even traffic. Consider splitting that tenant workload using a suitable finer key, isolation or an alternative ownership model. Test query patterns and transaction boundaries before committing. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. A query across all events may contact every shard and merge results. Cross-shard joins, transactions and uniqueness require deliberate support or redesign. Rebalancing needs copying, verification, a write/cutover policy and an updated routing map. Changing a modulo number does not move existing records. When you try the practice task, look for this result. A routing function alone does not migrate records, rebalance a hot tenant or preserve cross-shard transactions.

**Explain it back**

Check your understanding. Shard only when requirements and measurements justify the coordination cost. A suitable index or larger database may solve the current problem with much less complexity. Here is a challenge. One event causes 70% of booking writes and eventId is the shard key. Does adding shards fix it? Pause before the answer. Not automatically. That event remains on one shard. Revisit seat ownership/partitioning and concurrency rules, or provide dedicated capacity, without weakening atomic reservation correctness. For an interview, choose a key and discuss joins, transactions and hot tenants. Say what you would measure, not only which tool you would buy.

### Make a prediction

Four shards have similar row counts, but one tenant sends half the traffic. Is the workload balanced?

Not necessarily. Even row distribution is different from even traffic. A hot tenant may still dominate one shard.

### Correct a misconception

Hashing guarantees equal load.

It distributes keys; uneven popularity and request cost can still make a hot shard.

### Practical task

Map tenants to owners

- Draw four shards and route several tenant IDs.

- Give one tenant half the requests.

- Explain how a new shard changes routing and migration ownership.

Expected outcome: A routing function alone does not migrate records, rebalance a hot tenant or preserve cross-shard transactions.

### Choose interview depth

**Foundation:** Explain why a record needs one known shard.

**Practical:** Choose a key and discuss joins, transactions and hot tenants.

**Advanced:** Defend ownership transfer, routing versions, rebalancing and simpler alternatives.

### Official references

- [Sharding pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/sharding)


## 16. Data partitioning

Partitioning splits a dataset into manageable parts using rules such as date ranges or key hashes. Table partitions can remain inside one database; partitioning does not automatically mean physical sharding across servers.

### Prerequisites

Table, predicate and query plan

### Learning goals

- Explain pruning

- separate partitions and shards

- plan retention

### Everyday explanation

You organize school papers into folders by month. Finding November work becomes easier if you open only the November folder. Putting every folder on the same desk does not create more desks. Likewise, smaller table parts can improve maintenance or pruning without adding another database machine.

### SeatSpot scenario

SeatSpot stores an increasing audit/history table. Date partitions can make retention and time-bounded queries easier while keeping current reservation transactions on an appropriate authoritative path.

### Engineering detail

Match the partition key to queries and lifecycle operations. Partition pruning avoids irrelevant parts when predicates and the database plan permit it. A query with no usable partition condition may still scan many partitions.

Range, list and hash partitions have different properties. Plan creation of future partitions, default/error behavior for unmatched rows, indexes and retention. Too many tiny partitions can add planning and management overhead.

Check uniqueness and foreign-key capabilities in the specific database. Partitioning may constrain global uniqueness or maintenance operations. It does not remove the need for indexing or automatically solve write contention on one hot record.

### Worked example

History contains one million rows per month over two years. A query requests one month.

With useful pruning it may inspect a relevant partition rather than all 24 million rows, but actual I/O depends on predicates, indexes and plans.

Use EXPLAIN in a test environment. Confirm pruning and retention behavior instead of assuming a partitioned table is always faster.

### Implementation sketch

```SQL
CREATE TABLE booking_history (
  id bigint NOT NULL, created_at date NOT NULL
) PARTITION BY RANGE (created_at);
CREATE TABLE booking_history_2026_11
PARTITION OF booking_history
FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
```

PostgreSQL teaching example. The lower bound is inclusive and upper bound exclusive. Insertions outside defined partitions need another matching/default partition; indexes and constraints are not complete here.

### Where it is used

- Time-based history retention and maintenance.

- Queries that can select a limited set of data partitions.

### Common mistakes

- Calling all partitioning sharding.

- Missing future partition creation.

- Ignoring query plans and global constraint behavior.

### Exercise

A table is partitioned by date, but a query filters only customer email. Must it be fast?

Hint: Ask whether the date partitions can be pruned.

Hint: A suitable index can still matter.

Solution: No. The engine may inspect many partitions without a useful date restriction. Examine the actual plan and indexing/access pattern rather than assuming partitioning alone helps.

### Interview practice

**Partitioning versus sharding?**

Partitioning is splitting data by a rule. Sharding usually distributes those groups across separate data owners/servers. State the physical topology and transaction boundary.

Follow-up: Can a partitioned table still be one failure domain?

**How would you expire old history?**

Use a retention policy, verify dependencies/backup requirements, then perform the database-supported partition lifecycle operation safely. Dropping data is not a reversible performance trick.

Follow-up: What must happen before removing the oldest partition?

### Check your understanding

Date partitioning helps most when:

1. Queries can eliminate irrelevant date partitions

2. Every query ignores dates

3. All rows share one locked counter

Correct option: 1. Useful pruning depends on predicates and the chosen partition design.

### Animation transcript

**Build an intuition**

Let us understand data partitioning. You organize school papers into folders by month. Finding November work becomes easier if you open only the November folder. Putting every folder on the same desk does not create more desks. Likewise, smaller table parts can improve maintenance or pruning without adding another database machine. Partitioning splits a dataset into manageable parts using rules such as date ranges or key hashes. Table partitions can remain inside one database; partitioning does not automatically mean physical sharding across servers.

**Follow the normal path**

Follow the normal path. History rows are grouped by date. This organization can exist inside one database and should not be confused with distributing ownership across independent shards. Each month has a defined range with explicit boundaries. Future data needs a matching partition or a deliberately configured default behavior. SeatSpot stores an increasing audit/history table. Date partitions can make retention and time-bounded queries easier while keeping current reservation transactions on an appropriate authoritative path.

**Predict a failure**

Now change one condition. A date-bounded query reaches the planner. The engine can eliminate irrelevant ranges if its rules and the query expression permit partition pruning. A common misunderstanding is this: Table partitioning automatically scales across machines. Partitions can remain inside the same database on the same machine. Think about this. A monthly partitioned table is queried without a date predicate. Must it read only one month? Pause the video and make your prediction. No. Without a usable condition the database may inspect many partitions. Check the query plan instead of assuming pruning.

**Work through an example**

Let us reason with a concrete example. History contains one million rows per month over two years. A query requests one month. With useful pruning it may inspect a relevant partition rather than all 24 million rows, but actual I/O depends on predicates, indexes and plans. Use EXPLAIN in a test environment. Confirm pruning and retention behavior instead of assuming a partitioned table is always faster. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. The November partition supplies the requested history. An appropriate index and query plan can still be necessary inside that partition. Retention can operate on old partitions, but removal is a data-policy decision. Verify dependencies, recovery requirements and correct boundaries before destructive maintenance. When you try the practice task, look for this result. Partitioning can aid pruning and lifecycle management without adding another database server.

**Explain it back**

Check your understanding. A query without the partition key may still inspect many parts. More partitions do not automatically add machines, guarantee speed or fix one hot-row lock. Here is a challenge. A table is partitioned by date, but a query filters only customer email. Must it be fast? Pause before the answer. No. The engine may inspect many partitions without a useful date restriction. Examine the actual plan and indexing/access pattern rather than assuming partitioning alone helps. For an interview, discuss partition keys, pruning, indexes and retention. Say what you would measure, not only which tool you would buy.

### Make a prediction

A monthly partitioned table is queried without a date predicate. Must it read only one month?

No. Without a usable condition the database may inspect many partitions. Check the query plan instead of assuming pruning.

### Correct a misconception

Table partitioning automatically scales across machines.

Partitions can remain inside the same database on the same machine.

### Practical task

Work a monthly history query

- Draw 24 monthly partitions with one million rows each.

- Write a predicate for one month and identify removable partitions.

- Remove the predicate and compare the possible work.

Expected outcome: Partitioning can aid pruning and lifecycle management without adding another database server.

### Choose interview depth

**Foundation:** Explain folders within a table.

**Practical:** Discuss partition keys, pruning, indexes and retention.

**Advanced:** Defend uniqueness constraints, planning overhead and partition lifecycle automation.

### Official references

- [PostgreSQL table partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

- [Sharding distinctions](https://learn.microsoft.com/en-us/azure/architecture/patterns/sharding)


## 17. Microservices

Microservices split a system into independently deployable business services. The useful boundary is ownership of a capability and its data, not an arbitrary number of small functions or servers.

### Prerequisites

Business invariant, transaction and network call

### Learning goals

- Choose business ownership

- compare synchronous/asynchronous work

- justify a service boundary

### Everyday explanation

A school has a library team, accounts team and transport team. Each owns a different responsibility and communicates through clear requests. If every tiny task needs a meeting with every team, work becomes slower. More teams are helpful only when their boundaries reduce coordination rather than create it.

### SeatSpot scenario

SeatSpot may separate booking, catalog and notifications when team ownership, scaling or deployment needs justify it. A small team can often start with a modular monolith and preserve those boundaries without network overhead.

### Engineering detail

Choose boundaries from domain invariants and team ownership. Avoid a shared database schema that every service edits freely; it couples deployments even if applications have different names.

Network calls fail partially and add latency. Cross-service updates need explicit workflows, idempotency and reconciliation. A local transaction cannot automatically protect a business invariant spread across unrelated stores.

Independent deployment requires compatible contracts, observability, testing and operations. If services must always deploy together, investigate whether the boundary or shared dependencies are wrong.

### Worked example

A confirmation requires catalog lookup, seat reservation, payment and notification.

Putting all four behind sequential network calls increases latency and failure combinations. Notification can be asynchronous; reservation/payment need an explicit state machine and reconciliation.

Start with the required invariant and workflow. Separate a capability only when the autonomy benefit outweighs the distributed coordination cost.

### Implementation sketch

```text
Catalog: owns public event descriptions
Booking: owns seat reservation state
Payments: owns provider integration and reconciliation
Notifications: owns delivery jobs
Contracts connect owners; services do not edit each other tables.
```

A proposed domain sketch, not a claim that all systems need four services or that network calls provide atomic transactions.

### Where it is used

- Independent teams or capabilities with different release/scaling needs.

- Domains with clear data and operation ownership.

### Common mistakes

- Splitting by technical layer into chatty services.

- Sharing mutable tables without ownership.

- Treating a modular monolith as inherently inferior.

### Exercise

A two-person team has low traffic and no independent deployment needs. Must it use microservices?

Hint: Compare operational cost with the actual requirement.

Hint: Preserve boundaries without requiring network calls.

Solution: No. A modular monolith can keep clear domains with simpler transactions and operations. Revisit extraction when measured scaling, ownership or release constraints justify it.

### Interview practice

**How would you choose service boundaries?**

Find business capabilities, invariants, data ownership and team responsibilities. Model the workflow and failure paths before deciding which boundary becomes a network call.

Follow-up: Which invariant should remain inside one owner?

**What is a distributed monolith?**

Services are physically separate but tightly coupled through shared tables, synchronous dependencies or coordinated releases. The operational cost exists without much autonomy.

Follow-up: How would you reduce one such coupling?

### Check your understanding

A strong reason to split a service is:

1. Every class needs its own server

2. A clear independent capability and justified ownership/deployment need

3. Microservices guarantee simpler transactions

Correct option: 2. Autonomy must justify the added network and operational complexity.

### Animation transcript

**Build an intuition**

Let us understand microservices. A school has a library team, accounts team and transport team. Each owns a different responsibility and communicates through clear requests. If every tiny task needs a meeting with every team, work becomes slower. More teams are helpful only when their boundaries reduce coordination rather than create it. Microservices split a system into independently deployable business services. The useful boundary is ownership of a capability and its data, not an arbitrary number of small functions or servers.

**Follow the normal path**

Follow the normal path. Name business responsibilities before drawing services. Catalog descriptions and authoritative seat reservations have different ownership and correctness requirements. Each capability owns its protected state and exposes contracts. Giving every service write access to every table defeats much of the intended independence. SeatSpot may separate booking, catalog and notifications when team ownership, scaling or deployment needs justify it. A small team can often start with a modular monolith and preserve those boundaries without network overhead.

**Predict a failure**

Now change one condition. The booking workflow contacts payments. That call can time out or succeed remotely while its response is lost; it is not a local transaction. A common misunderstanding is this: Every function should become a microservice. Fine-grained network boundaries can add latency, coordination and partial failures without useful autonomy. Think about this. Catalog, booking and payment must deploy together after every change. Are they operationally independent? Pause the video and make your prediction. Probably not yet. Inspect shared schemas and contracts before calling separate processes independent services.

**Work through an example**

Let us reason with a concrete example. A confirmation requires catalog lookup, seat reservation, payment and notification. Putting all four behind sequential network calls increases latency and failure combinations. Notification can be asynchronous; reservation/payment need an explicit state machine and reconciliation. Start with the required invariant and workflow. Separate a capability only when the autonomy benefit outweighs the distributed coordination cost. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Confirmation can publish notification work after reliable business-state coordination. A slow email provider need not occupy the booking request indefinitely. Old and new callers may coexist. Test contract compatibility and observe version-specific errors instead of requiring every service to deploy in lockstep. When you try the practice task, look for this result. Separate deployment earns its complexity only when ownership and autonomy are useful.

**Explain it back**

Check your understanding. For a small team, a modular monolith may satisfy the same domain boundaries with fewer moving parts. Choose services from requirements rather than fashion. Here is a challenge. A two-person team has low traffic and no independent deployment needs. Must it use microservices? Pause before the answer. No. A modular monolith can keep clear domains with simpler transactions and operations. Revisit extraction when measured scaling, ownership or release constraints justify it. For an interview, discuss contracts, state machines and asynchronous notification. Say what you would measure, not only which tool you would buy.

### Make a prediction

Catalog, booking and payment must deploy together after every change. Are they operationally independent?

Probably not yet. Inspect shared schemas and contracts before calling separate processes independent services.

### Correct a misconception

Every function should become a microservice.

Fine-grained network boundaries can add latency, coordination and partial failures without useful autonomy.

### Practical task

Draw a booking ownership map

- Assign catalog, booking, payment and notification ownership.

- Mark which operations must protect seat allocation.

- Compare a modular monolith with extracting one justified capability.

Expected outcome: Separate deployment earns its complexity only when ownership and autonomy are useful.

### Choose interview depth

**Foundation:** Describe one capability and its owner.

**Practical:** Discuss contracts, state machines and asynchronous notification.

**Advanced:** Defend boundary choices, cross-service invariants, deployment independence and operating cost.

### Official references

- [Microservices architecture](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices)


## 18. Service discovery

Service discovery maps a stable service name to current usable destinations. Instances change as they deploy, fail or scale. Discovery finds candidates; routing and health policies decide how requests reach them.

### Prerequisites

Service name, endpoint and readiness

### Learning goals

- Resolve a stable name

- distinguish discovery and routing

- handle stale endpoints

### Everyday explanation

A school directory lists which rooms currently host each club. Students ask for the chess club rather than memorizing an old room number. The directory can become stale, so someone must update it and decide what happens when a listed room is closed.

### SeatSpot scenario

SeatSpot booking replicas should find the payment service even when its pod addresses change. Hard-coded ephemeral IPs become stale during routine operations.

### Engineering detail

Discovery can be DNS-based, registry-based or platform-provided. Client-side discovery chooses an instance in the caller; server-side discovery can expose a stable proxy/service address. Clarify which layer owns selection.

Registration, readiness, deregistration and stale caches affect routing. Name resolution can succeed while a returned endpoint is unusable. DNS TTL and connection reuse influence how quickly callers observe changes.

Secure the registry and service identity. Discoverability is not authorization. Timeouts, bounded retries and observability remain necessary when a resolved instance fails.

### Worked example

Three payment pods are replaced during a rolling deployment.

Their individual IPs may change while a Kubernetes Service name remains stable. Endpoint/readiness propagation and existing connections still create a transition interval.

Use the platform service abstraction and test replacement with live requests. Do not promise instantaneous convergence from a stable name.

### Implementation sketch

```text
http://payments.default.svc.cluster.local:8080
# Example Kubernetes Service DNS name inside a configured cluster.
# Deployment/pod addresses may change behind the service.
```

This is a private cluster naming example, not an internet URL or a working endpoint supplied by Sukoaa. Service definition, namespace and network policy must exist.

### Where it is used

- Dynamic replica sets and container platforms.

- Locating current service endpoints without hard-coded pod IPs.

### Common mistakes

- Treating discovery as authentication.

- Caching endpoint addresses forever.

- Ignoring readiness and stale connections.

### Exercise

DNS resolves the service but requests fail. What do you check next?

Hint: A name is only one part of the path.

Hint: Inspect endpoints, readiness, ports and policy.

Solution: Check ready endpoints, target port, network reachability/policy, TLS identity and the dependency itself. Compare resolution with an actual bounded request and inspect traces.

### Interview practice

**Discovery versus load balancing?**

Discovery identifies current destinations or a stable service address; load balancing chooses how traffic is distributed among usable targets. Platforms may combine them.

Follow-up: Who chooses the instance in your design?

**How do stale records affect recovery?**

Cached addresses and long-lived connections can continue pointing at old instances. Use suitable lifetimes, retries and draining and test convergence.

Follow-up: Does reducing TTL instantly move all clients?

### Check your understanding

A discovered service name proves:

1. The caller is authorized

2. A naming mechanism returned a destination, not that every call will succeed

3. The database is healthy

Correct option: 2. Discovery does not replace health, network checks or authorization.

### Animation transcript

**Build an intuition**

Let us understand service discovery. A school directory lists which rooms currently host each club. Students ask for the chess club rather than memorizing an old room number. The directory can become stale, so someone must update it and decide what happens when a listed room is closed. Service discovery maps a stable service name to current usable destinations. Instances change as they deploy, fail or scale. Discovery finds candidates; routing and health policies decide how requests reach them.

**Follow the normal path**

Follow the normal path. The caller requests the payment capability by service name instead of storing an individual pod address that may disappear during the next deployment. The platform or registry tracks service destinations and readiness. Registration and removal need reliable ownership and observable convergence. SeatSpot booking replicas should find the payment service even when its pod addresses change. Hard-coded ephemeral IPs become stale during routine operations.

**Predict a failure**

Now change one condition. Client or server routing selects a usable endpoint. Discovery and load balancing cooperate, but they describe different responsibilities. A common misunderstanding is this: Finding an endpoint authorizes access to it. Discovery provides destinations, not identity or business permissions. Think about this. DNS resolves the payment service. Does that prove every connection will succeed? Pause the video and make your prediction. No. Name resolution can succeed while endpoints are unhealthy, changing or unreachable. Timeouts and failure handling still apply.

**Work through an example**

Let us reason with a concrete example. Three payment pods are replaced during a rolling deployment. Their individual IPs may change while a Kubernetes Service name remains stable. Endpoint/readiness propagation and existing connections still create a transition interval. Use the platform service abstraction and test replacement with live requests. Do not promise instantaneous convergence from a stable name. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. An old instance becomes unready and a replacement joins. Cached addresses and existing connections can outlive the registry update. A failed connection may use a safe bounded retry against current membership. Do not hide repeated errors with unlimited retries. When you try the practice task, look for this result. Stable naming helps callers, but does not imply instantaneous endpoint convergence.

**Explain it back**

Check your understanding. Knowing an address does not authorize a request. Validate the relevant identity, transport security and resource permissions at the appropriate boundaries. Here is a challenge. DNS resolves the service but requests fail. What do you check next? Pause before the answer. Check ready endpoints, target port, network reachability/policy, TLS identity and the dependency itself. Compare resolution with an actual bounded request and inspect traces. For an interview, compare client-side selection with a stable service/proxy address. Say what you would measure, not only which tool you would buy.

### Make a prediction

DNS resolves the payment service. Does that prove every connection will succeed?

No. Name resolution can succeed while endpoints are unhealthy, changing or unreachable. Timeouts and failure handling still apply.

### Correct a misconception

Finding an endpoint authorizes access to it.

Discovery provides destinations, not identity or business permissions.

### Practical task

Follow a rolling endpoint replacement

- Write a stable service name and three changing instance addresses.

- Replace one instance and mark propagation/readiness delay.

- Trace an existing connection and a newly resolved connection separately.

Expected outcome: Stable naming helps callers, but does not imply instantaneous endpoint convergence.

### Choose interview depth

**Foundation:** Explain a stable name with changing instances.

**Practical:** Compare client-side selection with a stable service/proxy address.

**Advanced:** Discuss stale caches, connection reuse, registry security and convergence evidence.

### Official references

- [Kubernetes Service discovery](https://kubernetes.io/docs/concepts/services-networking/service/)

- [DNS for services and pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)


## 19. Reverse proxy

A reverse proxy receives requests on behalf of backend servers and forwards them. It can terminate TLS, route paths or hosts and manage forwarding behavior. It is different from a forward proxy used on behalf of clients.

### Prerequisites

HTTP request, backend and forwarded header

### Learning goals

- Trace proxy forwarding

- align limits/timeouts

- define trusted headers

### Everyday explanation

A reception desk receives mail for several offices and forwards each envelope internally. Outside visitors know the public address rather than every room. The desk must preserve important information and must not believe a forged note saying that an envelope came from the principal.

### SeatSpot scenario

SeatSpot can expose one HTTPS hostname while forwarding application and static paths to different backends. This central entry layer needs deliberate timeout, buffering and trusted-header behavior.

### Engineering detail

Decide where TLS terminates and whether backend connections also use TLS. Preserve/transform Host and forwarded headers deliberately. Backend code must trust identity/IP headers only from a known proxy chain.

Set request/body limits, connect/read timeouts and buffering behavior for the workload. A streaming response or WebSocket needs suitable handling rather than assuming ordinary buffered HTTP defaults.

A reverse proxy may also load balance or apply API policies. Avoid treating these roles as mutually exclusive products. Plan proxy redundancy and test backend failure and graceful connection draining.

### Worked example

A browser uploads a large image through a proxy to the application.

The application body limit does not help if the proxy rejects it first; conversely, a permissive proxy does not bypass the application validation. The smallest relevant limit wins.

Align intended limits and return understandable errors. For streaming, inspect buffering and timeouts along the full path.

### Implementation sketch

```nginx
server {
  listen 8080;
  location /api/ {
    proxy_pass http://app:3000;
    proxy_set_header Host $host;
    proxy_connect_timeout 2s;
    proxy_read_timeout 30s;
  }
}
```

A minimal local example, not complete production configuration. proxy_pass URI/trailing-slash behavior matters; configure TLS, trusted headers and workload-specific limits separately.

### Where it is used

- One public entry point for internal HTTP applications.

- TLS termination, path routing and suitable buffering policies.

### Common mistakes

- Trusting arbitrary forwarded-IP headers.

- Breaking streams with inappropriate buffering/timeouts.

- Assuming proxy and application limits are identical.

### Exercise

An API stream produces tokens but the browser sees them all at once. What might be happening?

Hint: Check intermediary buffering as well as application flushing.

Hint: Observe timing at more than one boundary.

Solution: A proxy/CDN may buffer the response. Verify streaming support, flush behavior, timeout and cache/compression policies across the actual path before changing application logic blindly.

### Interview practice

**Reverse proxy versus forward proxy?**

A reverse proxy represents servers to incoming clients. A forward proxy represents clients making outbound requests. Either can have additional security or caching roles.

Follow-up: Where is the trust boundary for client identity?

**Why is the client IP difficult?**

Multiple proxies can add or rewrite headers. Trust only headers supplied by verified infrastructure and define how the chain is parsed.

Follow-up: What prevents a direct client from spoofing that header?

### Check your understanding

Forwarded identity headers should be:

1. Trusted from any client

2. Trusted only through a verified infrastructure boundary

3. Used instead of authorization

Correct option: 2. Untrusted clients can forge ordinary HTTP headers.

### Animation transcript

**Build an intuition**

Let us understand reverse proxy. A reception desk receives mail for several offices and forwards each envelope internally. Outside visitors know the public address rather than every room. The desk must preserve important information and must not believe a forged note saying that an envelope came from the principal. A reverse proxy receives requests on behalf of backend servers and forwards them. It can terminate TLS, route paths or hosts and manage forwarding behavior. It is different from a forward proxy used on behalf of clients.

**Follow the normal path**

Follow the normal path. The browser talks to one public address. The reverse proxy represents backend servers rather than acting as the browser own outbound proxy. Host and path rules select a backend. Request size, deadlines, TLS termination and supported protocols must fit the actual workload. SeatSpot can expose one HTTPS hostname while forwarding application and static paths to different backends. This central entry layer needs deliberate timeout, buffering and trusted-header behavior.

**Predict a failure**

Now change one condition. API traffic reaches the API backend and asset traffic can reach another backend. A reverse proxy can also perform load-balancing duties. A common misunderstanding is this: A reverse proxy and load balancer cannot be the same component. These are roles that can overlap in one product. Think about this. A client sends X-Forwarded-For claiming to be an administrator. Should your backend trust it? Pause the video and make your prediction. Only through a verified proxy chain with controlled header rewriting. A client-supplied header is not trusted identity.

**Work through an example**

Let us reason with a concrete example. A browser uploads a large image through a proxy to the application. The application body limit does not help if the proxy rejects it first; conversely, a permissive proxy does not bypass the application validation. The smallest relevant limit wins. Align intended limits and return understandable errors. For streaming, inspect buffering and timeouts along the full path. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Forward useful request context, but do not accept forged identity or client-IP headers from arbitrary clients as trusted facts. Buffering and idle/read timeouts can change what a browser sees. Test streams and long-lived connections end to end instead of assuming default behavior fits. When you try the practice task, look for this result. The narrowest relevant limit can reject the request; streaming needs deliberate buffering and timeout choices.

**Explain it back**

Check your understanding. The public entry point needs its own capacity, redundancy and monitoring. Backend replicas do not help if the only proxy is unavailable. Here is a challenge. An API stream produces tokens but the browser sees them all at once. What might be happening? Pause before the answer. A proxy/CDN may buffer the response. Verify streaming support, flush behavior, timeout and cache/compression policies across the actual path before changing application logic blindly. For an interview, discuss TLS termination, headers, limits and connection draining. Say what you would measure, not only which tool you would buy.

### Make a prediction

A client sends X-Forwarded-For claiming to be an administrator. Should your backend trust it?

Only through a verified proxy chain with controlled header rewriting. A client-supplied header is not trusted identity.

### Correct a misconception

A reverse proxy and load balancer cannot be the same component.

These are roles that can overlap in one product.

### Practical task

Inspect a proxy path

- Draw browser → proxy → application.

- Put body limits and timeouts at both boundaries.

- Explain what changes for a long-lived stream or WebSocket.

Expected outcome: The narrowest relevant limit can reject the request; streaming needs deliberate buffering and timeout choices.

### Choose interview depth

**Foundation:** Explain forwarding on behalf of servers.

**Practical:** Discuss TLS termination, headers, limits and connection draining.

**Advanced:** Defend trust boundaries, streaming behavior, redundancy and failure observability.

### Official references

- [NGINX reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)


## 20. DNS management

DNS translates names into records such as addresses. Managing DNS includes authoritative records, TTL, delegation and safe changes. It is not an HTTP redirect and does not instantly move every existing connection.

### Prerequisites

Domain name, resolver and cached record

### Learning goals

- Separate DNS and redirects

- reason about old TTLs

- validate changes

### Everyday explanation

A phone book maps a name to a number. People who wrote down yesterday number may keep using it until they check again. Changing the book cannot hang up every current call. DNS caches and existing network connections behave similarly.

### SeatSpot scenario

SeatSpot changes an application endpoint or validates a domain. A safe release must account for record type, current TTL, certificate/host configuration and rollback rather than assuming Save means every user changed immediately.

### Engineering detail

Distinguish recursive resolvers from authoritative name servers. A/AAAA map names to IPv4/IPv6 addresses; CNAME aliases a name with DNS constraints; TXT stores verification or other text. An HTTP redirect is an application response after a connection is made.

TTL controls how long compliant caches can retain a record. Lowering TTL at change time does not erase copies cached under the previous higher TTL. Plan ahead and keep the old endpoint safe during migration.

Protect DNS access, validate delegation and keep rollback records. DNS health routing depends on detection and caching, so it is not instantaneous failover. Verify resolution from relevant resolvers and actual HTTP/TLS behavior.

### Worked example

A record was cached at 10:00 with a 3,600 second TTL. You lower TTL at 10:10.

That existing cache may retain the old answer until about 11:00. The new shorter TTL affects later fetched answers, not already cached copies.

Reduce TTL in advance when appropriate, prepare both endpoints and monitor the transition. Keep domain ownership, DNS and hosting configuration separate in your explanation.

### Implementation sketch

```shell
dig example.com A
dig example.com AAAA
dig example.com NS
dig example.com TXT
# Read-only examples; replace with a domain you manage.
```

These commands inspect records where dig is installed. They do not edit DNS, prove application health or configure a Vercel/Spaceship account.

### Where it is used

- Domain verification and hostname routing.

- Planned endpoint migrations and controlled DNS failover.

### Common mistakes

- Calling a CNAME an HTTP 301 redirect.

- Expecting TTL changes to clear every resolver immediately.

- Forgetting certificates, host routing and the old endpoint.

### Exercise

Why do two users reach different servers after a DNS update?

Hint: Their resolvers may hold different cached answers.

Hint: Existing connections are separate from new lookups.

Solution: Resolvers fetched answers at different times and may retain previous TTLs. Clients may also reuse existing connections. Inspect records and actual request routing before concluding the update failed.

### Interview practice

**What happens when you type a hostname?**

Describe resolver/cache lookup, authoritative resolution when needed, connection establishment and TLS/HTTP. DNS is one stage, not the whole request.

Follow-up: Where can stale information remain?

**How do you prepare a DNS cutover?**

Validate target/TLS, plan TTL ahead, keep overlap/rollback and measure both resolution and application behavior.

Follow-up: What if the old TTL was one day?

### Check your understanding

Lowering TTL right now:

1. Erases every previously cached answer

2. Affects future fetched records but not all existing caches instantly

3. Creates an HTTP redirect

Correct option: 2. Previously cached answers can remain valid according to their original lifetime.

### Animation transcript

**Build an intuition**

Let us understand dns management. A phone book maps a name to a number. People who wrote down yesterday number may keep using it until they check again. Changing the book cannot hang up every current call. DNS caches and existing network connections behave similarly. DNS translates names into records such as addresses. Managing DNS includes authoritative records, TTL, delegation and safe changes. It is not an HTTP redirect and does not instantly move every existing connection.

**Follow the normal path**

Follow the normal path. The browser or operating system asks a resolver for the hostname. Existing local or resolver caches may already contain an answer. A resolver without a usable cached answer follows DNS resolution to the authoritative records. Record type and delegation must be configured correctly. SeatSpot changes an application endpoint or validates a domain. A safe release must account for record type, current TTL, certificate/host configuration and rollback rather than assuming Save means every user changed immediately.

**Predict a failure**

Now change one condition. A client may connect to the old endpoint while its answer is still valid. Changing the authoritative record does not instantly erase that cached answer. A common misunderstanding is this: DNS is an HTTP redirect. DNS provides records before the HTTP connection; a redirect is a later HTTP response. Think about this. A resolver cached a one-hour answer ten minutes ago. Does lowering TTL now erase its cache? Pause the video and make your prediction. No. That cached answer can remain until its old expiry. The shorter TTL applies to answers fetched later.

**Work through an example**

Let us reason with a concrete example. A record was cached at 10:00 with a 3,600 second TTL. You lower TTL at 10:10. That existing cache may retain the old answer until about 11:00. The new shorter TTL affects later fetched answers, not already cached copies. Reduce TTL in advance when appropriate, prepare both endpoints and monitor the transition. Keep domain ownership, DNS and hosting configuration separate in your explanation. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Later lookups can obtain the new destination. Clients and resolvers change at different times, so old and new endpoints may both receive traffic. The new address also needs the correct certificate, host routing and healthy application. Successful resolution alone does not prove the website works. When you try the practice task, look for this result. The old cached answer can remain until about 11:00; existing connections are a separate issue.

**Explain it back**

Check your understanding. Keep a rollback path and an appropriate overlap interval. Lower TTL in advance when useful; do not expect a last-second TTL edit to end existing connections. Here is a challenge. Why do two users reach different servers after a DNS update? Pause before the answer. Resolvers fetched answers at different times and may retain previous TTLs. Clients may also reuse existing connections. Inspect records and actual request routing before concluding the update failed. For an interview, discuss A/AAAA/CNAME/TXT, delegation and TTL planning. Say what you would measure, not only which tool you would buy.

### Make a prediction

A resolver cached a one-hour answer ten minutes ago. Does lowering TTL now erase its cache?

No. That cached answer can remain until its old expiry. The shorter TTL applies to answers fetched later.

### Correct a misconception

DNS is an HTTP redirect.

DNS provides records before the HTTP connection; a redirect is a later HTTP response.

### Practical task

Build a DNS migration timeline

- Place a 3,600-second cached answer at 10:00.

- Lower the authoritative TTL at 10:10.

- Mark the old answer’s possible expiry and keep both endpoints safe.

Expected outcome: The old cached answer can remain until about 11:00; existing connections are a separate issue.

### Choose interview depth

**Foundation:** Explain authoritative and recursive resolution.

**Practical:** Discuss A/AAAA/CNAME/TXT, delegation and TTL planning.

**Advanced:** Defend migration overlap, rollback, resolver differences and actual TLS/HTTP checks.

### Official references

- [Route 53 and DNS concepts](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html)

- [Kubernetes DNS examples](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)


## 21. Disaster recovery

Disaster recovery is a tested plan for restoring required service and data after a serious disruption. Define the acceptable recovery time and acceptable data-loss window, then prove your procedure can meet them.

### Prerequisites

Backup, restore and business operation

### Learning goals

- Define RTO and RPO

- find missing recovery dependencies

- measure a restore

### Everyday explanation

A student keeps a second copy of schoolwork in another safe place and practises opening it on a different computer. Knowing a copy exists is not enough if it is unreadable, its password is lost or it takes days to find. Recovery is the complete ability to resume useful work.

### SeatSpot scenario

SeatSpot needs a response to regional loss, accidental deletion or corruption. Application replicas alone do not restore deleted orders or missing secrets/configuration.

### Engineering detail

Recovery time objective (RTO) is the target time to restore required service; recovery point objective (RPO) is the acceptable data-loss window measured in time. State the business operation and how these targets are measured.

Choose backup/restore, pilot light, warm standby or an active multi-site design according to requirements and cost. Include infrastructure definitions, secrets recovery, dependencies, credentials, DNS, monitoring and people/runbooks, not just a database snapshot.

Perform restore drills in an isolated environment and validate actual data, integrity and application behavior. Replication can reproduce deletion/corruption, so backups and point-in-time recovery remain separate protections.

### Worked example

The business requires an illustrative RTO of 60 minutes and RPO of 15 minutes. Backups run every hour.

Hourly-only backups can leave nearly an hour of missing data, exceeding a 15-minute RPO. A 60-minute RTO also includes provisioning, restore, validation and traffic recovery, not just file download time.

Select a suitable backup/log capture strategy and rehearse the whole path. Targets are objectives; measured drill results establish whether the current plan meets them.

### Implementation sketch

```text
Recovery drill checklist:
1. Isolate recovery environment
2. Restore infrastructure, secrets and data
3. Verify counts, integrity and critical workflows
4. Measure recovery time and lost-data window
5. Record gaps and retest
```

A non-destructive planning checklist, not instructions to restore over a live production database. Real recovery needs approved environment-specific procedures.

### Where it is used

- Regional/service loss and data corruption recovery.

- Business continuity with measurable downtime/data-loss objectives.

### Common mistakes

- Confusing an RPO objective with a guarantee.

- Never testing a restore.

- Keeping every backup in the same compromised failure boundary.

### Exercise

A restore finishes in 40 minutes but application validation and routing take another 35. Does it meet a 60-minute RTO?

Hint: Measure usable service, not one step.

Hint: Include all recovery dependencies.

Solution: No: the measured end-to-end recovery is 75 minutes. Improve or revise the plan based on business requirements and repeat the drill.

### Interview practice

**How do you prove backups are useful?**

Restore them in isolation, query and validate data, run critical workflows and measure the full recovery time and achievable data-loss window.

Follow-up: Which credential or encryption key might prevent a restore?

**HA versus DR?**

High availability addresses defined ongoing service failures; disaster recovery restores service/data after a larger disruption. Their scopes can overlap, but replicas do not replace a tested restore plan.

Follow-up: What if accidental deletion replicates to every live copy?

### Check your understanding

RPO describes:

1. Acceptable data-loss time window

2. How many application replicas exist

3. The time taken by DNS lookup

Correct option: 1. RTO concerns recovery duration; RPO concerns how far back recoverable data may be.

### Animation transcript

**Build an intuition**

Let us understand disaster recovery. A student keeps a second copy of schoolwork in another safe place and practises opening it on a different computer. Knowing a copy exists is not enough if it is unreadable, its password is lost or it takes days to find. Recovery is the complete ability to resume useful work. Disaster recovery is a tested plan for restoring required service and data after a serious disruption. Define the acceptable recovery time and acceptable data-loss window, then prove your procedure can meet them.

**Follow the normal path**

Follow the normal path. Define how long the required user operation may be unavailable and how much recent data loss is acceptable. These are explicit business objectives, not product defaults. Capture suitable backups and change logs with recoverable keys and configuration. Live replication alone may copy deletion or corruption to every current replica. SeatSpot needs a response to regional loss, accidental deletion or corruption. Application replicas alone do not restore deleted orders or missing secrets/configuration.

**Predict a failure**

Now change one condition. A serious failure interrupts the production environment. Recovery needs an environment, permissions and an executable runbook, not merely a promise that a backup exists. A common misunderstanding is this: Replication replaces recovery backups. Replication may reproduce corruption or deletion. Independent recovery points solve a different problem. Think about this. Hourly-only backups are available. Do they satisfy a 15-minute recovery-point objective by themselves? Pause the video and make your prediction. No. The missing-data window can approach an hour. Use a suitable capture/recovery strategy and prove it in a drill.

**Work through an example**

Let us reason with a concrete example. The business requires an illustrative RTO of 60 minutes and RPO of 15 minutes. Backups run every hour. Hourly-only backups can leave nearly an hour of missing data, exceeding a 15-minute RPO. A 60-minute RTO also includes provisioning, restore, validation and traffic recovery, not just file download time. Select a suitable backup/log capture strategy and rehearse the whole path. Targets are objectives; measured drill results establish whether the current plan meets them. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Rebuild required infrastructure and restore data in a safe environment. Include secrets, certificates, queues and other dependencies required for actual user workflows. Query restored data and run correctness checks. A process reporting restore complete does not prove that bookings, ownership and payment reconciliation are usable. When you try the practice task, look for this result. An existing backup is not proof of a usable recovery plan; measured restoration is the evidence.

**Explain it back**

Check your understanding. Restore traffic safely and compare measured end-to-end recovery and data loss with the objectives. Record gaps, improve the runbook and repeat the drill. Here is a challenge. A restore finishes in 40 minutes but application validation and routing take another 35. Does it meet a 60-minute RTO? Pause before the answer. No: the measured end-to-end recovery is 75 minutes. Improve or revise the plan based on business requirements and repeat the drill. For an interview, choose a recovery strategy and measure the complete drill. Say what you would measure, not only which tool you would buy.

### Make a prediction

Hourly-only backups are available. Do they satisfy a 15-minute recovery-point objective by themselves?

No. The missing-data window can approach an hour. Use a suitable capture/recovery strategy and prove it in a drill.

### Correct a misconception

Replication replaces recovery backups.

Replication may reproduce corruption or deletion. Independent recovery points solve a different problem.

### Practical task

Plan a recovery drill on paper

- Set RTO to 60 minutes and RPO to 15 minutes.

- Budget provisioning, data restore, validation and traffic recovery.

- List credentials, dependencies and people needed to finish.

Expected outcome: An existing backup is not proof of a usable recovery plan; measured restoration is the evidence.

### Choose interview depth

**Foundation:** Explain acceptable downtime and data-loss windows.

**Practical:** Choose a recovery strategy and measure the complete drill.

**Advanced:** Defend recovery/failback dependencies, secret access and data-integrity evidence.

### Official references

- [AWS recovery testing](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_backing_up_data_periodic_recovery_testing_data.html)

- [Disaster recovery strategies](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html)


## 22. Zero-downtime deployments

A zero-downtime deployment aims to release a change without interrupting required user operations. Rolling or blue-green rollout helps, but database compatibility, readiness and connection draining are part of the design.

### Prerequisites

Readiness, old/new versions and schema compatibility

### Learning goals

- Trace a rollout

- budget extra capacity

- use expand/contract

### Everyday explanation

A school repairs one classroom while students use another ready room. Moving students before the new room has desks causes disruption. Throwing away the old room key before every class moves makes rollback difficult. Old and new arrangements must coexist safely during the transition.

### SeatSpot scenario

SeatSpot must release a booking API while active users and old mobile clients remain. New code and old code may run simultaneously against the same data.

### Engineering detail

Rolling deployment gradually replaces replicas; blue-green prepares a separate version then switches traffic; canaries expose a limited audience first. Each approach has different capacity and rollback requirements.

Readiness should mean the instance can serve intended traffic, not merely that its process started. Drain in-flight requests, close long-lived connections deliberately and allow graceful shutdown. Available spare capacity must cover the rollout.

Use expand/contract schema changes: introduce a compatible representation, migrate/backfill safely, switch readers/writers and only later remove old structures. Rolling back code does not undo an irreversible data migration.

### Worked example

Four replicas must remain available; one replacement is created before one old replica is removed.

The rollout temporarily needs capacity for five. If no spare capacity exists, readiness and rollout policy can stall. This simple count excludes node limits and dependency capacity.

Test old/new coexistence and rollback with real requests. Treat zero downtime as a measured release goal, not an unconditional Kubernetes flag.

### Implementation sketch

```yaml
# Deployment strategy fragment
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
# Also define readiness and graceful termination.
```

This fragment requires a complete Deployment and spare scheduling capacity. It does not guarantee database compatibility, successful probes or uninterrupted long-lived connections.

### Where it is used

- Releasing user-facing services with an availability objective.

- Gradual validation and controlled rollback of compatible versions.

### Common mistakes

- Marking a pod ready before initialization is complete.

- Dropping a database column still read by the old version.

- Assuming code rollback reverses data changes.

### Exercise

Version B renames a database field and Version A still runs. What safer migration sequence can you use?

Hint: Make old and new versions compatible first.

Hint: Destructive cleanup belongs after migration and verification.

Solution: Expand with the new field, implement compatible reads/writes, backfill and validate, switch traffic/readers, then contract only when old users are gone. Plan failure/rollback at each step.

### Interview practice

**Why can rolling deployment still cause downtime?**

Bad readiness, insufficient headroom, incompatible contracts/schema, connection interruption or a shared dependency can break users while replicas appear available.

Follow-up: How do you test WebSockets or long-running jobs?

**Canary success metric?**

Compare user-visible errors, latency and correctness with a control, watch dependency saturation and use explicit rollback criteria. Small samples can hide rare failures.

Follow-up: Which operation would you validate for a ticket sale?

### Check your understanding

maxUnavailable: 0 guarantees:

1. No possible user-visible failures

2. A desired rollout availability constraint, not complete application correctness

3. Automatic reversible schema migration

Correct option: 2. Controller settings do not prove readiness, compatibility or dependency health.

### Animation transcript

**Build an intuition**

Let us understand zero-downtime deployments. A school repairs one classroom while students use another ready room. Moving students before the new room has desks causes disruption. Throwing away the old room key before every class moves makes rollback difficult. Old and new arrangements must coexist safely during the transition. A zero-downtime deployment aims to release a change without interrupting required user operations. Rolling or blue-green rollout helps, but database compatibility, readiness and connection draining are part of the design.

**Follow the normal path**

Follow the normal path. Visitors use the existing version while the next release is prepared. Establish user-visible metrics and rollback conditions before shifting traffic. Create new capacity without immediately removing all old instances. Download, initialization and dependency setup take time and need spare resources. SeatSpot must release a booking API while active users and old mobile clients remain. New code and old code may run simultaneously against the same data.

**Predict a failure**

Now change one condition. The readiness gate verifies the instance can serve the intended request. A running process with missing dependencies should not receive normal traffic yet. A common misunderstanding is this: maxUnavailable: 0 guarantees the whole application is correct. It expresses a rollout constraint; readiness, data compatibility and spare capacity remain necessary. Think about this. Old code still reads a column while new code deploys. Can you drop that column immediately? Pause the video and make your prediction. No. Keep old/new versions compatible during coexistence and rollback. Remove obsolete structures only after the transition is proven safe.

**Work through an example**

Let us reason with a concrete example. Four replicas must remain available; one replacement is created before one old replica is removed. The rollout temporarily needs capacity for five. If no spare capacity exists, readiness and rollout policy can stall. This simple count excludes node limits and dependency capacity. Test old/new coexistence and rollback with real requests. Treat zero downtime as a measured release goal, not an unconditional Kubernetes flag. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Send a bounded share to the new version and drain old work deliberately. Monitor errors and latency for real user operations, not only process health. Both versions can access the database during rollout. Expand and migrate safely before removing fields or behavior the old version still needs. When you try the practice task, look for this result. Rolling back code does not automatically reverse a destructive data migration.

**Explain it back**

Check your understanding. Stop or reverse traffic movement if the release violates its criteria. Code rollback cannot magically reverse incompatible or destructive data changes. Here is a challenge. Version B renames a database field and Version A still runs. What safer migration sequence can you use? Pause before the answer. Expand with the new field, implement compatible reads/writes, backfill and validate, switch traffic/readers, then contract only when old users are gone. Plan failure/rollback at each step. For an interview, discuss surge capacity, draining and compatible schemas. Say what you would measure, not only which tool you would buy.

### Make a prediction

Old code still reads a column while new code deploys. Can you drop that column immediately?

No. Keep old/new versions compatible during coexistence and rollback. Remove obsolete structures only after the transition is proven safe.

### Correct a misconception

maxUnavailable: 0 guarantees the whole application is correct.

It expresses a rollout constraint; readiness, data compatibility and spare capacity remain necessary.

### Practical task

Stage an expand/contract rollout

- Add a compatible new field without removing the old one.

- Migrate/backfill, switch readers/writers and monitor.

- Remove the obsolete representation in a later verified release.

Expected outcome: Rolling back code does not automatically reverse a destructive data migration.

### Choose interview depth

**Foundation:** Explain replacing one ready replica at a time.

**Practical:** Discuss surge capacity, draining and compatible schemas.

**Advanced:** Defend canary evidence, irreversible migrations, long-lived requests and rollback limits.

### Official references

- [Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)


## 23. Distributed tracing

Distributed tracing follows one operation across multiple components using linked spans and propagated context. It helps locate time and errors, but traces are sampled evidence, not proof that every request behaved the same way.

### Prerequisites

Request duration, span and parallel work

### Learning goals

- Trace one request

- find the critical path

- protect telemetry data

### Everyday explanation

A parcel carries a tracking number through several delivery centres. Each centre records when its part began and ended. You can find where this parcel waited. That does not mean every parcel took the same path, and missing a tracking scan does not prove the parcel disappeared.

### SeatSpot scenario

SeatSpot checkout passes through gateway, booking, database and payment. One total latency number cannot show which hop waited or whether two operations ran in parallel.

### Engineering detail

A trace groups related spans; spans record operation timing, parent relationships and attributes. Propagate context across HTTP and messaging boundaries using compatible instrumentation. Broken context creates disconnected fragments.

Nested and parallel span durations must not be blindly added. Inspect the critical path and missing time. Sampling affects which requests are visible; pair traces with aggregated metrics and contextual logs.

Avoid secrets, payment data and unnecessary personal identifiers in span attributes. Bound high-cardinality fields and restrict observability access/retention. Instrumenting everything without a budget can add cost and overhead.

### Worked example

Checkout has a 100 ms database call and a 300 ms provider call in parallel, plus about 40 ms sequential overhead.

A simplified total is about 340 ms, not 440 ms. Actual scheduling, serialization and network effects require measured traces.

Investigate the critical path and compare slow traces with broader metrics. Do not optimize a fast database span just because it is easiest to see.

### Implementation sketch

```text
trace: checkout
  gateway                 0–340 ms
    booking              10–330 ms
      database           20–120 ms
      payment            20–320 ms
# database/payment overlap; do not add them blindly.
```

Illustrative timing data, not production telemetry or benchmark results. A real trace also needs propagated identity, errors and instrumentation context.

### Where it is used

- Finding bottlenecks in distributed requests.

- Correlating partial failures across service boundaries.

### Common mistakes

- Adding parallel durations as if sequential.

- Putting access tokens or card details in attributes.

- Assuming sampled traces represent all traffic.

### Exercise

Two 200 ms spans run in parallel inside a 250 ms request. Is the request necessarily missing 150 ms?

Hint: Draw the time intervals.

Hint: Parent and child durations overlap.

Solution: No. Parallel spans overlap, so their sum can exceed wall-clock request duration. Inspect start/end times and the critical path before inferring missing time.

### Interview practice

**Logs, metrics or traces?**

Metrics show aggregate behavior, logs capture contextual records and traces link work across a request path. Use them together; no single signal answers every question.

Follow-up: How do you find whether a slow sampled trace is common?

**What if a message starts a new trace?**

Explain propagation and span links/asynchronous boundaries. A consumer may continue or link causal context depending on instrumentation and semantics.

Follow-up: What sensitive attributes would you prohibit?

### Check your understanding

Two child spans overlap. Their durations:

1. Always add to the parent duration

2. Can sum to more than request wall-clock time

3. Prove the instrumentation is broken

Correct option: 2. Parallel work and nested timing overlap; inspect the timeline.

### Animation transcript

**Build an intuition**

Let us understand distributed tracing. A parcel carries a tracking number through several delivery centres. Each centre records when its part began and ended. You can find where this parcel waited. That does not mean every parcel took the same path, and missing a tracking scan does not prove the parcel disappeared. Distributed tracing follows one operation across multiple components using linked spans and propagated context. It helps locate time and errors, but traces are sampled evidence, not proof that every request behaved the same way.

**Follow the normal path**

Follow the normal path. The gateway starts or receives trace context for checkout. Its span represents one part of the operation, not all system traffic. Booking receives compatible context and creates a related span. Without propagation, downstream records can appear as unrelated operations. SeatSpot checkout passes through gateway, booking, database and payment. One total latency number cannot show which hop waited or whether two operations ran in parallel.

**Predict a failure**

Now change one condition. Database and payment calls run in parallel in this teaching example. Their intervals overlap, so adding both durations would overstate wall-clock time. A common misunderstanding is this: A sampled trace proves every request behaved the same way. Sampling selects evidence, not every operation. Missing context also creates incomplete traces. Think about this. A 100 ms database call overlaps a 300 ms payment call, with 40 ms overhead. Is total duration necessarily 440 ms? Pause the video and make your prediction. No. In the simplified parallel example it is about 340 ms. Inspect overlap and missing time rather than summing every child span.

**Work through an example**

Let us reason with a concrete example. Checkout has a 100 ms database call and a 300 ms provider call in parallel, plus about 40 ms sequential overhead. A simplified total is about 340 ms, not 440 ms. Actual scheduling, serialization and network effects require measured traces. Investigate the critical path and compare slow traces with broader metrics. Do not optimize a fast database span just because it is easiest to see. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. Instrumentation exports spans to an observability backend. Export buffering, sampling and failures mean a trace view is not a complete audit of every request. Compare the critical path, errors and dependency waits. Combine traces with aggregate metrics to determine whether the visible slow request reflects a widespread problem. When you try the practice task, look for this result. Parallel work overlaps in wall-clock time; sampled traces must be compared with aggregate metrics.

**Explain it back**

Check your understanding. Do not attach secrets or unnecessary personal data to spans. Keep attribute cardinality, access, sampling and retention within a deliberate observability budget. Here is a challenge. Two 200 ms spans run in parallel inside a 250 ms request. Is the request necessarily missing 150 ms? Pause before the answer. No. Parallel spans overlap, so their sum can exceed wall-clock request duration. Inspect start/end times and the critical path before inferring missing time. For an interview, discuss context propagation, critical paths and useful attributes. Say what you would measure, not only which tool you would buy.

### Make a prediction

A 100 ms database call overlaps a 300 ms payment call, with 40 ms overhead. Is total duration necessarily 440 ms?

No. In the simplified parallel example it is about 340 ms. Inspect overlap and missing time rather than summing every child span.

### Correct a misconception

A sampled trace proves every request behaved the same way.

Sampling selects evidence, not every operation. Missing context also creates incomplete traces.

### Practical task

Draw a trace timeline

- Draw database from 20 to 120 ms.

- Draw payment from 20 to 320 ms on a second row.

- Add sequential overhead and identify the critical path.

Expected outcome: Parallel work overlaps in wall-clock time; sampled traces must be compared with aggregate metrics.

### Choose interview depth

**Foundation:** Explain a trace ID and linked spans.

**Practical:** Discuss context propagation, critical paths and useful attributes.

**Advanced:** Defend sampling, cardinality, retention, privacy and observability cost.

### Official references

- [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/)

- [OpenTelemetry concepts](https://opentelemetry.io/docs/concepts/)


## 24. Network segmentation

Network segmentation limits which systems may communicate across network boundaries. It reduces reachability and blast radius. It does not replace identity checks, encryption or resource-level authorization.

### Prerequisites

Source, destination, port and application authorization

### Learning goals

- Map required flows

- separate ingress/egress

- test allowed and denied paths

### Everyday explanation

A school separates the public reception, classrooms and locked records room. A visitor can enter reception without getting a path to every room. A classroom door being reachable still does not authorize reading a student file. Network access and application permission remain different checks.

### SeatSpot scenario

SeatSpot public web traffic should not directly reach the orders database or administrative services. Booking may need a narrow database connection while an unrelated image worker does not.

### Engineering detail

Map the required flows by source, destination, protocol and port. Apply least privilege and explicitly allow required DNS, monitoring and other dependencies. A deny rule that breaks name resolution can look like an application outage.

Kubernetes NetworkPolicy needs a network implementation that enforces it. Ingress and egress isolation are separate; namespace and pod selectors have specific semantics. Test actual allowed and denied connections from the relevant workloads.

Segmentation can limit lateral movement, but compromised allowed callers still need authentication/authorization boundaries. Protect management access, credentials and encrypted transport separately, and observe unexpected denied flows.

### Worked example

Only the booking workload should initiate the database application connection on its configured port.

A rule allowing the whole namespace may expose more callers than intended; a narrower pod selector can express the required source if labels and enforcement are trustworthy.

Test a permitted booking connection and a denied unrelated-worker connection. Also verify DNS and any cross-namespace behavior in the actual cluster.

### Implementation sketch

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: {name: database-ingress}
spec:
  podSelector: {matchLabels: {role: database}}
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector: {matchLabels: {role: booking}}
      ports: [{protocol: TCP, port: 5432}]
```

Example ingress policy within one namespace; it needs an enforcing network plugin and correct labels. It does not configure egress, TLS, database credentials or application ownership checks.

### Where it is used

- Restricting unnecessary internal reachability.

- Separating public, service, data and management boundaries.

### Common mistakes

- Assuming a policy object guarantees enforcement.

- Blocking DNS or observability accidentally.

- Using network reachability instead of authorization.

### Exercise

A pod has a NetworkPolicy but unwanted traffic still reaches it. What do you verify?

Hint: Check the selected pods and applicable policy set.

Hint: Check whether the network implementation enforces the policy.

Solution: Verify enforcement support, labels/selectors, namespace semantics, ingress/egress direction and other allowed rules. Test from the real source workload rather than only inspecting YAML.

### Interview practice

**How would you design segmentation?**

Inventory required flows, default-deny where appropriate, allow narrow dependencies, test both success and denial, and observe effects. Keep identity and application permissions separate.

Follow-up: How do you avoid blocking DNS?

**Is a private subnet enough?**

No. Routing and network placement are one boundary. Credentials, application authorization, transport protection and management controls still matter.

Follow-up: What can a compromised allowed client still attempt?

### Check your understanding

NetworkPolicy enforcement requires:

1. Only saving YAML

2. A supporting network implementation and correct selectors/rules

3. Removing database authorization

Correct option: 2. Intent and actual enforced network behavior must be verified.

### Animation transcript

**Build an intuition**

Let us understand network segmentation. A school separates the public reception, classrooms and locked records room. A visitor can enter reception without getting a path to every room. A classroom door being reachable still does not authorize reading a student file. Network access and application permission remain different checks. Network segmentation limits which systems may communicate across network boundaries. It reduces reachability and blast radius. It does not replace identity checks, encryption or resource-level authorization.

**Follow the normal path**

Follow the normal path. The public client needs the web tier, which needs booking. Booking needs the database. Record required ports and dependencies before introducing isolation. The unrelated worker has no business requirement to contact the orders database. Blocking that path reduces reachability and potential blast radius. SeatSpot public web traffic should not directly reach the orders database or administrative services. Booking may need a narrow database connection while an unrelated image worker does not.

**Predict a failure**

Now change one condition. Permit the actual booking workload to use the configured database port. Broad namespace-wide rules may allow more callers than intended. A common misunderstanding is this: NetworkPolicy automatically works in every Kubernetes cluster. Enforcement depends on the network implementation and correct selector semantics. Think about this. A database port is reachable from a booking pod. Does that authorize every SQL operation? Pause the video and make your prediction. No. Network reachability is one boundary. Database credentials and application resource authorization still matter.

**Work through an example**

Let us reason with a concrete example. Only the booking workload should initiate the database application connection on its configured port. A rule allowing the whole namespace may expose more callers than intended; a narrower pod selector can express the required source if labels and enforcement are trustworthy. Test a permitted booking connection and a denied unrelated-worker connection. Also verify DNS and any cross-namespace behavior in the actual cluster. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. A policy object is only configuration intent. The cluster network implementation must support and enforce it, and selectors must match the intended workloads. An allowed TCP connection is not permission to read every order. Database credentials, encrypted transport and application ownership checks remain separate controls. When you try the practice task, look for this result. A supporting network implementation must actually enforce the policy; a YAML file alone proves nothing.

**Explain it back**

Check your understanding. Verify allowed traffic, denied traffic and necessary DNS/monitoring dependencies. Observe unexpected failures and refine the policy without silently opening everything. Here is a challenge. A pod has a NetworkPolicy but unwanted traffic still reaches it. What do you verify? Pause before the answer. Verify enforcement support, labels/selectors, namespace semantics, ingress/egress direction and other allowed rules. Test from the real source workload rather than only inspecting YAML. For an interview, discuss ingress, egress, DNS and actual connection tests. Say what you would measure, not only which tool you would buy.

### Make a prediction

A database port is reachable from a booking pod. Does that authorize every SQL operation?

No. Network reachability is one boundary. Database credentials and application resource authorization still matter.

### Correct a misconception

NetworkPolicy automatically works in every Kubernetes cluster.

Enforcement depends on the network implementation and correct selector semantics.

### Practical task

Create an allow/deny matrix

- List booking → database and unrelated-worker → database.

- Specify protocol/port and trustworthy selectors.

- Test allowed and denied paths, including required DNS.

Expected outcome: A supporting network implementation must actually enforce the policy; a YAML file alone proves nothing.

### Choose interview depth

**Foundation:** Explain reducing unnecessary reachability.

**Practical:** Discuss ingress, egress, DNS and actual connection tests.

**Advanced:** Defend lateral-movement limits, workload identity, encrypted transport and policy rollout.

### Official references

- [Kubernetes NetworkPolicy](https://kubernetes.io/docs/concepts/services-networking/network-policies/)


## 25. Multi-region setup

A multi-region design runs required components in more than one geographic region. It can support regional recovery or lower user latency, but distant data coordination adds latency, consistency and operational trade-offs.

### Prerequisites

Write owner, replication lag and network partition

### Learning goals

- Separate read/write topology

- preserve seat ownership

- plan failover and failback

### Everyday explanation

A school keeps a working campus in another city. Classes can move after a local disaster, but both campuses must agree which student records are current. If both sell the last seat in the same bus independently, simply having two campuses creates a conflict instead of solving it.

### SeatSpot scenario

SeatSpot might serve public catalog reads near users in two regions while keeping seat reservation ownership in one write region. Choosing active-active writes requires an explicit conflict/coordination strategy, not merely deploying the same containers twice.

### Engineering detail

Active-passive keeps one site serving while another can take over; active-active serves from multiple sites. These labels must be defined for each operation because reads and writes can have different topologies.

Synchronous cross-region coordination adds distance-dependent latency and can refuse work when required peers cannot communicate. Asynchronous replication allows lag and possible recent-data loss/conflicts after failure. During a partition, state the consistency/availability choice precisely rather than saying pick any two without conditions.

Plan routing, data placement, write fencing, regional dependency independence, failback and drills. A second region that depends on the first region secrets, database or control plane may not survive the failure you intended to tolerate.

### Worked example

Two regions can both see one remaining seat while cross-region communication is interrupted.

If both independently confirm the seat, availability was preserved but the uniqueness invariant was broken. Preventing that requires a single owner, coordinated decision or a product model that explicitly tolerates/reconciles conflict.

Keep authoritative seat allocation under a clear ownership/consistency rule. Use regional catalog caches separately and test failover and failback with realistic lag.

### Implementation sketch

```text
Public catalog: regional reads with bounded staleness
Seat allocation: one authoritative owner per seat
Failover: promote only after fencing old writer
Recovery: reconcile lag, route safely, test failback
```

A conceptual topology, not an automatic cloud failover script. The correct design depends on business invariants, supported storage guarantees and measured recovery requirements.

### Where it is used

- Regional disaster recovery with defined objectives.

- Geographically distributed users with explicit data-locality/consistency needs.

### Common mistakes

- Calling two deployments an independent multi-region service.

- Ignoring conflicting writes and fencing.

- Promising zero latency or zero data loss without a supported guarantee.

### Exercise

Both regions can independently book the last seat during a partition. What requirement is missing?

Hint: Name the invariant first.

Hint: Decide who is allowed to confirm a write.

Solution: There is no safe authoritative allocation/coordination rule for the uniqueness requirement. Define ownership, fencing and the partition policy; refuse or defer some writes if necessary rather than double-sell.

### Interview practice

**How would you choose active-passive versus active-active?**

Start with regional failure, latency, data-loss and consistency requirements for each operation. Compare operating cost, recovery evidence and write conflict handling.

Follow-up: Can catalog reads and seat writes use different models?

**What makes failback hard?**

Data may diverge, clients may keep old routes and in-flight work may exist in both sites. Reconcile ownership/state and drain safely before routing back.

Follow-up: How do you prove the old writer cannot accept new writes?

### Check your understanding

During a network partition, confirming the same last seat independently in both regions can:

1. Guarantee global uniqueness

2. Break the seat-allocation invariant

3. Eliminate reconciliation

Correct option: 2. Write ownership and coordination are business correctness decisions, not consequences of adding a region.

### Animation transcript

**Build an intuition**

Let us understand multi-region setup. A school keeps a working campus in another city. Classes can move after a local disaster, but both campuses must agree which student records are current. If both sell the last seat in the same bus independently, simply having two campuses creates a conflict instead of solving it. A multi-region design runs required components in more than one geographic region. It can support regional recovery or lower user latency, but distant data coordination adds latency, consistency and operational trade-offs.

**Follow the normal path**

Follow the normal path. Decide whether another region is for disaster recovery, nearby reads or active writes. Each operation can have different latency, availability and consistency requirements. Region A sends changes toward Region B. Asynchronous copying can lag; synchronous coordination adds waiting and depends on the communication path. SeatSpot might serve public catalog reads near users in two regions while keeping seat reservation ownership in one write region. Choosing active-active writes requires an explicit conflict/coordination strategy, not merely deploying the same containers twice.

**Predict a failure**

Now change one condition. The regions cannot communicate. Allowing both to confirm the same last seat independently can violate correctness even though both applications are running. A common misunderstanding is this: Two regions automatically double availability with no trade-off. Distant coordination adds latency and failure choices; shared dependencies can still fail both. Think about this. Two disconnected regions each see the same last seat. Can both confirm it independently while preserving uniqueness? Pause the video and make your prediction. No. Use a clear owner or coordinated decision, or choose a product model that explicitly accepts and reconciles conflicts.

**Work through an example**

Let us reason with a concrete example. Two regions can both see one remaining seat while cross-region communication is interrupted. If both independently confirm the seat, availability was preserved but the uniqueness invariant was broken. Preventing that requires a single owner, coordinated decision or a product model that explicitly tolerates/reconciles conflict. Keep authoritative seat allocation under a clear ownership/consistency rule. Use regional catalog caches separately and test failover and failback with realistic lag. These figures are teaching examples, not production guarantees.

**Choose and apply**

Turn the idea into a design decision. A safe failover establishes which writer owns new decisions and prevents the old writer from conflicting. Routing alone does not settle database ownership. Direct eligible traffic to the recovery region and validate the actual booking workflow. Its capacity, credentials and dependencies must work independently enough for the failure scenario. When you try the practice task, look for this result. A second region is useful only if required dependencies and recovery procedures survive the chosen regional failure.

**Explain it back**

Check your understanding. After recovery, reconcile lag and in-flight work before moving ownership back. Test both failover and failback instead of treating the first traffic switch as the whole plan. Here is a challenge. Both regions can independently book the last seat during a partition. What requirement is missing? Pause before the answer. There is no safe authoritative allocation/coordination rule for the uniqueness requirement. Define ownership, fencing and the partition policy; refuse or defer some writes if necessary rather than double-sell. For an interview, compare per-operation consistency, routing and recovery objectives. Say what you would measure, not only which tool you would buy.

### Make a prediction

Two disconnected regions each see the same last seat. Can both confirm it independently while preserving uniqueness?

No. Use a clear owner or coordinated decision, or choose a product model that explicitly accepts and reconciles conflicts.

### Correct a misconception

Two regions automatically double availability with no trade-off.

Distant coordination adds latency and failure choices; shared dependencies can still fail both.

### Practical task

Compare regional booking designs

- Draw active-passive and active-active read paths.

- Mark the authoritative owner of each seat and simulate a partition.

- Explain promotion, fencing, lag and return to the original region.

Expected outcome: A second region is useful only if required dependencies and recovery procedures survive the chosen regional failure.

### Choose interview depth

**Foundation:** Explain why a distant working copy can help.

**Practical:** Compare per-operation consistency, routing and recovery objectives.

**Advanced:** Defend ownership, fencing, partition behavior, failback and regional operating cost.

### Official references

- [AWS multi-region data trade-offs](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-multi-region-fundamentals/fundamental-2.html)

- [Disaster recovery strategies](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html)


## Capstone: design a ticket sale

Start with 100 browsing requests/second and 5 booking attempts/second. Grow to 2,000 browsing requests/second and 100 booking attempts/second for ten minutes. Specify assumptions, latency and availability objectives, a seat-ownership invariant, storage and traffic estimates. Add components only when a requirement justifies them.

Inject one-zone loss and a lost payment response. Explain idempotency, pending state, concurrency limits, observability and recovery. For regional recovery, define RTO/RPO, write ownership, fencing, lag and failback. All numbers are fictional exercises, not benchmarks.

## Interview self-check

Clarify requirements; estimate with units; draw a request and data path; explain a failure; defend latency/cost/consistency/recovery trade-offs; name evidence and tests. Early-career practice: correct path and one failure. Mid-level: capacity and idempotency. Senior: ownership, migration, correlated failure and operating cost. These are practice levels, not promises about a particular employer.

## Media and privacy

MP4 clips contain offline-generated synthetic English female narration (Kokoro v1.0, af_heart), animated architecture paths and readable captions. VTT caption files and transcripts accompany them. Videos are conceptual illustrations, not recordings of real clusters. No source-image portrait, music or social-media video was reused. Progress and notes in the integrated website are stored locally; export them before clearing browser storage.

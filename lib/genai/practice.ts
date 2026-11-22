export const mockRounds=[
 {id:'screen',title:'Foundation screen',minutes:25,goal:'Explain mechanisms without relying on vocabulary alone.',prompts:[{q:'Explain tokens, embeddings and attention to a developer new to GenAI.',a:'Tokens are model-specific input units. Embeddings are learned vector representations; their geometry supports similarity, not truth. Attention mixes allowed representations using query-key scores and value vectors. Use a small example, distinguish each mechanism and avoid calling similarity a fact check.'},{q:'What would you choose first: prompting, RAG, fine-tuning or an agent?',a:'Start from the failure and the simplest baseline. Prompting can define behavior; RAG adds attributable changing evidence; fine-tuning adapts learned patterns; agents choose actions under constraints. They can be combined. Justify complexity with held-out quality, latency and cost measurements.'}]},
 {id:'numbers',title:'Numbers and operating constraints',minutes:35,goal:'Calculate with units and explicit assumptions.',prompts:[{q:'Estimate memory for a 7B model and a 4,096-token dense KV cache.',a:'At 2 bytes per parameter, idealized weights occupy 14 billion bytes, about 13.04 GiB. With 32 layers, 32 KV heads, head dimension 128, batch 1 and 2-byte cache elements: 2×32×32×128×4096×1×2 = 2 GiB. Add runtime allocations and headroom; this arithmetic alone cannot prove GPU fit. With 8 KV heads, the cache example is 0.5 GiB.'},{q:'A 2-point gain on 200 questions: statistically real or luck?',a:'Clarify that two percentage points means four net additional correct answers. Use the same cases and retain paired outcomes. Four wins and zero losses differ from 24 wins and 20 losses even though both net four. Use a suitable paired test or paired bootstrap, report uncertainty and inspect slices. Four discordant wins alone give a two-sided exact sign/binomial probability of 0.125 under equal win/loss odds, so this example is not strong evidence at a conventional 0.05 threshold. Consider practical impact and evaluation validity too.'}]},
 {id:'design',title:'RAG and evaluation system design',minutes:60,goal:'Connect architecture to user outcomes, safety and evidence.',prompts:[{q:'Design an eval pipeline for a customer-support RAG assistant.',a:'Define supported tasks, authorization and harmful outcomes. Build representative human-labeled answerable, unanswerable, exact-ID, stale-source and adversarial cases. Separate development and held-out sets. Score retrieval recall and context usefulness, then answer correctness, support, relevance and abstention. Validate citations and actions deterministically. Calibrate any LLM judge with blinded human labels and order swaps. Version all inputs, compare paired results with uncertainty and monitor failure slices, tail latency, cost and post-deployment drift.'},{q:'Define faithfulness, answer relevance and context precision.',a:'Faithfulness asks whether generated claims are supported by the supplied evidence; it does not alone prove the evidence is true. Answer relevance asks whether the answer addresses the user question. Context precision concerns how much retrieved evidence is relevant, sometimes using a rank-aware definition. Specify the actual scoring protocol and labels because metric implementations differ. Track correctness against an authoritative reference separately.'},{q:'Why does dense retrieval miss exact product codes, and how do you validate chunking?',a:'Embeddings need not preserve arbitrary exact identifiers. Use exact metadata lookup or lexical retrieval, fuse with semantic candidates and test ID-specific queries. Compare chunk size and overlap on the same labeled documents and questions, measuring recall, boundary failures, duplicated evidence, final answer support and operating cost.'}]},
 {id:'coding',title:'Coding and debugging',minutes:45,goal:'Write verifiable code and explain its failure cases.',prompts:[{q:'Implement cosine similarity, bounded chunking and reciprocal rank fusion.',a:'Validate dimensions and zero vectors for cosine similarity. Enforce positive chunk size and overlap smaller than size, advance by size minus overlap and avoid an extra fully duplicated tail. For RRF, deduplicate each ranking, add 1/(k+rank) by document ID and make ties deterministic. Test empty data, duplicates, invalid inputs and exact expected examples. Explain why this toy code is not a production vector index.'},{q:'Design retries for a streamed tool-using assistant.',a:'Retry only eligible transient failures within a time and attempt budget; use capped exponential backoff with jitter and respect retry guidance. Do not replay visible output or side effects blindly. Track request IDs and stream boundaries, support cancellation, use idempotency for writes and reconcile unknown outcomes. Test dropped connections, partial events, rate limits and duplicate submissions.'}]},
 {id:'proof',title:'Project review and ownership',minutes:40,goal:'Show evidence of your work and discuss a failure honestly.',prompts:[{q:'Tell me about a production or demo failure.',a:'Use a real example: user impact and context, your own responsibility, evidence used to isolate the fault, immediate containment, root cause and prevention. State what changed and how you verified it. If your experience is a personal demo, call it a demo and describe its limits rather than presenting it as production ownership.'},{q:'Why GenAI over classical ML, and what would change your mind?',a:'Compare approaches against the task, label availability, acceptable error, interpretability, latency and cost. A conventional classifier or rules may be the better baseline for stable categories. Generative approaches can help with open-ended language or synthesis but need evidence and action controls. Name a measured result that would justify switching.'},{q:'Where do you want to grow, and what are your practical job constraints?',a:'Connect a realistic learning goal to evidence from your projects and the role requirements. For availability and compensation discussions, provide accurate personal facts and ask about role scope. There is no technical model answer or required personal disclosure beyond what you choose to share.'}]},
];
export const projects=[
 {title:'Cited policy-support RAG application',deliverable:'A small application that answers from authorized documents or explains why evidence is insufficient.',steps:['Create a synthetic policy corpus with two users, exact policy IDs, outdated clauses and an unanswerable question. Do not use real customer records.','Preserve source IDs and versions while parsing and chunking. Compare lexical, semantic and hybrid candidates with permission filtering.','Generate or manually draft cited answers. Validate citations against the actual retrieved set; use a deterministic stub until you deliberately connect a model.','Compare a baseline with one change on a held-out set. Record retrieval failures, unsupported claims, abstention errors, latency and assumptions.'],proof:['A data-flow diagram with tenant boundaries.','A versioned dataset and reproducible evaluation command.','Examples of a retrieval miss, a generation error and a correct abstention.','A short report that separates observed results from estimates.']},
 {title:'Evaluation harness and judge calibration',deliverable:'A repeatable comparison of two assistant versions with human labels and failure analysis.',steps:['Author at least 30 synthetic cases spanning normal, missing-evidence, exact-ID and adversarial behavior. This is a starter set, not sufficient statistical assurance.','Separate development and held-out examples. Label expected evidence, answerability and risky actions.','Implement exact citation/schema checks; add human rubric scoring and optionally a separately configured model judge.','Swap candidate order, hide model names and compare false positives, missed bad answers, paired wins/losses and uncertain cases.'],proof:['Dataset schema and annotation guide.','A confusion matrix and disagreement examples.','Paired comparison with uncertainty and stated limitations.','Explicit severity-based release thresholds.']},
 {title:'Bounded tool-using assistant with review',deliverable:'A controlled agent loop whose side effects require verified permissions and approval.',steps:['Use synthetic lookup and draft-email tools with typed input/output. Separate proposals from executed actions.','Enforce tool-call and time budgets, resource authorization and approved destinations in code.','Bind approval to the exact payload. Simulate changed recipients, expired approval and unknown tool results.','Test crashes, duplicate retries, cancellation and injected document instructions. Use an in-memory fake service while developing.'],proof:['State-transition diagram with terminal outcomes.','Tests proving no send without authorization and approval.','Trace of a budget-exhausted run without fabricated success.','Recovery policy and idempotency demonstration.']},
 {title:'Serving and adaptation decision report',deliverable:'A measured or explicitly estimated plan for inference memory, cost and possible LoRA adaptation.',steps:['Choose a documented model architecture. Record parameter count, KV heads, layers, head dimension, dtype and target workload.','Estimate weights, KV cache and overhead with consistent GB/GiB units. Separate training memory from inference memory.','Compare prompt examples and retrieval before choosing fine-tuning. Define a licensed data split and regression checks for any training experiment.','If hardware is available, measure peak memory, throughput and tail latency. If it is not, label calculations as estimates and state the missing evidence.'],proof:['Editable assumptions and reproducible calculations.','Quality/cost/latency comparison against a simpler baseline.','Dataset provenance and leakage checks.','A rollout, monitoring and rollback plan.']},
];
export const codingTasks=[
 {title:'Cosine similarity',prompt:'Implement a similarity function that rejects unequal dimensions, empty vectors and zero norms.',solution:`import math

def cosine(a, b):
    if not a or len(a) != len(b):
        raise ValueError("equal non-empty dimensions required")
    if not all(math.isfinite(x) for x in [*a, *b]):
        raise ValueError("finite values required")
    na = math.sqrt(sum(x*x for x in a))
    nb = math.sqrt(sum(x*x for x in b))
    if na == 0 or nb == 0:
        raise ValueError("zero vector")
    return sum(x*y for x,y in zip(a,b)) / (na*nb)

assert math.isclose(cosine([1,0], [.8,.6]), .8)
assert math.isclose(cosine([1,0], [0,1]), 0)
try:
    cosine([0,0], [1,0])
    raise AssertionError("zero vector must be rejected")
except ValueError:
    pass
print("Cosine checks passed")`,limit:'Small dense vectors only. A production implementation must handle numeric stability, model compatibility and the selected index metric.'},
 {title:'Bounded overlapping chunks',prompt:'Split a word list into overlapping chunks without an infinite loop or fully duplicated extra tail. Explain why word chunks are not token chunks.',solution:`def chunks(words, size, overlap):
    if not isinstance(size, int) or not isinstance(overlap, int):
        raise ValueError("integer settings required")
    if size <= 0 or overlap < 0 or overlap >= size:
        raise ValueError("require 0 <= overlap < size")
    result = []
    start = 0
    while start < len(words):
        end = min(start + size, len(words))
        result.append(words[start:end])
        if end == len(words):
            break
        start = end - overlap
    return result

assert chunks(list(range(7)), 4, 1) == [[0,1,2,3],[3,4,5,6]]
assert chunks([], 4, 1) == []
try:
    chunks([1,2], 2, 2)
    raise AssertionError("invalid overlap must fail")
except ValueError:
    pass
print("Chunk checks passed")`,limit:'This teaches boundaries using words. Real token budgets require the target tokenizer; document structure and metadata also matter.'},
 {title:'Reciprocal rank fusion',prompt:'Merge ranked document IDs, deduplicate within each list and make ties deterministic.',solution:`def rrf(rankings, k=60):
    if k <= 0:
        raise ValueError("k must be positive")
    scores = {}
    for ranking in rankings:
        unique = list(dict.fromkeys(ranking))
        for rank, doc in enumerate(unique, 1):
            scores[doc] = scores.get(doc, 0) + 1 / (k + rank)
    return sorted(scores.items(), key=lambda x: (-x[1], x[0]))

result = rrf([["a", "a", "b"], ["b", "a"]])
assert [doc for doc, score in result] == ["a", "b"]
assert rrf([]) == []
assert rrf([["a", "a"]]) == rrf([["a"]])
print("Rank fusion checks passed")`,limit:'Rank fusion cannot make unauthorized or irrelevant documents safe. Apply authorization consistently and evaluate relevance.'},
 {title:'Validate citation provenance',prompt:'Reject an answer that references a document outside the actual authorized retrieval set. Do not treat a valid citation ID as proof that a claim is supported.',solution:`def citations_allowed(citations, retrieved):
    if not citations:
        return False
    allowed = set(retrieved)
    return all(isinstance(c, str) and c in allowed for c in citations)

assert citations_allowed(["policy-42"], ["policy-42", "claim-7"])
assert not citations_allowed(["other-user-policy"], ["policy-42"])
assert not citations_allowed([], ["policy-42"])
print("Citation membership checks passed")`,limit:'This checks membership only. You still need user-scoped retrieval, claim-to-evidence support checking and source quality.'},
];

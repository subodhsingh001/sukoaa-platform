'use client';
import { useId, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { Lesson } from '@/lib/system-design/types';
import { activePaths } from '@/lib/system-design/walkthrough';
const positions = [[125, 110], [500, 110], [875, 110], [315, 300], [685, 300]];
export function DiagramWalkthrough({ lesson }: {
    lesson: Lesson;
}) {
    const [at, setAt] = useState(0), id = useId().replace(/:/g, '');
    const step = lesson.flow.steps[at], active = new Set(activePaths(lesson, at)), failed = new Set(step.failed || []);
    return <section className="sd-explorer"><div className="sd-explorer-head"><div><h2>Trace one step at a time</h2><p>Move through the diagram at your pace. Teal paths are active; unavailable components are labelled.</p></div><button aria-label="Restart diagram walkthrough" onClick={() => setAt(0)}><RotateCcw size={16}/></button></div>
 <div className="sd-step-choices" role="group" aria-label="Diagram step">{lesson.flow.steps.map((s, i) => <button key={s.title} aria-pressed={at === i} onClick={() => setAt(i)}>{i + 1}<span className="sd-sr-only">: {s.title}</span></button>)}</div>
 <div className="sd-diagram-scroll" tabIndex={0} role="region" aria-label="Scrollable architecture diagram"><svg className="sd-live-diagram" viewBox="0 0 1000 400" role="img" aria-label={lesson.title + ': ' + step.title + '. ' + step.metric}>
 <defs><marker id={id + 'active'} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#087f86"/></marker><marker id={id + 'idle'} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#adbdba"/></marker></defs>
 {lesson.flow.edges.map(([a, b], i) => { const [ax, ay] = positions[a], [bx, by] = positions[b], dx = bx - ax, dy = by - ay, r = Math.min(dx ? 105 / Math.abs(dx) : Infinity, dy ? 38 / Math.abs(dy) : Infinity); return <line key={i} x1={ax + dx * r} y1={ay + dy * r} x2={bx - dx * r} y2={by - dy * r} className={active.has(i) ? 'sd-flow-active' : 'sd-flow-idle'} markerEnd={'url(#' + id + (active.has(i) ? 'active' : 'idle') + ')'}/>; })}
 {lesson.flow.nodes.map((name, i) => { const [x, y] = positions[i]; const words = name.split(' '), cut = Math.ceil(words.length / 2), two = name.length > 17; return <g key={name}><rect x={x - 111} y={y - 39} width={222} height={78} rx={8} fill={failed.has(i) ? '#fff0f1' : 'white'} stroke={failed.has(i) ? '#a52b39' : '#a6c5b9'} strokeWidth={3}/><text x={x} y={y + (two ? -6 : 7)} textAnchor="middle" fill="#20382f" fontSize="21" fontWeight="600">{two ? <><tspan x={x}>{words.slice(0, cut).join(' ')}</tspan><tspan x={x} dy="27">{words.slice(cut).join(' ')}</tspan></> : name}</text>{failed.has(i) && <text x={x} y={y + 64} textAnchor="middle" fill="#a52b39" fontSize="20" fontWeight="600">Unavailable</text>}</g>; })}
 </svg></div><div className="sd-flow-description" aria-live="polite"><p className="sd-meta">Step {at + 1} of {lesson.flow.steps.length} · {step.metric}</p><h3>{step.title}</h3><p>{step.detail}</p></div>
 <div className="sd-actions"><button disabled={!at} onClick={() => setAt(n => n - 1)}><ChevronLeft size={16}/>Previous step</button><button disabled={at === lesson.flow.steps.length - 1} onClick={() => setAt(n => n + 1)}>Next step<ChevronRight size={16}/></button></div></section>;
}

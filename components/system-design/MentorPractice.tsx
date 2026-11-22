'use client';
import { useState } from 'react';
import type { Teaching } from '@/lib/system-design/types';
export function MentorPractice({ material }: {
    material: Teaching;
}) {
    const [prediction, setPrediction] = useState(false), [expected, setExpected] = useState(false), [checked, setChecked] = useState<number[]>([]);
    return <section className="sd-mentor-practice"><section className="sd-prediction"><h2>Pause and make a prediction</h2><p>{material.prediction.question}</p><p className="sd-meta">Answer aloud or write your reasoning in the lesson notes before revealing the explanation.</p><button aria-expanded={prediction} onClick={() => setPrediction(x => !x)}>{prediction ? 'Hide the reasoning' : 'Reveal the reasoning'}</button>{prediction && <div className="sd-reference"><p>{material.prediction.answer}</p></div>}</section>
 <section className="sd-misconception"><h2>Correct a common misunderstanding</h2><p><strong>Claim to question:</strong> {material.misconception.claim}</p><p><strong>Better explanation:</strong> {material.misconception.correction}</p></section>
 <section className="sd-practice-task"><h2>{material.lab.title}</h2><p className="sd-meta">A paper or whiteboard task. No cloud account or paid infrastructure is required.</p><ol>{material.lab.steps.map(s => <li key={s}>{s}</li>)}</ol><button aria-expanded={expected} onClick={() => setExpected(x => !x)}>{expected ? 'Hide expected outcome' : 'Check the expected outcome'}</button>{expected && <div className="sd-reference"><p>{material.lab.expected}</p></div>}</section>
 <section className="sd-confidence"><h2>Check what you can explain</h2><p>This is your self-check, not an automated grade. Try again without the diagram tomorrow.</p>{material.goals.map((g, i) => <label key={g}><input type="checkbox" checked={checked.includes(i)} onChange={e => setChecked(x => e.target.checked ? [...x, i] : x.filter(n => n !== i))}/>{g}</label>)}<p role="status">{checked.length === material.goals.length ? 'Explain these from memory, then connect this topic to the next lesson.' : `${checked.length} of ${material.goals.length} goals checked. Choose one remaining idea to practise next.`}</p><p className="sd-meta">These checkboxes reset when you leave. Use your saved lesson notes and completion marker to record lasting progress.</p></section></section>;
}

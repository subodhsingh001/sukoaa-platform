'use client';
import {useEffect, useRef, useState} from 'react';
import './token-wording.css';

type Suggestion = {text: string; original: number; suggested: number; model: string};
function compareTokens(original: string, suggestion: string, encoding: string, signal: AbortSignal): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/runtime/tokenizers/' + encoding + '.js?v=4.1.1-1');
    let first: number | undefined;
    let second: number | undefined;
    const finish = (error?: string) => {
      clearTimeout(timer);
      signal.removeEventListener('abort', cancel);
      worker.terminate();
      if (error) reject(new Error(error));
      else resolve([first!, second!]);
    };
    const cancel = () => finish('Request cancelled.');
    const timer = setTimeout(() => finish('The local tokenizer could not compare the suggestion. Retry loading the tokenizer.'), 20000);
    signal.addEventListener('abort', cancel, {once: true});
    if (signal.aborted) {cancel(); return;}
    worker.onerror = () => finish('The local comparison tokenizer could not load. Run npm run prepare:runtimes and retry.');
    worker.onmessage = ({data}) => {
      if (data.type === 'ready') {
        worker.postMessage({id: 1, text: original});
        worker.postMessage({id: 2, text: suggestion});
      } else if (data.error) finish('The local tokenizer could not compare this text.');
      else if (Array.isArray(data.tokens)) {
        if (data.id === 1) first = data.tokens.length;
        if (data.id === 2) second = data.tokens.length;
        if (first !== undefined && second !== undefined) finish();
      }
    };
  });
}

export function TokenWording({text, encoding, onApply}: {text: string; encoding: string; onApply: (text: string) => void}) {
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [result, setResult] = useState<Suggestion | null>(null);
  const abort = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const current = useRef({text, encoding});
  current.current = {text, encoding};
  useEffect(() => {
    sequence.current++;
    abort.current?.abort();
    setBusy(false); setResult(null); setError(''); setNotice('');
    return () => {sequence.current++; abort.current?.abort();};
  }, [text, encoding]);

  async function suggest() {
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    const id = ++sequence.current;
    const original = text;
    const selectedEncoding = encoding;
    const isCurrent = () => sequence.current === id && current.current.text === original && current.current.encoding === selectedEncoding && !controller.signal.aborted;
    setBusy(true); setError(''); setNotice(''); setResult(null);
    const timeout = setTimeout(() => controller.abort(), 55000);
    try {
      const response = await fetch('/api/token-wording', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({text: original, consent}), signal: controller.signal, cache: 'no-store'});
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'The wording service is unavailable.');
      if (typeof data.suggestion !== 'string' || typeof data.model !== 'string') throw new Error('The wording service returned an invalid response.');
      if (!isCurrent()) return;
      const [before, after] = await compareTokens(original, data.suggestion, selectedEncoding, controller.signal);
      if (isCurrent()) setResult({text: data.suggestion, original: before, suggested: after, model: data.model});
    } catch (e) {
      if (sequence.current === id && current.current.text === original && current.current.encoding === selectedEncoding) setError(controller.signal.aborted ? 'Request cancelled or timed out. Your original text is unchanged.' : e instanceof Error ? e.message : 'The suggestion could not load.');
    } finally {
      clearTimeout(timeout);
      if (sequence.current === id) setBusy(false);
    }
  }
  const savings = result ? result.original - result.suggested : 0;
  return <section className="token-wording" aria-labelledby="token-wording-heading">
    <div className="token-wording-heading"><div><span className="token-wording-badge">LOCAL DEVELOPMENT · OPTIONAL AI</span><h2 id="token-wording-heading">Suggest shorter wording</h2></div><span>Powered by Gemini</span></div>
    <p>Ask Google to shorten your text, then compare exact counts using {encoding}. Review details, names, numbers and conditions before using a suggestion.</p>
    <p className="ut-note">Only this action sends your text through your local server to Google. Free-tier inputs and responses may be used for product improvement and human review. Do not send personal, confidential or sensitive information. Sukoaa does not save the request text.</p>
    <label className="token-wording-consent"><input type="checkbox" checked={consent} disabled={busy} onChange={e => setConsent(e.target.checked)}/>I understand and allow this text to be sent to Google.</label>
    <div className="token-wording-actions"><button type="button" disabled={!consent || busy || !text.trim() || text.length > 8000} onClick={suggest}>{busy ? 'Generating and comparing…' : 'Suggest shorter wording with Gemini'}</button>{busy && <button type="button" onClick={() => abort.current?.abort()}>Cancel</button>}<span className="ut-note">Up to 8,000 characters · 10 attempts/hour per local server process</span></div>
    {text.length > 8000 && <p className="ut-warn">Shorten the input to 8,000 characters to request AI wording. Local token counting supports 200,000 characters.</p>}
    {error && <p className="ut-warn" role="alert">{error}</p>}
    <p role="status" aria-live="polite">{busy ? 'Waiting for Google, then counting both versions locally…' : notice}</p>
    {result && <div>
      <div className="ut-stats"><div><b>{result.original.toLocaleString()}</b><span>original tokens</span></div><div><b>{result.suggested.toLocaleString()}</b><span>suggestion tokens</span></div><div><b>{savings > 0 ? savings.toLocaleString() : '0'}</b><span>tokens saved</span></div><div><b>{savings > 0 && result.original ? (100 * savings / result.original).toFixed(1) + '%' : '0%'}</b><span>reduction</span></div></div>
      {savings <= 0 && <p className="ut-warn">This suggestion does not reduce tokens with {encoding}. Your original may be the better choice.</p>}
      <div className="token-wording-comparison"><label className="ut-label">Original<textarea readOnly value={text} rows={7}/></label><label className="ut-label">AI suggestion<textarea readOnly value={result.text} rows={7}/></label></div>
      <p className="ut-note">Generated by {result.model}. Meaning preservation is not guaranteed. Counts above use {encoding}; they are not Gemini billing tokens and exclude the tokens used to generate this suggestion.</p>
      <div className="token-wording-actions"><button type="button" onClick={() => onApply(result.text)}>Use suggestion</button><button type="button" onClick={async () => {try {await navigator.clipboard.writeText(result.text); setNotice('Suggestion copied.');} catch {setNotice('Copy failed. Select and copy the suggestion manually.');}}}>Copy suggestion</button><button type="button" onClick={() => {setResult(null); setNotice('Suggestion dismissed. Your original text is unchanged.');}}>Dismiss</button></div>
    </div>}
  </section>;
}
